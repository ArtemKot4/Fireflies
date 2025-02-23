Callback.addCallback("ServerPlayerTick", (playerUid: number) => {
    if(World.getThreadTime() % 8 === 0) {

        const actor = new PlayerActor(playerUid);
        const selectedItemInstance = actor.getInventorySlot(actor.getSelectedSlot());
        const carriedItemInstance = Entity.getCarriedItem(playerUid);

        const handFunction = BasicItem.handFunctions.get(selectedItemInstance.id);

        if(selectedItemInstance.id == carriedItemInstance.id && handFunction !== undefined) {
            return handFunction(selectedItemInstance, playerUid);
        };
    };
});