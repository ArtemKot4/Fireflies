package com.artemkot4.fireflies.events;

import com.zhekasmirnov.apparatus.adapter.innercore.game.item.ItemStack;

public interface IItemHoldEvent {
    public void call(ItemStack item, int playerUid, int slotIndex);
}
