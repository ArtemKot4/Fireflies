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
    /**
     * Scriptable object that contains data of tile entity.
     * You can use it instead {@link defaultValues}
     */
    public data: Scriptable;
    /**
     * Scriptable object that contains default data of tile entity.
     */
    public defaultValues: Scriptable;
    public container: ItemContainer;
    public liquidStorage: LiquidRegistry.Storage;
    public isLoaded: boolean;
    public remove: boolean;
    public noupdate: boolean;
    public readonly useNetworkItemContainer: boolean = true;
    public events: { [packetName: string]: (packetData: any, packetExtra: any) => void; };

    public containerEvents?: { [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow, windowContent: com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent, eventData: any) => void; };
    client?: LocalTileEntity;

    public eventNames: {
        network: string[],
        container: string[]
    };

    public constructor() {
        const localTileEntity = this.getLocalTileEntity();

        if(localTileEntity != null) {
            this.client = localTileEntity;
        };

        this.tick = this.onTick;
        this.init = this.onInit;
        this.load = this.onLoad;
        this.unload = this.onUnload;
        this.destroyBlock = this.onDestroyBlock;
        this.destroy = this.onDestroyTile;
        this.projectileHit = this.onProjectileHit;
      
        TileEntity.buildEvents(this);
        this.defaultValues = this.defaultValues || this.data;
        this.data = {};
    };

    public created(): void {};

    /**@deprecated
     * Use {@link onInit} instead
     */
    
    public init(): void {};

    /**@deprecated
     * Use {@link onLoad} instead
     */
    
    public load(): void {};
    
    /**@deprecated
     * Use {@link onUnload} instead
     */

    public unload(): void {};

    /**@deprecated */

    public update: () => void;

    public onCheckerTick(isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean): void {};

    public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData): boolean | void {};

    /**@deprecated
     * Use {@link onDestroyBlock} instead
     */

    public destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {};

    public redstone(params: Callback.RedstoneSignalParams): void {};

    /**@deprecated
     * Use {@link onProjectileHit} instead
     */

    public projectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void {};

    /**@deprecated
     * Use {@link onDestroyTile} instead
     */

    public destroy(): boolean | void {};

    /**@deprecated
     * Use {@link onTick} instead
     */

    public tick(): void {};
    public onInit(): void {};
    public onLoad(): void {};
    public onUnload(): void {};

    /**
     * Method, calls when player clicks on block with this tile entity. If method returns false, ui will be opened.
     * @param coords 
     * @param item 
     * @param player 
     * @returns boolean
     */

    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean | void {
        return false;
    };

    public onDestroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {};
    public onProjectileHit(coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget): void {};
    public onDestroyTile(): boolean | void {};
    public onTick(): void {};

    public getGuiScreen(): Nullable<UI.IWindow> {
        return null;
    };

    public getScreenByName(screenName?: string, container?: ItemContainer): Nullable<UI.IWindow> {
        return null;
    };

    public getScreenName(player: number, coords: Vector): string {
        return "main";
    };

    public onItemClick(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: Nullable<ItemExtraData>): boolean {
        if(!this.onClick( coords, new ItemStack(id, count, data, extra), player)) {
            const client = Network.getClientForPlayer(player);

            if(client) {
                const screenName = this.getScreenName(player, coords);
                const screen = this.getScreenByName(screenName, this.container);
                if(screenName && screen) {
                    this.container.openFor(client, screenName);
                    return true;
                };
            };
        };
        return false;
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
};

namespace TileEntity {
    export function buildEvents(prototype: TileEntity.TileEntityPrototype): void {
        if(prototype.eventNames) {
            prototype.events = {};
            prototype.containerEvents = {};

            for(const i in prototype.eventNames.network) {
                const name = prototype.eventNames.network[i];

                prototype.events[name] = this[name];
            };
    
            for(const i in prototype.eventNames.container) {
                const name = prototype.eventNames.container[i];

                prototype.containerEvents[name] = this[name];
            };
        };
    }
}