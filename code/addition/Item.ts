namespace Item {
    export type ILiquidStorageItemParams = ItemParams & CanisterLiquidRegistry.ILiquidStorage;
    export const holdFunctions: Record<number, Callback.ItemHoldFunction> = {};
    
    export function registerHoldFunctionForID(id: number, func: Callback.ItemHoldFunction) {
        holdFunctions[id] = func;
    }

    export function registerHoldFunction(id: string | number, func: Callback.ItemHoldFunction) {
        holdFunctions[typeof id == "string" ? IDRegistry.parseID(id) : id] = func;
    }

    export function createLiquidStorageItem(nameID: string, name: string, texture: TextureData, { category, isTech, liquids, capacity }: ILiquidStorageItemParams, data: number = -1): void {
        Item.createItem(nameID, name, texture, {
            stack: 1,
            category: category || EItemCategory.ITEMS,
            isTech: isTech || false
        });
        CanisterLiquidRegistry.createFor(IDRegistry.parseItemID(nameID), liquids, capacity, data);
    }
}

Callback.addCallback("ItemHold", (item, playerUid, slotIndex) => {
    const holdFunction = Item.holdFunctions[item.id];
    if(holdFunction != null) {
        return holdFunction(item, playerUid, slotIndex);
    }
});