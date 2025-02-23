interface ItemHandComponent {
    onHand?(item: ItemInstance, player_uid: number): void;
};