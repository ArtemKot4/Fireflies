abstract class LocalTileEntity implements TileEntity.LocalTileEntityPrototype {
    public events: { [packetName: string]: (packetData: any, packetExtra: any) => void; } = {};

    public containerEvents?: { [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow, windowContent: com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent, eventData: any) => void; } = {};
    public load() {
        return this.onLoad();
    };

    public unload() {
        return this.onUnload();
    };

    public tick() {
        return this.onTick();
    };

    public onLoad() {};
    public onUnload() {};
    public onTick(): boolean | void {};

    public constructor() {};
};