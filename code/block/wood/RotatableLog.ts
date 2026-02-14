class RotatableLog extends BasicBlock implements IPlaceCallback {
    constructor(id: string, texture?: string) {
        texture = texture || id;
        const upperTexture = texture + "_top";
        const sideTexture = texture + "_side";
        
        super(id, [{
            inCreative: true,
            name: "block.infinite_forest." + id,
            texture: [
                [upperTexture, 0], 
                [upperTexture, 0], 
                [sideTexture, 0]
            ]      
        },
        {
            texture: [
                [sideTexture, 0], 
                [sideTexture, 0], 
                [upperTexture, 0], 
                [upperTexture, 0], 
                [sideTexture, 0]
            ]
        },
        {
            texture: [
                [sideTexture, 0], 
                [sideTexture, 0], 
                [sideTexture, 0], 
                [sideTexture, 0], 
                [upperTexture, 0]
            ] 
        }]);
    };

    public onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): void | Vector {
        let data = 0;
        
        switch(coords.side) {
            case 5:
                data = 2;
                break;
            case 4:
                data = 2;
                break;
            case 3:
                data = 1;
                break;
            case 2:
                data = 1;
                break;
        }
        region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, this.id, data);
    }

    public override getSoundType(): Block.Sound {
        return "wood";
    }

    public override getDrop(coords: Callback.ItemUseCoordinates, id: number, data: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[] {
        return [[id, 1, 0]];
    }
}