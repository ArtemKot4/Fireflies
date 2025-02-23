abstract class CommonTileEntity implements TileEntity {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly dimension: number;
    readonly blockID: number;
    blockSource: BlockSource;
    readonly networkData: SyncedNetworkData;
    readonly networkEntity: NetworkEntity;
    readonly networkEntityType: NetworkEntityType;
    readonly networkEntityTypeName: string;
    data: Scriptable;
    defaultValues: Scriptable;
    container: ItemContainer | UI.Container;
    liquidStorage: LiquidRegistry.Storage;
    isLoaded: boolean;
    remove: boolean;
    noupdate: boolean;
    useNetworkItemContainer?: boolean;
    events?: {
        [packetName: string]: (packetData: any, packetExtra: any, connectedClient: NetworkClient) => void;
    };
    containerEvents?: {
        [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
    };
    client?: LocalTileEntity;

    public created(): void {}
    public init(): void {}
    public load(): void {}
    public unload(): void {};
    public update(): void {};
    public onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void {};
    public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean | void {};
    public destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {};
    public redstone(params: Callback.RedstoneSignalParams): void {};
    public projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void {};
    public destroy(): boolean | void {};

    public getGuiScreen(): Nullable<UI.IWindow> {
        return null;
    };

    public getScreenByName(screenName?: string): Nullable<UI.IWindow> {
        return null;
    };

    public onItemClick(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: Nullable<ItemExtraData>): void {};
    public requireMoreLiquid(liquid: string, amount: number): void {};
    public sendPacket(name: string, data: object): void {};
    public sendResponse(packetName: string, someData: object): void {};

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

namespace CommonTileEntity {
    export function NetworkEvent(target: CommonTileEntity, propertyName: string) {
        target.events[propertyName] = target[propertyName];
    };

    export function ContainerEvent(target: CommonTileEntity, propertyName: string) {
        target.containerEvents[propertyName] = target[propertyName];
    };
};

class TestLocal extends LocalTileEntity {
    @LocalTileEntity.NetworkEvent
    public msg() {
        Game.message("lol");
    }
}

class Test extends CommonTileEntity {

    tick() {
        return this.sendPacket("msg", {});
    }
    
    public getLocalTileEntity(): LocalTileEntity {
        return new TestLocal();
    };
};

class bloklol extends BasicBlock {
    public getTileEntity(): CommonTileEntity {
        return new Test();
    };
};

new bloklol("loool");

