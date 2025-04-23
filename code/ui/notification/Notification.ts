/**
 * Class to create custom notification animations, be like as minecraft achievement animation.
 * @example
 * ```ts
    class TransparentNotification extends Notification {
        public mark: boolean = false;

        protected onInit(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void {
            this.mark = false;
            this.UI.layout.setAlpha(0);
        };

        public setAlpha(value: number): void {
            this.UI.layout.setAlpha(value);
        };

        protected run(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, data: INotificationWindowData): boolean {
            const alpha = this.UI.layout.getAlpha();
            if(alpha < 1 && !this.mark) {
                this.setAlpha(alpha + 0.01);
            } else {
                if(!this.mark) {
                    this.mark = true;
                    java.lang.Thread.sleep(data.waitTime);
                };
            };
            if(this.mark) {
                this.setAlpha(alpha - 0.01);
                if(alpha <= 0) {
                    java.lang.Thread.sleep(style.queueTime);
                    this.close();

                    return true;
                };
            };
        };      
    };

    Notification.register("transparent", new TransparentNotification());

    namespace ENotificationStyle {
        export const TRANSPARENT: INotificationStyle = {
            waitTime: 2000,
            queueTime: 1000,
            scale: 2.3,
            width: 220,
            height: 30,
            frame: {
                type: "custom",
                x: 0,
                y: 0,
                width: 220 * 2.3,
                height: 30 * 2.3,
                custom: {
                    onSetup(element) {
                        const paint = this.paint = new android.graphics.Paint();
                        paint.setStyle(android.graphics.Paint.Style.STROKE);
                        paint.setARGB(100, 0, 0, 0);
        
                        element.setSize(220 * 2.3, 30 * 2.3);
                    },
                    onDraw(element, canvas, scale) {
                        canvas.drawRect(0, 0, canvas.getWidth(), canvas.getHeight(), this.paint);
                    }
                }
            },
            text: {
                type: "text",
                x: 48,
                y: 15,
                font: {
                    color: android.graphics.Color.WHITE,
                },
                maxLineLength: 30
            },
            icon: {
                type: "image",
                x: 8,
                y: 10,
            }
        };
    };

    Notification.get("transparent").addStyle("transparent", ENotificationStyle.TRANSPARENT);

    Callback.addCallback("ItemUse", function(c, item, b, isE, player) {
        const obj = {
            text: {
                type: "text",
                text: Item.getName(item.id, item.data)
            },
            icon: {
                type: "image",
                item: item.id
            }
        } as INotificationRuntimeParams;

        Notification.get("transparent").sendFor(player, "transparent", obj);
    }); 
 * ```
 */

    
abstract class Notification {
    public static list: Record<string, Notification> = {};

    public type: string;
    public styles: Record<string, INotificationStyle> = {};
    public queue: INotificationInputData[] = [];
    public lock: boolean = false;
    public stop: boolean = false;
    public thread: java.lang.Thread;

