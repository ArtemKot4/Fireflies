abstract class LocalTileEntity implements TileEntity.LocalTileEntityPrototype {
    public events: { [packetName: string]: (packetData: any, packetExtra: any) => void; };

    public containerEvents?: { [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow, windowContent: com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent, eventData: any) => void; };
    
    public eventNames: {
        network: string[],
        container: string[]
    };

    /**@deprecated */

    public load() {};

    /**@deprecated */

    public unload() {};

    /**@deprecated */

    public tick(): void {};

    public onLoad(): void {};
    public onUnload(): void {};
    public onTick(): void {};

    public constructor() {
        this.tick = this.onTick;
        this.load = this.onLoad;
        this.unload = this.onUnload;

        if(this.eventNames) {
            this.events = {};
            this.containerEvents = {};

            for(const i in this.eventNames.network) {
                const name = this.eventNames.network[i];

                this.events[name] = this[name];
            };
    
            for(const i in this.eventNames.container) {
                const name = this.eventNames.container[i];

                this.containerEvents[name] = this[name];
            };
        };
    };
};