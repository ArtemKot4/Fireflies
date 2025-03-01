/**Class to create tile entities in separated client server side formats.
 * @example
 * ```ts 
 * class LocalExampleTile extends LocalTileEntity {
 *     @NetworkEvent
 *     public exampleMessagePacket(): void {
 *         Game.message("example");
 *         return;
 *     };
 * 
 *     public onTick(): void {
 *         Game.message("tick work")
 *     };
 * };
 * 
 * class ExampleTile extends CommonTileEntity {
 *     public getLocalTileEntity(): LocalTileEntity {
 *         return new LocalExampleTile();    
 *     };
 * 
 *     public onTick(): void {
 *         this.sendPacket("exampleMessagePacket", {});
 *     };
 * };
 * 
 * class ExampleBlock extends BasicBlock {
 *     public constructor() {
 *         super("example_block");
 *     };
 * 
 *     public override getTileEntity(): CommonTileEntity {
 *         return new ExampleTile();
 *     };
 * };
 * ```
 */

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
    public events: { [packetName: string]: (packetData: any, packetExtra: any) => void; };

    public containerEvents?: { [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow, windowContent: com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent, eventData: any) => void; };
    client?: LocalTileEntity;

    public eventNames: {
        network: string[],
        container: string[]
    };

    public created(): void {};

    /**@deprecated */
    
    public init(): void {};

    /**@deprecated */
    
    public load(): void {};
    
    /**@deprecated */

    public unload(): void {};

    /**@deprecated */

    public update: () => void;

    public onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void {};

    public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean | void {
        return this.onClick(new ItemStack(id, count, data, extra), coords, player);
    };

    /**@deprecated */

    public destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {};

    public redstone(params: Callback.RedstoneSignalParams): void {};

    /**@deprecated */

    public projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void {};

    /**@deprecated */

    public destroy(): boolean | void {};

    /**@deprecated */

    public tick(): void {};

    public onInit() {};
    public onLoad() {};
    public onUnload() {};
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
    public sendPacket: (name: string, data: object) => {};
    public sendResponse:(packetName: string, someData: object) => {};

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

        this.tick = this.onTick;
        this.onInit = this.init;
        this.onLoad = this.load;
        this.onUnload = this.unload;
        this.destroyBlock = this.onDestroyBlock;
        this.destroy = this.onDestroyTile;
        this.projectileHit = this.onProjectileHit;
        
      
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

Saver.addSavesScope