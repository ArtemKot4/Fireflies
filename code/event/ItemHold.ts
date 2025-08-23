Callback.addCallback("ServerPlayerTick", (playerUid) => {
    const actor = new PlayerActor(playerUid);
    const slot = actor.getSelectedSlot();
    const selectedItem = actor.getInventorySlot(slot);
    const carriedItem = Entity.getCarriedItem(playerUid);

    if(selectedItem.id !== 0 && selectedItem.id == carriedItem.id) {
        return Callback.invokeCallback<Callback.ItemHoldFunction>("ItemHold", selectedItem, playerUid, slot);
    };
});

Callback.addCallback("ItemHold", (item, playerUid, slotIndex) => {
    const holdFunction = Item.holdFunctions[item.id];

    if(holdFunction !== undefined) {
        return holdFunction(item, playerUid, slotIndex);
    };
});

declare namespace Callback {
    /** 
     * Function used in "ItemHold" callback. Callback works one time of 8 ticks.
     * @since 0.1a  
     * @param item ItemInstance of held item
     * @param playerUid unique identifier of holder player
     */

    export interface ItemHoldFunction {
        (item: ItemInstance, playerUid: number, slotIndex: number): void;
    }

    export function addCallback(name: "ItemHold", func: ItemHoldFunction, priority?: number): void;
};