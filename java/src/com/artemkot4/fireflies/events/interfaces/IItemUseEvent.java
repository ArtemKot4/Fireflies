package com.artemkot4.fireflies.events.interfaces;

import com.artemkot4.fireflies.block.BlockData;
import com.zhekasmirnov.apparatus.adapter.innercore.game.item.ItemStack;

public interface IItemUseEvent {
    public void onItemUse(BlockData block, ItemStack item, int playerUid);
}
