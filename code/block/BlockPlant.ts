abstract class BlockPlant extends BasicBlock implements INeighbourChangeCallback, IPlaceCallback {
    public static allowedBlockList: number[] = [
        VanillaBlockID.dirt,
        VanillaBlockID.grass,
        VanillaBlockID.grass_path,
        VanillaBlockID.podzol,
        VanillaBlockID.mycelium
    ];

    public constructor(stringID: string, variationList: Block.BlockVariation[]) {
        super(stringID, variationList);
        Block.setEmptyCollisionShape(this.id);
    };

    public override getCreativeGroup(): string {
        return "nature";
    };

    public onNeighbourChange(coords: Vector, block: Tile, changedCoords: Vector, region: BlockSource): void {
        const bottomBlock = region.getBlockID(coords.x, coords.y - 1, coords.z);

        if(!BlockPlant.allowedBlockList.includes(bottomBlock)) {
            return region.destroyBlock(coords.x, coords.y, coords.z, true);
        };
    };

    public onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector {
        const upperBlock = region.getBlockID(coords.x, coords.y + 1, coords.z);
        const isAllowedBlock = BlockPlant.allowedBlockList.includes(block.id);
        
        if(isAllowedBlock && upperBlock === 0) {
            return region.setBlock(coords.x, coords.y + 1, coords.z, this.id, 0);
        };
    };

    public override isSolid(): boolean {
        return false;
    };

    public override getLightOpacity(): number {
        return 0;
    };

    public override getDestroyTime(): number {
        return 0;
    };

    public override getSoundType(): Block.Sound {
        return "grass";
    };

    public override getRenderType(): number {
        return 1;
    };
};