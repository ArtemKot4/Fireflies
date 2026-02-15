package com.artemkot4.fireflies.ui;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.support.annotation.Nullable;

import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.api.mod.ScriptableObjectHelper;
import com.zhekasmirnov.innercore.api.mod.ui.types.UIStyle;
import com.zhekasmirnov.innercore.utils.FileTools;

import java.io.File;
import java.util.HashMap;

import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;

public class Font {
    public static HashMap<String, Typeface> TYPEFACES = new HashMap();

    public static final int ALIGN_CENTER = 1;
    public static final int ALIGN_CENTER_HORIZONTAL = 3;
    public static final int ALIGN_DEFAULT = 0;
    public static final int ALIGN_END = 2;
    public int alignment;
    public int color;
    public boolean isBold;
    public boolean isCursive;
    public boolean isUnderlined;
    public float shadow;
    private Paint shadowPaint;
    public float size;
    private Paint textPaint;

    public Font(int color, float size, float shadow, Object typeface) {
        Typeface typefaceInstance = getTypefaceFromObject(typeface);

        this.alignment = 0;
        this.color = color;
        this.size = size;
        this.shadow = shadow;
        this.textPaint = new Paint(1);
        this.textPaint.setTypeface(typefaceInstance);
        this.shadowPaint = new Paint(1);
        this.shadowPaint.setTypeface(typefaceInstance);
    }

    public Typeface getTypefaceFromObject(Object value) {
        if(value instanceof Wrapper) {
            value = ((Wrapper)value).unwrap();
        }
        if(value instanceof Typeface) {
            return (Typeface) value;
        }
        String name = null;
        if(value instanceof String) {
            name = (String) value;
        }
        return getTypefaceSafe(name);
    }

    public Font(ScriptableObject description, UIStyle style) {
        Typeface typefaceInstance = getTypefaceFromObject(ScriptableObjectHelper.getProperty(description, "typeface", null));
        byte var4 = 0;
        this.alignment = 0;
        if(style == null) {
            style = UIStyle.DEFAULT;
        }
    
        this.color = style.getColorProperty(ScriptableObjectHelper.getProperty(description, "color", (Object) null), -16777216);
        this.size = ScriptableObjectHelper.getFloatProperty(description, "size", 20.0F);
        this.shadow = ScriptableObjectHelper.getFloatProperty(description, "shadow", 0.0F);
        this.alignment = ScriptableObjectHelper.getIntProperty(description, "alignment",
            ScriptableObjectHelper.getIntProperty(description, "align", 0)
        );
        if(this.alignment != 1 && this.alignment != 2) {
            this.alignment = 0;
        }

        if(!description.has("color", description) && !description.has("size", description) && !description.has("shadow", description)) {
            this.color = -1;
            this.shadow = 0.45F;
        }

        this.isBold = ScriptableObjectHelper.getBooleanProperty(description, "bold", false);
        this.isCursive = ScriptableObjectHelper.getBooleanProperty(description, "cursive", false);
        this.isUnderlined = ScriptableObjectHelper.getBooleanProperty(description, "underline", false);
        int var3;
        if(this.isBold) {
            var3 = 32;
        } else {
            var3 = 0;
        }

        if(this.isUnderlined) {
            var4 = 8;
        }

        var3 |= var4;
        this.textPaint = new Paint(1);
        this.textPaint.setTypeface(typefaceInstance);
        this.textPaint.setFlags(var3);
        this.shadowPaint = new Paint(1);
        this.shadowPaint.setTypeface(typefaceInstance);
        this.shadowPaint.setFlags(var3);
    }

