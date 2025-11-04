abstract class LocalTileEntity implements LocalTileEntity {
    public events: { [packetName: string]: (packetData: any, packetExtra: any) => void; };
    public containerEvents?: { [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow, windowContent: com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent, eventData: any) => void };
    public eventNames: {
        network: string[],
        container: string[]
    };
    sendResponse: <T = {}>(packetName: string, someData: T) => {};

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

    public tick: () => void;
    public selection: () => void;

    public onLoad(): void {};
    public onUnload(): void {};
    public onTick?(): void;
    /**
     * Method, works if player looks and touchs block.
     */
    public onSelection?(): void;

    public constructor() {
        if("onTick" in this) {
            this.tick = this.onTick;
        }
        if("onSelection" in this) {
            this.selection = this.onSelection;
        }
        this.load = this.onLoad;
        this.unload = this.onUnload;

        TileEntity.buildEvents(this);
    }
}