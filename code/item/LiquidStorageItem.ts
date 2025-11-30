class LiquidStorageItem extends BasicItem {
    public constructor(stringID: string, texture: IItemTextureDescription, params: Item.ILiquidStorageItemParams, data: number = 0) {
        super(stringID, texture, params);
        LiquidItemRegistry.registerLiquidStorage(this.id, data, params);
    }
}