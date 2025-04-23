namespace Item {
    export const holdFunctions: Record<number, Callback.ItemHoldFunction> = {};
   
    export function registerHoldFunctionForID(id: number, func: Callback.ItemHoldFunction) {
        Item.holdFunctions[id] = func;
    }

    export function registerHoldFunction(id: string | number, func: Callback.ItemHoldFunction) {
        Item.holdFunctions[typeof id === "string" ? IDRegistry.parseID(id) : id] = func;
    }
}