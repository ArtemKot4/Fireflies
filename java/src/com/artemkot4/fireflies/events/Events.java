package com.artemkot4.fireflies.events;

import org.innercore.icstd.event.EventController;
import org.innercore.icstd.event.IScriptEventListener;
import org.innercore.icstd.inventory.ItemInstance;

import com.zhekasmirnov.apparatus.adapter.innercore.game.block.BlockState;
import com.zhekasmirnov.apparatus.api.common.Vector3;
import com.zhekasmirnov.apparatus.mcpe.NativeBlockSource;
import com.zhekasmirnov.innercore.api.NativeAPI;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI.Entity;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI.PlayerActor;
import com.zhekasmirnov.innercore.api.runtime.Callback;

public class Events {
    public static void init() {
        org.innercore.icstd.event.Events.onScriptEvent("LocalTick", new IScriptEventListener() {
            @Override
            public boolean isEventCtrlRequired() {
                return false;
            }

            @Override
            public void onEvent(EventController ctrl, Object[] args) {
                int[] pos = new int[4];
                float[] vec = new float[3];
                long entity = NativeAPI.getPointedData(pos, vec);
                NativeBlockSource blockSource = NativeBlockSource.getCurrentClientRegion();
                BlockState block = blockSource.getBlock(pos[0], pos[1], pos[2]);

                Vector3 blockPos = new Vector3(pos[0], pos[1], pos[2]);
                Vector3 viewVec = new Vector3(vec[0], vec[1], vec[2]);
                Callback.invokeCallback("Selection", viewVec, blockPos, entity, block);
            }
        });

        org.innercore.icstd.event.Events.onScriptEvent("ServerPlayerTick", new IScriptEventListener() {
            @Override
            public boolean isEventCtrlRequired() {
                return false;
            }

            @Override
            public void onEvent(EventController ctrl, Object[] args) {
                long playerUid = (long) args[0];
                PlayerActor actor = new PlayerActor(playerUid);
                int slot = actor.getSelectedSlot();
                ItemInstance selectedItem = actor.getInventorySlot(slot);
                ItemInstance carriedItem = Entity.getCarriedItem(playerUid);

                if(!selectedItem.isEmpty() && selectedItem.id == carriedItem.id) {
                    Callback.invokeCallback("ItemHold", selectedItem, playerUid, slot);
                }
            }
        });
    }
}
