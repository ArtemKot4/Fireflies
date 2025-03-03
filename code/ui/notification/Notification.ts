class Notification {
    public static styles: Record<string, INotificationStyle> = {};

    public static addStyle(name: string, style: INotificationStyle): void {
        Notification.styles[name] = style;
    };

    private constructor() {};

    public static UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        window.setDynamic(true);
        window.setTouchable(false);
        return window;
    })();

    public static queue: INotificationInputData[] = [];
    public static lock: boolean = false;

    public static clearQueue(): void {
        this.queue = [];
    };

    public static setLock(lock: boolean): void {
        this.lock = lock;
    };

    public static getData(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams): INotificationWindowData {
        const coords: Record<string, { default_x: number, default_y: number }> = {};

        const width = style.width * style.scale;
        const height = style.height * style.scale;

        const content = {
            location: {
                x: style.x || 10,
                y: style.y || 0,
                width,
                height
            },
            drawing: [{
                type: "background",
                color: android.graphics.Color.argb(0, 0, 0, 0)
            }],
            elements: {} as UI.ElementSet
        } satisfies UI.WindowContent;

        for(let element_name in style) {
            const description = style[element_name] as INotificationElement;

            if(typeof description !== "number") {
                let defaultX = description.default_x * style.scale;
                let defaultY = description.default_y * style.scale;

                let element = {
                    x: description.default_x * style.scale,
                    y: -height + (description.default_y * style.scale),
                } as UI.UIImageElement | UI.UITextElement | UI.UISlotElement;

                const runtime = runtimeStyle[element_name] || {};

                if("icon" in description) {
                    runtime.icon = runtime.icon || {
                        image_type: "image",
                        image: description.icon.image.bitmap
                    };

                    const image = runtime.icon.image;

                    if(runtime.icon.image_type === "image") {
                        element.type = "image";
                        element.bitmap = image;
                        element.width = (runtime.icon.width || description.icon.image.width) * style.scale;
                        element.height = (runtime.icon.height || description.icon.image.height) * style.scale;
                    } else {
                        defaultX = description.icon.item.default_x * style.scale
                        defaultY = description.icon.item.default_y * style.scale;

                        element = UIHelper.getItemIcon(
                            image, 
                            defaultX, 
                            -height + defaultY, 
                            (runtime.icon.size || description.icon.item.size) ?? 70
                        );
                    };
                } else if("text" in description) {
                    element.type = "text";
                    element.font = runtime?.text?.font || description?.text?.font;

                    const text = runtime?.text.text || description?.text?.text;
                    element.text = UIHelper.separateText(Translation.translate(text), (description.text.max_line_length || runtime.text.max_line_length) || 20);
                } else {
                    Debug.message(`Notification error: unknown element type`);
                };

                content.elements[element_name] = element;

                coords[element_name] = {
                    default_x: defaultX,
                    default_y: defaultY
                };
            };
        };

        return (
            { 
                content, 
                coords, 
                queue_time: runtimeStyle.queue_time, 
                sleep_time: runtimeStyle.sleep_time, 
                wait_time: runtimeStyle.wait_time 
            }
        );
    };

    public static open(styleName: string, runtimeStyle: INotificationRuntimeParams): void {
        if(this.lock || LocalData.screenName !== EScreenName.IN_GAME_PLAY_SCREEN) {
            this.queue.push({ style_name: styleName, runtime_style: runtimeStyle });
            return;
        };

        if(!(styleName in Notification.styles)) {
            throw new java.lang.NoSuchFieldException(`Notification error: style ${styleName} is not exists`);
        };
        const style = Notification.styles[styleName];
        const data = this.getData(style, runtimeStyle);

        if(!this.UI.isOpened()) {
            this.UI.open();
        };

        this.setLock(true);
        this.UI.setContent(data.content);
        this.UI.forceRefresh();

        this.initAnimation(style, data);
        return;
    };

    public static updateElementHeights(description: {}, value: number): void {
        const elements = this.UI.getElements();

        for(const name in description) {
            elements.get(name).setPosition(description[name].default_x, value + description[name].default_y);
        };

        return;
    };

    public static initAnimation(style: INotificationStyle, description: INotificationWindowData): void {
        const sleep_time = description.sleep_time || style.sleep_time || 3;
        const queue_time = description.queue_time || style.queue_time || 1000;
        const wait_time = description.wait_time || style.wait_time || 2000;
        
        const maxHeight = style.height * style.scale;

        let mark: boolean = false;
        let height: number = -maxHeight;

        Threading.initThread("thread.ui.notification", () => {
            while(true) {
                java.lang.Thread.sleep(sleep_time);
                if(!mark) {
                    if(height < 0) {
                        this.updateElementHeights(description.coords, height += 1);
                    } else {
                        java.lang.Thread.sleep(wait_time);
                        mark = true;
                    };
                } else {
                    if(height > -maxHeight) {
                        this.updateElementHeights(description.coords,  height -= 1);
                    } else {
                        this.setLock(false);

                        if(this.queue.length > 0 && LocalData.screenName === EScreenName.IN_GAME_PLAY_SCREEN) {
                            java.lang.Thread.sleep(queue_time);

                            const notification = this.queue.shift();
                            this.open(notification.style_name, notification.runtime_style);
                            
                            return;
                        };

                        this.UI.close();
                        return;
                    };
                };
            };
        });
        return;
    };

    public static sendFor(player_uid: number, styleName: string, runtimeStyle: INotificationRuntimeParams): void {
        const client = Network.getClientForPlayer(player_uid);

        if(client) {
            client.send("packet.fireflies.send_notification", { style_name: styleName, runtime_style: runtimeStyle });
        };
    };
};

Network.addClientPacket("packet.fireflies.send_notification", (data: INotificationInputData) => {
    return Notification.open(data.style_name, data.runtime_style);
});

Callback.addCallback("LocalLevelLeft", () => {
    Notification.clearQueue();
});

Callback.addCallback("NativeGuiChanged", function(name: EScreenName, lastName, isPushEvent) {
    LocalData.screenName = name;

    if(name === EScreenName.IN_GAME_PLAY_SCREEN) {
        const data = Notification.queue.shift();

        if(data) {
            Notification.open(data.style_name, data.runtime_style);
        };
    };
});

// namespace NotificationStyles {
//     export const LEARNING: INotificationStyle = {
//         scale: 2.3,
//         width: 240,
//         height: 40,
//         wait_time: 2000,
//         queue_time: 1000,
//         background: {
//             default_x: 0,
//             default_y: 0,
//             icon: {
//                 image: {
//                     bitmap: "notification",
//                     width: 240,
//                     height: 40
//                 }
//             }
//         },
//         text: {
//             default_x: 48,
//             default_y: 37,
//             text: {
//                 max_line_length: 30
//             }
//         },
//         icon: {
//             default_x: 8,
//             default_y: 10,
//             icon: {
//                 image: {    
//                     width: 27,
//                     height: 27
//                 },
//                 item: {
//                     default_x: 2.25,
//                     default_y: 2.25,
//                     size: 90
//                 }
//             }
//         }
//     };

//     Notification.addStyle("learning", LEARNING);
// };