    public UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        window.setDynamic(true);
        window.setTouchable(false);
        return window;
    })()

    public constructor(type?: string) {
        if(type) this.type = type;  
    };

    public buildPacket() {
        Network.addClientPacket(`packet.fireflies.send_${this.type}_notification`, (data: INotificationInputData) => {
            return this.init(data.styleName, data.runtimeStyle);
        });
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
    }

    public addStyle(name: string, style: INotificationStyle): this {
        this.styles[name] = style;
        return this;
    }   

    public setStop(stop: boolean): this {
        this.stop = stop;
        return this;
    }

    /**
     * Method clears queue
     */

    public clearQueue(): void {
        this.queue = [];
    }

    /**
     * Changes lock state
     * @param lock lock state
     */

    public setLock(lock: boolean): this {
        this.lock = lock;
        return this;
    }

    public getColor(): number {
        return android.graphics.Color.TRANSPARENT;
    }

    public getLocationX(): number {
        return 0;
    }

    public getLocationY(): number {
        return 0;
    }

    public getWidth(): number {
        return 200;
    }

    public getHeight(): number {
        return 100;
    }

    public getScale(): number {
        return 1;
    }

    public getSleepTime(): number {
        return 3;
    }

    public getQueueTime(): number {
        return 1000
    }

    public getWaitTime(): number {
        return 2000;
    }

    protected getDescription(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams): INotificationWindowData {
        const scale = runtimeStyle.scale || style.scale || this.getScale();
        const width = (runtimeStyle.width || style.width || this.getWidth()) * scale;
        const height = (runtimeStyle.height || style.height || this.getHeight()) * scale;

        const content = {
            location: {
                x: runtimeStyle.x || style.x || this.getLocationX(),
                y: runtimeStyle.y || style.y || this.getLocationY(),
                width,
                height
            },
            drawing: [{
                type: "background",
                color: runtimeStyle.color || style.color || this.getColor(),
            }],
            elements: {} as UI.ElementSet
        } satisfies UI.WindowContent;

        for(let element_name in style) {
            const description: NotificationElement = style[element_name];

            if(typeof description !== "number") {
                const runtime: INotificationRuntimeParams[string] = runtimeStyle[element_name] || ({} as NotificationElement);

                const defaultX = (runtime.x || description.x) * scale;
                const defaultY = (runtime.y || description.y) * scale;

                const element = Object.assign({}, description, runtime, {
                    x: defaultX,
                    y: defaultY
                }) as NotificationElement;

                if(description.text || runtime.text) {
                    const maxLineLength = (runtime.maxLineLength || description.maxLineLength) || 20;
                    const text = UIHelper.separateText(
                        Translation.translate(runtime.text || description.text), 
                        maxLineLength
                    );
                    element.text = text;
                    if(text.length > maxLineLength) {
                        element.multiline = true;
                    }
                }

                if(description.item || runtime.item) {
                    const item = runtime.item || description.item;

                    element.type = "slot";
                    element.bitmap = "unknown";
                    element.source = new ItemStack(typeof item == "string" ? IDRegistry.parseID(item) : item, 1, 0);
                    element.iconScale = 1;
                }

                if("onInit" in element) {
                    element.onInit(element, style, runtimeStyle);
                }

                content.elements[element_name] = element;
            }
        }

        return (
            { 
                content: content,
                queueTime: runtimeStyle.queueTime || style.queueTime || this.getQueueTime(), 
                sleepTime: runtimeStyle.sleepTime || style.sleepTime || this.getSleepTime(), 
                waitTime: runtimeStyle.waitTime || style.waitTime || this.getWaitTime()
            }
        )
    }

    public preventInit(styleName: string, runtimeStyle: INotificationRuntimeParams): boolean {
        return this.lock == true || RuntimeData.local.screenName !== EScreenName.IN_GAME_PLAY_SCREEN;
    };

    public onPreventInit(styleName: string, runtimeStyle: INotificationRuntimeParams): void {
        this.queue.push({ styleName: styleName, runtimeStyle: runtimeStyle });
    }

    public getStyle(styleName: string): INotificationStyle {
        if(!(styleName in this.styles)) {
            throw new java.lang.NoSuchFieldException(`Notification error: style ${styleName} is not exists`);
        }

        return this.styles[styleName];
    }

    /**
     * Method to open notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data. It can be text or image
     */

    public init(styleName: string, runtimeStyle: INotificationRuntimeParams): void {
        if(this.preventInit(styleName, runtimeStyle)) {
            return this.onPreventInit(styleName, runtimeStyle);
        }

        const style = this.getStyle(styleName);
        const description = this.getDescription(style, runtimeStyle);

        if(!this.UI.isOpened()) {
            this.UI.open();
        }

        this.setLock(true);
        this.UI.setContent(description.content);
        this.UI.updateWindowLocation();
        this.UI.forceRefresh();

        this.onInit(style, runtimeStyle, description);

        this.thread = this.initThread(style, runtimeStyle, description);  
    };

    /**
     * Method to init thread, contains logic of change notifications. 
     */

    public initThread(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): java.lang.Thread {
        return Threading.initThread(`thread.ui.${this.type}_notification`, () => {
            while(this.stop === false) {
                java.lang.Thread.sleep(description.sleepTime);

                const done = this.run(style, runtimeStyle, description);
                if(done === true) {
                    this.setLock(false)
                    this.initLast();
                    break;
                }
            }
        });
    };

    /**
     * Method {@link init}s  and deletes last notification from queue
     * @returns true if notification was inited
     */

    public initLast(): boolean {
        if(this.queue.length > 0 && RuntimeData.local.screenName === EScreenName.IN_GAME_PLAY_SCREEN) {
            const data = this.queue.shift();
            this.init(data.styleName, data.runtimeStyle);

            return true;
        }
        return false;
    }

    /**
     * Method, calls after opening ui. It can be used to set default values.
     * @param style Notification style from init.
     * @param description Description of window.
     */

    protected onInit(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void {}

    /**
     * Method, where your thread do work. Return true to reload thread with last element from queue.
     * @param style Notification style from init
     * @param runtimeStyle Notification runtime params from init
     * @param description result of {@link getDescription description}
     */
    protected abstract run(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): boolean;

    /**
     * Method to send player from server notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data. 
     */

    public sendFor(player_uid: number, styleName: string, runtimeStyle: INotificationRuntimeParams): void {
        const client = Network.getClientForPlayer(player_uid);

        if(client) {
            client.send(`packet.fireflies.send_${this.type}_notification`, { styleName: styleName, runtimeStyle: runtimeStyle });
        }
    }

    /**
     * Method, calls with using close function.
     * @param style Notification style from init.
     * @param runtimeStyle your runtime data. 
     * @param description result of {@link getDescription description}
     */

    public onClose(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData) {}

    public close(style?: INotificationStyle, runtimeStyle?: INotificationRuntimeParams, description?: INotificationWindowData): void {
        this.onClose(style, runtimeStyle, description);
        this.UI.close();
    }

    public static register(type: string, notification: Notification): Notification {
        if(type in Notification.list) {
            throw new java.lang.SecurityException("Notification: notification is already registered");
        };

        if(!notification.type) {
            notification.type = type;
            notification.buildPacket();
        };

        return Notification.list[type] = notification;
    }
}