    private float[] getAlignOffset(String var1) {
        if(this.alignment == 0) {
            return new float[] { 0.0F, 0.0F };
        } else {
            Rect var2 = new Rect();
            this.textPaint.getTextBounds(var1, 0, var1.length(), var2);
            if (this.alignment == 1) {
                return new float[] { (float) ((var2.left + var2.width()) / -2),
                        (float) ((var2.bottom + var2.height()) / 2) };
            } else if (this.alignment == 3) {
                return new float[] { (float) ((var2.left + var2.width()) / -2), 0.0F };
            } else {
                return this.alignment == 2 ? new float[] { (float) (-var2.right), 0.0F } : new float[] { 0.0F, 0.0F };
            }
        }
    }

    public ScriptableObject asScriptable() {
        ScriptableObject var1 = ScriptableObjectHelper.createEmpty();
        var1.put("size", var1, this.size);
        var1.put("color", var1, this.color);
        var1.put("shadow", var1, this.shadow);
        var1.put("alignment", var1, this.alignment);
        var1.put("bold", var1, this.isBold);
        var1.put("cursive", var1, this.isCursive);
        var1.put("underline", var1, this.isUnderlined);
        return var1;
    }

    public void drawText(Canvas var1, float var2, float var3, String var4, float var5) {
        var5 = this.size * var5;
        this.textPaint.setTextSize(var5);
        this.textPaint.setColor(this.color);
        this.shadowPaint.setTextSize(var5);
        this.shadowPaint.setColor(Color.argb((int) (this.shadow * 255.0F), 0, 0, 0));
        float[] var6 = this.getAlignOffset(var4);
        var2 += var6[0];
        var3 += var6[1];
        if(this.shadow > 0.0F) {
            var1.drawText(var4, this.shadow * 0.25F * var5 + var2, this.shadow * 0.25F * var5 + var3, this.shadowPaint);
        }
        var1.drawText(var4, var2, var3, this.textPaint);
    }

    public Rect getBounds(String var1, float var2, float var3, float var4) {
        this.textPaint.setTextSize(this.size * var4);
        Rect var5 = new Rect();
        this.textPaint.getTextBounds(var1, 0, var1.length(), var5);
        var5.left = (int) ((float) var5.left + var2);
        var5.right = (int) ((float) var5.right + this.shadow * var4 * this.size * 0.25F + var2);
        var5.top = (int) ((float) var5.top + var3);
        var5.bottom = (int) ((float) var5.bottom + this.shadow * var4 * this.size * 0.25F + var3);
        return var5;
    }

    public float getTextHeight(String var1, float var2, float var3, float var4) {
        this.textPaint.setTextSize(this.size * var4);
        Rect rect = new Rect();
        StringBuilder var6 = new StringBuilder();
        var6.append(var1);
        var6.append("Max Updates Per Tick 69");
        var1 = var6.toString();
        this.textPaint.getTextBounds(var1, 0, var1.length(), rect);
        return (float) rect.height();
    }

    public float getTextWidth(String var1, float var2) {
        return (float) this.getBounds(var1, 0.0F, 0.0F, var2).width();
    }

    @Nullable
    public static Typeface registerTypeface(String path, String name) {
        if(path == null || name == null) {
            Logger.error("Fireflies", "Cannot register typeface by unknown name or path");
            return null;
        }
        File file = new File(path);

        if(!file.exists()) {
            Logger.error("Fireflies", "Cannot register typeface \"" + name + "\" from path \"" + path + "\"");
            return null;
        }
        return TYPEFACES.put(name, Typeface.createFromFile(file));
    }

    public static void registerTypefaceAll(String path) {
        if(path == null) {
            Logger.error("Cannot register fonts by unknown path");
            return;
        }

        for(File file : new File(path).listFiles()) {
            registerTypeface(file.getAbsolutePath(), file.getName());
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
        Typeface foundTypeface = getTypeface(nameOrPath);
        if(foundTypeface == null) {
            Typeface createdTypeface = registerTypeface(nameOrPath, nameOrPath);
            if(createdTypeface == null) {
                return FileTools.getMcTypeface();
            }
            return createdTypeface;
        }
        return foundTypeface;
    }

    static {
        TYPEFACES.put("minecraft", FileTools.getMcTypeface());
    }
}
