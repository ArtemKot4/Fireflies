package com.artemkot4.fireflies.loader;

import com.artemkot4.fireflies.ui.utils.FontManager;
import com.zhekasmirnov.apparatus.modloader.ApparatusMod;
import com.zhekasmirnov.apparatus.modloader.ApparatusModLoader;
import com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod;
import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.api.mod.ScriptableObjectHelper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.mozilla.javascript.ScriptableObject;

public class ModLoader {
    private static Boolean loaded = false;

    public static double version = 0.1;
    public static Map<String, Class<?>> mods = new HashMap<>();

    public static ArrayList<String> getLoadedModIDs() {
        ArrayList<String> list = new ArrayList();
        for(String id : mods.keySet()) {
            list.add(id);
        }
        return list;
    }

    public static Boolean isLoaded() {
        return loaded;
    }

    public static void registerFontsIfNeeded(com.zhekasmirnov.innercore.mod.build.Mod legacyModInstance) {
        // Iterator resourceIterator = legacyModInstance.buildConfig.resourceDirs.iterator();
        // while(resourceIterator.hasNext()) {
        //     ScriptableObject resource = (ScriptableObject) resourceIterator.next();
        //     String type = ScriptableObjectHelper.getStringProperty(resource, "type", null);
        //     if(type == "font") {
        //         String path = ScriptableObjectHelper.getStringProperty(resource, "path", null);
        //         if(path == null) {
        //             throw new RuntimeException("Path for fonts don't presented at mod: \"" + legacyModInstance.getName() + "\"");
        //         }
        //         FontManager.registerTypefaceAll(legacyModInstance.dir + path);
        //     }
        // }
    }

    public static final void loadMods() {
        if(loaded == true) {
            Logger.debug("Fireflies ModLoader", "Mods from Fireflies Mod loader of version: " + version + " already loaded");
            return;
        }
        ClassLoader classLoader = ModLoader.class.getClassLoader();

        for(final ApparatusMod mod : ApparatusModLoader.getSingleton().getAllMods()) {
            LegacyInnerCoreMod legacyMod = (LegacyInnerCoreMod) mod;
            com.zhekasmirnov.innercore.mod.build.Mod legacyModInstance = legacyMod.getLegacyModInstance();
            if(legacyModInstance.getConfig().getBool("enabled") == false) {
                continue;
            }
            registerFontsIfNeeded(legacyModInstance);
            final String className = (String) legacyMod.getLegacyModInstance().getInfoProperty("javaBoot");
            if(className != null) {
                try {
                    Class loadedClass = classLoader.loadClass(className);
                    Object instance = loadedClass.getConstructor(LegacyInnerCoreMod.class).newInstance(legacyMod);
                    Class modClass = instance.getClass();
    
                    if(modClass.isAnnotationPresent(Mod.class)) {
                        Mod modAnnotation = (Mod) modClass.getAnnotation(Mod.class);
                        String modID = modAnnotation.value();
                        if(mods.containsKey(modID)) {
                            throw new RuntimeException("Fireflies: Mod by id: " + modID + " already registered");
                        }
                        mods.put(modID, modClass);
                        Logger.debug("Mod by id: " + modID + " was loaded");
                    } else {
                        throw new RuntimeException("Mod by id: " + legacyModInstance.getName() + " is not defined. Please define id by @Mod(String id) annotation");
                    }
                } catch (ClassNotFoundException exception) {
                    Logger.error("Fireflies ModLoader", "Class not found: " + className);
                } catch (RuntimeException exception) {
                    Logger.error("Fireflies ModLoader", exception.toString());
                } catch (Exception e) { // Catch other exceptions
                    Logger.error("Fireflies ModLoader", "Error loading mod by boot class: " + className);
                }
            }
        }
        loaded = true;
    }
}
