/**
 * Class to create custom notification animations, be like as minecraft achievement animation.
 * @example
 * ```ts
    namespace ENotificationStyle {
        export const LEARNING: INotificationStyle = {
            scale: 2.3,
            width: 240,
            height: 40,
            waitTime: 2000,
            queueTime: 1000,
            background: {
                defaultX: 0,
                defaultY: 0,
                icon: {
                    image: {
                        bitmap: "notification",
                        width: 240,
                        height: 40
                    }
                }
            },
            text: {
                defaultX: 48,
                defaultY: 30,
                text: {
                    max_line_length: 30
                }
            },
            icon: {
                defaultX: 8,
                defaultY: 10,
                icon: {
                    image: {    
                        width: 27,
                        height: 27
                    },
                    item: {
                        defaultX: 2.25,
                        defaultY: 0,
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
            return this.init(data.styleName, data.runtimeStyle);
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

    public thread: java.lang.Runnable;
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
    })()

    public addStyle(name: string, style: INotificationStyle): void {
        this.styles[name] = style;
    }

    /**
     * Method to get type of notification
     */
    
    abstract getType(): string;

    public setStop(stop: boolean): void {
        this.stop = stop;
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

    public setLock(lock: boolean): void {
        this.lock = lock;
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

    protected getDescription(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams): INotificationWindowData {
        const width = style.width * style.scale;
        const height = style.height * style.scale;

        const content = {
            location: {
                x: style.x || this.getLocationX(),
                y: style.y || this.getLocationY(),
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

                const defaultX = description.x * style.scale;
                const defaultY = description.y * style.scale;

                const element = Object.assign(description, runtime, {
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

                content.elements[element_name] = element;
            }
        }

        return (
            { 
                content: content,
                queueTime: runtimeStyle.queueTime, 
                sleepTime: runtimeStyle.sleepTime, 
                waitTime: runtimeStyle.waitTime 
            }
        )
    }

    /**
     * Method to open notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data. It can be text or image
     */

    public init(styleName: string, runtimeStyle: INotificationRuntimeParams): void {
        if(this.lock || RuntimeData.local.screenName !== EScreenName.IN_GAME_PLAY_SCREEN) {
            this.queue.push({ styleName: styleName, runtimeStyle: runtimeStyle });
            return;
        }

        if(!(styleName in this.styles)) {
            throw new java.lang.NoSuchFieldException(`Notification error: style ${styleName} is not exists`);
        }

        const style = this.styles[styleName];
        const description = this.getDescription(style, runtimeStyle);

        if(!this.UI.isOpened()) {
            this.UI.open();
        }

        this.setLock(true);
        this.UI.setContent(description.content);
        this.UI.updateWindowLocation();
        this.UI.forceRefresh();

        description.sleepTime = description.sleepTime || style.sleepTime || 3;
        description.queueTime = description.queueTime || style.queueTime || 1000;
        description.waitTime = description.waitTime || style.waitTime || 2000;

        this.onInit(style, description);

        Threading.initThread(`thread.ui.${this.getType()}_notification`, () => {
            while(this.stop === false) {
                const done = this.run(style, description);
                if(done === true) {
                    this.initLast();
                    break;
                };
                java.lang.Thread.sleep(description.sleepTime);
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
    };

    /**
     * Method, calls after opening ui. It can be used to set default values.
     * @param style Notification style from init.
     * @param description Description of window.
     */

    protected onInit(style: INotificationStyle, description: INotificationWindowData): void {}

    protected abstract run(style: INotificationStyle, description: INotificationWindowData): boolean;

    /**
     * Method to send player from server notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data. It can be text or image
     */

    public sendFor(player_uid: number, styleName: string, runtimeStyle: INotificationRuntimeParams): void {
        const client = Network.getClientForPlayer(player_uid);

        if(client) {
            client.send(`packet.fireflies.send_${this.getType()}_notification`, { styleName: styleName, runtimeStyle: runtimeStyle });
        }
    }

    public onClose() {}

    public close() {
        this.onClose();
        this.UI.close();
    }
}

Callback.addCallback("LocalLevelLeft", () => {
    for(const i in Notification.list) {
        const notification = Notification.list[i];

        notification.clearQueue();
        notification.setStop(true);
        notification.close();
    };
});

Callback.addCallback("NativeGuiChanged", function(name: EScreenName, lastName, isPushEvent) {
    RuntimeData.local.screenName = name;

    if(name === EScreenName.IN_GAME_PLAY_SCREEN) {
        for(const i in Notification.list) {
            const notification = Notification.list[i];

            notification.initLast();
        };
    };
});

namespace ENotificationStyle {
    export const TRANSPARENT: INotificationStyle = {
        waitTime: 2000,
        queueTime: 1000,
        scale: 2.3,
        width: 240,
        height: 40,
        frame: {
            type: "frame",
            x: 0,
            y: 0,
            width: 240,
            height: 60
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