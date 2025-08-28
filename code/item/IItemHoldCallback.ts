interface IItemHoldCallback {
    onItemHold?(item: ItemInstance, playerUid: number, slotIndex: number): void;
}