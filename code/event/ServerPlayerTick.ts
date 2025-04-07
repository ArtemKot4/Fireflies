Callback.addCallback("ServerPlayerTick", (playerUid) => {
    if(World.getThreadTime() % 8 === 0) {
        const actor = new PlayerActor(playerUid);
        const slot = actor.getSelectedSlot();
        const selectedItem = actor.getInventorySlot(slot);
        const carriedItem = Entity.getCarriedItem(playerUid);

        if(selectedItem.id == carriedItem.id) {
            Callback.invokeCallback<Callback.ItemHoldFunction>("ItemHold", selectedItem, playerUid, slot);
        };
    };
});

Callback.addCallback("ItemHold", (item, playerUid) => {
    const handFunction = BasicItem.handFunctions.get(item.id);

    if(handFunction !== undefined) {
        return handFunction(item, playerUid);
    };
});

declare namespace Callback {
    /** 
     * Function used in "ItemHold" callback. Callback works one time of 8 ticks.
     * @since 0.1b  
     * @param item ItemInstance of held item
     * @param playerUid unique identifier of holder player
     */

    export interface ItemHoldFunction {
        (item: ItemInstance, playerUid: number, slotIndex: number): void;
    }

    export function addCallback(name: "ItemHold", func: ItemHoldFunction): void;
};

class Aboba implements IItemHoldCallback {
    @SubscribeEvent(ECallback.ITEM_HOLD)
    public onItemHold(item: ItemInstance, playerUid: number, slotIndex: number) {
        Game.message("aboba: " + IDRegistry.getNameByID(item.id));
    };
};