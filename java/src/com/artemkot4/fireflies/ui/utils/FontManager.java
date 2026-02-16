package com.artemkot4.fireflies.ui.utils;

import java.io.File;
import java.util.HashMap;

import org.apache.commons.io.FilenameUtils;
import org.mozilla.javascript.Wrapper;

import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.utils.FileTools;

import android.graphics.Typeface;
import android.support.annotation.NonNull;
import androidx.annotation.Nullable;

public class FontManager {
    private static HashMap<String, Typeface> TYPEFACES = new HashMap();

    public static Typeface registerTypeface(@NonNull Typeface typeface, @NonNull String name) {
        return TYPEFACES.put(name, typeface);
    }

    @Nullable
    public static Typeface registerTypefaceFrom(@NonNull String path, @NonNull String name) {
        File file = new File(path);

        if(!file.exists()) {
            Logger.error("Fireflies", "Cannot register typeface \"" + name + "\" for fonts from path \"" + path + "\". File does not exists");
            return null;
        }
        String fileExtension = FilenameUtils.getExtension(file.getName());

        if(!fileExtension.equals("ttf")) {
            Logger.error("Fireflies", "Cannot register typeface \"" + name + "\" for fonts by wrong file extension \"" + fileExtension + "\"");
            return null;
        } 
        if(TYPEFACES.containsKey(name)) {
            Logger.debug("Fireflies", "Found replace of \"" + name + "\" typeface for fonts with path \"" + path + "\"");
        }

        Logger.message("Fireflies", "Registered typeface for fonts by name \"" + name + "\"");
        return registerTypeface(Typeface.createFromFile(file), name);
    }

    @Nullable 
    public static Typeface registerTypefaceFrom(@NonNull String path) {
        return registerTypefaceFrom(path, FilenameUtils.removeExtension(FilenameUtils.getName(path)));
    }

    public static void registerTypefacesFrom(@NonNull String path) {
        for(final File file : new File(path).listFiles()) {
            registerTypefaceFrom(file.getPath());
        }
    }

    @Nullable
    public static Typeface getTypeface(String name) {
        if(TYPEFACES.containsKey(name)) {
            return TYPEFACES.get(name);
        } 
        return null;
    }

    public static Typeface getTypefaceSafe(String nameOrPath) {
        if(nameOrPath == null) {
            return FileTools.getMcTypeface();
        }
        Typeface foundTypeface = getTypeface(nameOrPath);
        if(foundTypeface == null && nameOrPath.contains("/")) {
            Typeface createdTypeface = registerTypefaceFrom(nameOrPath);
            if(createdTypeface == null) {
                return FileTools.getMcTypeface();
            }
            return createdTypeface;
        }
        return foundTypeface;
    }

    public static Typeface getTypefaceUnknown(Object value) {
        if(value instanceof Wrapper) {
            value = ((Wrapper)value).unwrap();

            if(value instanceof Typeface) {
                return (Typeface) value;
            }
        }
        String name = null;
        if(value instanceof String) {
            name = (String) value;
        }
        return FontManager.getTypefaceSafe(name);
    }

    static {
        TYPEFACES.put("minecraft", FileTools.getMcTypeface());
    }
}
