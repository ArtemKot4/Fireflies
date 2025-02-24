abstract class CommonTileEntity implements TileEntity {
    public readonly x: number;
    public readonly y: number;
    public readonly z: number;
    public readonly dimension: number;
    public readonly blockID: number;
    public readonly blockSource: BlockSource;
    public readonly networkData: SyncedNetworkData;
    public readonly networkEntity: NetworkEntity;
    public readonly networkEntityType: NetworkEntityType;
    public readonly networkEntityTypeName: string;
    public data: Scriptable;
    public defaultValues: Scriptable;
    public container: ItemContainer | UI.Container;
    public liquidStorage: LiquidRegistry.Storage;
    public isLoaded: boolean;
    public remove: boolean;
    public noupdate: boolean;
    public useNetworkItemContainer?: boolean;
    public events: { [packetName: string]: (packetData: any, packetExtra: any) => void; } = {};

    public containerEvents?: { [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow, windowContent: com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent, eventData: any) => void; } = {};
    client?: LocalTileEntity;

    public created(): void {};
    
    public init(): void {
        return this.onInit();
    };
    
    public load(): void {
        Game.message("Debug. Тайл создан!")
        this.onLoad();
    };

    public unload(): void {
        this.onUnload();
    };

    public update(): void {
        this.onUpdate();
    };

    public onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void {};

    public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean | void {
        return this.onClick(new ItemStack(id, count, data, extra), coords, player);
    };

    public destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
        return this.onDestroyBlock(coords, player);
    };

    public redstone(params: Callback.RedstoneSignalParams): void {};

    public projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void {
        return this.onProjectileHit(coords, target);
    };

    public destroy(): boolean | void {
        return this.onDestroyTile();
    };

    public tick(): void {
        this.onTick();
    };

    public onInit() {};
    public onLoad() {};
    public onUnload() {};
    public onUpdate() {};
    public onClick(item: ItemStack, coords: Callback.ItemUseCoordinates, player: number): boolean | void {};
    public onDestroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {};
    public onProjectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void {};
    public onDestroyTile(): boolean | void {};
    public onTick(): void {};

    public getGuiScreen(): Nullable<UI.IWindow> {
        return null;
    };

    public getScreenByName(screenName?: string): Nullable<UI.IWindow> {
        return null;
    };

    public onItemClick(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: Nullable<ItemExtraData>): boolean {
        return this.onClick(new ItemStack(id, count, data, extra), coords, player) || false;
    };

    public requireMoreLiquid(liquid: string, amount: number): void {};
    public sendPacket: (name: string, data: object) => void;
    public sendResponse:(packetName: string, someData: object) => void;

    public selfDestroy(): void {
        TileEntity.destroyTileEntityAtCoords(this.x, this.y, this.z);
    };

    public getLocalTileEntity(): LocalTileEntity {
        return null;
    };

    public constructor() {
        const localTileEntity = this.getLocalTileEntity();

        if(localTileEntity != null) {
            this.client = localTileEntity;
        };
    };
};

class TestLocal extends LocalTileEntity {
    @NetworkEvent
    public msg() {
        Game.message("lol");
    };

    public onTick(): boolean | void {
        if(World.getThreadTime() % 60 === 0) {
            Game.message("local tick")
        };
    };
};

class Test extends CommonTileEntity {
    public override onTick() {
        this.sendPacket("msg", {});
        if(World.getThreadTime() % 20 === 0) {
            Game.message("hi");
        };
        return;
    };
    
    public override getLocalTileEntity(): LocalTileEntity {
        return new TestLocal();
    };

    public onClick(item: ItemStack, coords: Callback.ItemUseCoordinates, player: number): boolean | void {
        Game.message("click!")
    }
};

class bloklol extends BasicBlock {
    public override getTileEntity(): CommonTileEntity {
        return new Test();
    };
};

new bloklol("loool");

