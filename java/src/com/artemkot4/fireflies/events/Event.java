package com.artemkot4.fireflies.events;

import com.zhekasmirnov.apparatus.adapter.innercore.game.block.BlockState;
import com.zhekasmirnov.apparatus.adapter.innercore.game.item.ItemStack;
import com.zhekasmirnov.apparatus.mcpe.NativeBlockSource;
import com.zhekasmirnov.innercore.api.NativeAPI;
import com.zhekasmirnov.innercore.api.commontypes.ScriptableParams;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI;
import com.zhekasmirnov.innercore.api.mod.util.ScriptableFunctionImpl;
import com.zhekasmirnov.innercore.api.runtime.Callback;

import android.util.Pair;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

public class Event {
    public static void init() {};

    public static void add(String name, IEvent callback, int priority) {
        Callback.addCallback(name, new ScriptableFunctionImpl() {
            @Override
            public Object call(Context context, Scriptable scriptable, Scriptable scriptable1, Object[] objects) {
                callback.call(objects);
                return null;
            }
        }, priority);
    }

    static {
        add("ServerPlayerTick", (args) -> {
            long playerUid = (long) args[0];
            AdaptedScriptAPI.PlayerActor actor = new AdaptedScriptAPI.PlayerActor(playerUid);
            int slot = actor.getSelectedSlot();
            ItemStack selectedItem = actor.getInventorySlot(slot);

            if(!selectedItem.isEmpty() && selectedItem.id == AdaptedScriptAPI.Entity.getCarriedItem(playerUid).getId()) {
                Callback.invokeCallback("ItemHold", selectedItem, playerUid, slot);
            }
        }, 0);

        add("LocalTick", (args) -> {
            int[] pos = new int[4];
            float[] vec = new float[3];
            long entity = NativeAPI.getPointedData(pos, vec);
            NativeBlockSource blockSource = NativeBlockSource.getCurrentClientRegion();
            BlockState block = blockSource.getBlock(pos[0], pos[1], pos[2]);

            ScriptableParams viewVec = new ScriptableParams(
                new Pair("vec", 
                    new ScriptableParams(
                        new Pair("x", vec[0]), 
                        new Pair("y", vec[1]), 
                        new Pair("z", vec[2])
                    )
                )
            );
            ScriptableParams tile = new ScriptableParams(
                new Pair("id", block.id),
                new Pair("data", block.data)
            );
            ScriptableParams blockPos = new ScriptableParams(
                new Pair("x", pos[0]), 
                new Pair("y", pos[1]), 
                new Pair("z", pos[2])
            );
            Callback.invokeCallback("BlockSelection", tile, blockPos, viewVec);
            Callback.invokeCallback("EntitySelection", entity, viewVec);
        }, 0);
    }
}
