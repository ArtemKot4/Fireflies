package com.artemkot4.fireflies.events.interfaces;

import com.zhekasmirnov.apparatus.adapter.innercore.game.item.ItemStack;

public interface IItemHoldEvent {
    public void call(ItemStack item, int playerUid, int slotIndex);
}
