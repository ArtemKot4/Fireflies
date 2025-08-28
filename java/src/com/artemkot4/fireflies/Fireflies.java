package com.artemkot4.fireflies;

import java.util.HashMap;
import com.artemkot4.fireflies.events.Event;
import com.artemkot4.fireflies.loader.Mod;
import com.artemkot4.fireflies.loader.ModLoader;
import com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod;
import com.zhekasmirnov.innercore.api.log.DialogHelper;

@Mod(Fireflies.ID)
public class Fireflies {
    public static final String ID = "fireflies"; 

    public Fireflies(LegacyInnerCoreMod mod) {
        DialogHelper.openFormattedDialog("debug", "it is work! " + mod.getLegacyModInstance().getName());
    }

    public static void boot(HashMap<?, ?> args) {
        ModLoader.loadMods();
        Event.init();
    }
}
