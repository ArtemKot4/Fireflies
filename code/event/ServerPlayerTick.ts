Callback.addCallback("ServerPlayerTick", (playerUid: number) => {
    if(World.getThreadTime() % 8 === 0) {

        const actor = new PlayerActor(playerUid);
        const selectedItem = actor.getInventorySlot(actor.getSelectedSlot());
        const carriedItem = Entity.getCarriedItem(playerUid);

        const handFunction = BasicItem.handFunctions.get(selectedItem.id);

        if(selectedItem.id == carriedItem.id && handFunction !== undefined) {
            return handFunction(selectedItem, playerUid);
        };
    };
});