Callback.addCallback("LocalLevelLeft", () => {
    for(const i in Notification.list) {
        const notification = Notification.list[i];

        notification.clearQueue();
        notification.setStop(true);
        notification.UI.close();
    }
});

Callback.addCallback("NativeGuiChanged", function(name: EScreenName, lastName, isPushEvent) {
    RuntimeData.local.screenName = name;

    if(name === EScreenName.IN_GAME_PLAY_SCREEN) {
        for(const i in Notification.list) {
            const notification = Notification.list[i];

            notification.initLast();
        }
    }
});

namespace ENotificationStyle {
    export const TRANSPARENT: INotificationStyle = {
        waitTime: 2000,
        queueTime: 1000,
        scale: 2.3,
        width: 180,
        height: 20,
        frame: {
            type: "custom",
            x: 0,
            y: 0,
            width: 220 * 2.3,
            height: 30 * 2.3,
            custom: {
                onSetup(element) {
                    this.paint = new android.graphics.Paint();
                    this.paint.setARGB(100, 0, 0, 0);
                    element.setSize(180 * 2.3, 20 * 2.3);
                },
                onDraw(element, canvas, scale) {
                    canvas.drawRect(0, 0, canvas.getWidth(), canvas.getHeight(), this.paint);
                }
            }
        },
        text: {
            type: "text",
            x: 48,
            y: 15,
            font: {
                color: android.graphics.Color.WHITE,
            },
            maxLineLength: 30
        },
        icon: {
            type: "image",
            x: 8,
            y: 10
        }
    };
};

Callback.addCallback("ItemUse", function(c, item, b, isE, player) {
    const obj = {
        text: {
            type: "text",
            text: Item.getName(item.id, item.data)
        },
        icon: {
            type: "image",
            item: item.id
        }
    } as INotificationRuntimeParams;

    if(Entity.getSneaking(player)) {
        Notification.get("achievement").sendFor(player, "transparent", obj);
    } else {
        Notification.get("transparent").sendFor(player, "transparent", obj);
    };
}); //debug