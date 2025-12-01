abstract class BlockBush extends BlockPlant implements IClickCallback, IRandomTickCallback {
    public berryID: number;

    public getMaxStage() {
        return this.variationList.length - 1;
    }

    public constructor(stringID: string, variationList: Block.BlockVariation[], berryID: number) {
        super(stringID, variationList);
        this.berryID = berryID;
    }

    public abstract getChance(): number
    public abstract getCount(): [min: number, max: number];

    public onRandomTick(x: number, y: number, z: number, id: number, data: number, region: BlockSource): void {
        if(Math.random() > this.getChance()) return;

        if(data < this.getMaxStage()) {
            region.setBlock(x, y, z, id, data + 1);
        }
    }

    public onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        if(block.data === this.getMaxStage()) {
            const count = this.getCount();

            BlockSource.getDefaultForActor(player).spawnDroppedItem(
                coords.x + 0.5,
                coords.y + 0.7,
                coords.z + 0.5,
                this.berryID,
                MathHelper.randomNumber(count[0], count[1]),
                0
            );
        }
    }
}