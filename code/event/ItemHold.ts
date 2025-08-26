/*Callback.addCallback("ServerPlayerTick", (playerUid) => {
    const actor = new PlayerActor(playerUid);
    const slot = actor.getSelectedSlot();
    const selectedItem = actor.getInventorySlot(slot);
    const carriedItem = Entity.getCarriedItem(playerUid);

    if(selectedItem.id !== 0 && selectedItem.id == carriedItem.id) {
        return Callback.invokeCallback<Callback.ItemHoldFunction>("ItemHold", selectedItem, playerUid, slot);
    };
});*/

// Callback.addCallback("ItemHold", (item, playerUid, slotIndex) => {
//     if(item.id == VanillaItemID.bone) {
//         alert("aboba from java callback!");
//     }
// });