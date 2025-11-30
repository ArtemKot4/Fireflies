namespace Item {
    export type ILiquidStorageItemParams = ItemParams & LiquidItemRegistry.ILiquidStorage;
    export const holdFunctions: Record<number, Callback.ItemHoldFunction> = {};
    
    export function registerHoldFunctionForID(id: number, func: Callback.ItemHoldFunction) {
        Item.holdFunctions[id] = func;
    }

    export function registerHoldFunction(id: string | number, func: Callback.ItemHoldFunction) {
        Item.holdFunctions[typeof id == "string" ? IDRegistry.parseID(id) : id] = func;
    }

    export function createLiquidStorageItem(nameID: string, name: string, texture: TextureData, params: ILiquidStorageItemParams, data: number = 0): void {
        Item.createItem(nameID, name, texture, params);
        LiquidItemRegistry.registerLiquidStorage(IDRegistry.parseItemID(nameID), data, params);
    }
}

Callback.addCallback("ItemHold", (item, playerUid, slotIndex) => {
    const holdFunction = Item.holdFunctions[item.id];
    if(holdFunction != null) {
        return holdFunction(item, playerUid, slotIndex);
    }
});