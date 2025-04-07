Callback.addCallback("ServerPlayerTick", (playerUid) => {
    if(World.getThreadTime() % 8 === 0) {
        const actor = new PlayerActor(playerUid);
        const selectedItem = actor.getInventorySlot(actor.getSelectedSlot());
        const carriedItem = Entity.getCarriedItem(playerUid);

        if(selectedItem.id == carriedItem.id) {
            Callback.invokeCallback("ItemHold", selectedItem);
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
     * Function used in "ItemHold" callback.
     * @param item ItemInstance of held item
     * @param playerUid uid of holder player
     */

    export interface ItemHoldFunction {
        (item: ItemInstance, playerUid: number): void;
    }

    export function addCallback(name: "ItemHold", func: ItemHoldFunction): void;
};
