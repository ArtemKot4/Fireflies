package com.artemkot4.fireflies;

import java.util.HashMap;
import com.artemkot4.fireflies.events.Events;
import com.artemkot4.fireflies.loader.Mod;
import com.artemkot4.fireflies.loader.ModLoader;
import com.artemkot4.fireflies.ui.elements.UITextElement;
import com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod;
import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.api.mod.ui.elements.ElementFactory;

@Mod(Fireflies.ID)
public class Fireflies {
    public static final String ID = "fireflies"; 
    public LegacyInnerCoreMod mod;

    public void setTags(String group, String fileName)  {
        // try {
        //     TagGroup tagGroup = TagRegistry.getOrCreateGroup(group);
        //     JSONObject tagJSON = FileTools.readJSON(mod.getDirectory().getAbsolutePath() + "assets/static/block_tags.json");
        //     Iterator<String> keys = tagJSON.keys();
            
        //     while(keys.hasNext()) {
        //         String key = keys.next();
        //         tagGroup.addTagsFor(key, key.);
        //     }
        // } catch (Exception exception) {
        //     Logger.error("Fireflies", "Error with loading tags: " + exception.toString());
        // }
    }
    public Fireflies(LegacyInnerCoreMod mod) {
        this.mod = mod;
        this.setTags("block", "block_tags.json");   
        Logger.debug("Fireflies", "java part was loaded"); 
    }

    public static void boot(HashMap<?, ?> args) {
        //ModLoader.loadMods();
        Events.init();
        ElementFactory.put("text", UITextElement.class);

    }
}
