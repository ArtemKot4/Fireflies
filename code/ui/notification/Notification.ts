/**
 * Class to create custom notification animations, be like as minecraft achievement animation.
 * @example
 * ```ts
    namespace ENotificationStyle {
        export const LEARNING: INotificationStyle = {
            scale: 2.3,
            width: 240,
            height: 40,
            wait_time: 2000,
            queue_time: 1000,
            background: {
                default_x: 0,
                default_y: 0,
                icon: {
                    image: {
                        bitmap: "notification",
                        width: 240,
                        height: 40
                    }
                }
            },
            text: {
                default_x: 48,
                default_y: 30,
                text: {
                    max_line_length: 30
                }
            },
            icon: {
                default_x: 8,
                default_y: 10,
                icon: {
                    image: {    
                        width: 27,
                        height: 27
                    },
                    item: {
                        default_x: 2.25,
                        default_y: 0,
                        size: 90
                    }
                }
            }
        };  
    };

    Notification.addStyle("learning", ENotificationStyle.LEARNING);

    Callback.addCallback("ItemUse", function(c, item, b, isE, player) {
        Notification.get("achievement").sendFor(player, NotificationStyleList.LEARNING, {
            text: {
                text: {
                    text: Item.getName(item.id, item.data)
                }
            },
            icon: {
                icon: {
                    image_type: "item",
                    image: String(item.id)
                }
            }
        })
    });
 * ```
 */

    
abstract class Notification {
    public static list: Record<string, Notification> = {};

    public constructor() {
        Network.addClientPacket(`packet.fireflies.send_${this.getType()}_notification`, (data: INotificationInputData) => {
            return this.init(data.style_name, data.runtime_style);
        });

        Notification.list[this.getType()] = this;
    };

    /**
     * Method to get specified Notification by type. {@link AchievementNotification} for example can be got with Notification.{@link get}("achievement")
     * @param type type of the notification
     */

    public static get<T extends Notification>(type: string): T {
        if(!(type in this.list)) {
            throw new java.lang.NoSuchFieldException("Notification: notification not found");
        };
        return this.list[type] as T;
    };

    public styles: Record<string, INotificationStyle> = {};
    public queue: INotificationInputData[] = [];
    public lock: boolean = false;
    public stop: boolean = false;
    
    public UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        window.setDynamic(true);
        window.setTouchable(false);
        return window;
    })();

    public addStyle(name: string, style: INotificationStyle): void {
        this.styles[name] = style;
    };

    /**
     * Method to get type of notification
     */
    
    abstract getType(): string;

    public setStop(stop: boolean): void {
        this.stop = stop;
    };

    /**
     * Method clears queue
     */

    public clearQueue(): void {
        this.queue = [];
    };

    /**
     * Changes lock state
     * @param lock lock state
     */

    public setLock(lock: boolean): void {
        this.lock = lock;
    };

    protected getData(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams): INotificationWindowData {
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
                    y: height + (description.default_y * style.scale),
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

    /**
     * Method to open notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data. It can be text or image
     */

    public init(styleName: string, runtimeStyle: INotificationRuntimeParams): void {
        this.setStop(false);

        if(this.lock || LocalData.screenName !== EScreenName.IN_GAME_PLAY_SCREEN) {
            this.queue.push({ style_name: styleName, runtime_style: runtimeStyle });
            return;
        };

        if(!(styleName in this.styles)) {
            throw new java.lang.NoSuchFieldException(`Notification error: style ${styleName} is not exists`);
        };

        const style = this.styles[styleName];
        const data = this.getData(style, runtimeStyle);

        if(!this.UI.isOpened()) {
            this.UI.open();
        };

        this.setLock(true);
        this.UI.setContent(data.content);
        this.UI.forceRefresh();

        data.sleep_time = data.sleep_time || style.sleep_time || 3;
        data.queue_time = data.queue_time || style.queue_time || 1000;
        data.wait_time = data.wait_time || style.wait_time || 2000;

        this.onInit(style, data);

        Threading.initThread(`thread.ui.${this.getType()}_notification`, () => {
            while(this.stop == false) {
                java.lang.Thread.sleep(data.sleep_time);
                this.run(style, data);
            };
        });
    };

    /**
     * Method {@link init}s  and deletes last notification from queue
     */

    public initLast(): void {
        if(this.queue.length > 0) {
            const data = this.queue.shift();
            if(data) {
                this.init(data.style_name, data.runtime_style);
            };
        };
    };

    /**
     * Method, calls after opening ui. It can be used to set default values.
     * @param style Notification style from init.
     * @param description Description of window.
     */

    protected onInit(style: INotificationStyle, description: INotificationWindowData): void {};

    protected abstract run(style: INotificationStyle, description: INotificationWindowData): void;

    /**
     * Method to send player from server notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data. It can be text or image
     */

    public sendFor(player_uid: number, styleName: string, runtimeStyle: INotificationRuntimeParams): void {
        const client = Network.getClientForPlayer(player_uid);

        if(client) {
            client.send(`packet.fireflies.send_${this.getType()}_notification`, { style_name: styleName, runtime_style: runtimeStyle });
        };
    };

    public onClose() {};

    public close() {
        this.onClose();
        this.UI.close();
    };
};

Callback.addCallback("LocalLevelLeft", () => {
    for(const i in Notification.list) {
        const notification = Notification.list[i];

        notification.clearQueue();
        notification.setStop(true);
    };
});

Callback.addCallback("NativeGuiChanged", function(name: EScreenName, lastName, isPushEvent) {
    LocalData.screenName = name;

    if(name === EScreenName.IN_GAME_PLAY_SCREEN) {
        for(const i in Notification.list) {
            const notification = Notification.list[i];

            notification.initLast();
        };
    };
});

namespace ENotificationStyle {
    export const LEARNING: INotificationStyle = {
        scale: 2.3,
        width: 240,
        height: 40,
        wait_time: 2000,
        queue_time: 1000,
        background: {
            default_x: 0,
            default_y: 0,
            icon: {
                image: {
                    bitmap: "notification",
                    width: 240,
                    height: 40
                }
            }
        },
        text: {
            default_x: 48,
            default_y: 20,
            text: {
                font: {
                    color: android.graphics.Color.BLACK
                },
                max_line_length: 30
            }
        },
        icon: {
            default_x: 8,
            default_y: 10,
            icon: {
                image: {    
                    width: 27,
                    height: 27
                },
                item: {
                    default_x: 2.25,
                    default_y: 0,
                    size: 90
                }
            }
        }
    };
};

Notification.get("achievement").addStyle("learning", ENotificationStyle.LEARNING);

Callback.addCallback("ItemUse", function(c, item, b, isE, player) {
    const obj = {
        text: {
            text: {
                text: Item.getName(item.id, item.data)
            }
        },
        icon: {
            icon: {
                image_type: "item",
                image: String(item.id)
            }
        }
    } as INotificationRuntimeParams;

    if(Entity.getSneaking(player)) {
        Notification.get("achievement").sendFor(player, "learning", obj);
    } else {
        Notification.get("transparent").sendFor(player, "learning", obj);
    };
}); //debug