namespace Item {
    export const holdFunctions: Record<number, Callback.ItemHoldFunction> = {};
    
    export function registerHoldFunctionForID(id: number, func: Callback.ItemHoldFunction) {
        Item.holdFunctions[id] = func;
    }

    export function registerHoldFunction(id: string | number, func: Callback.ItemHoldFunction) {
        Item.holdFunctions[typeof id == "string" ? IDRegistry.parseID(id) : id] = func;
    }
}

Callback.addCallback("ItemHold", (item, playerUid, slotIndex) => {
    const holdFunction = Item.holdFunctions[item.id];
    if(holdFunction != null) {
        return holdFunction(item, playerUid, slotIndex);
    }
});