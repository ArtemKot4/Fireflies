abstract class LocalTileEntity implements LocalTileEntity {
    public events: { [packetName: string]: (packetData: any, packetExtra: any) => void; };

    public containerEvents?: { [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow, windowContent: com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent, eventData: any) => void; };
    
    public eventNames: {
        network: string[],
        container: string[]
    };

    /**@deprecated
     * Use {@link onLoad} instead
     */

    public load() {};

    /**@deprecated
     * Use {@link onUnload} instead
     */

    public unload() {};

    /**@deprecated
     * Use {@link onTick} instead
     */

    public tick(): void {};

    public onLoad(): void {};
    public onUnload(): void {};
    public onTick(): void {};

    public constructor() {
        this.tick = this.onTick;
        this.load = this.onLoad;
        this.unload = this.onUnload;

        TileEntity.buildEvents(this);
    };
};