package com.artemkot4.fireflies.ui.elements;

import android.graphics.Canvas;
import android.graphics.Rect;

import com.artemkot4.fireflies.ui.Font;
import com.zhekasmirnov.innercore.api.mod.ScriptableObjectHelper;
import com.zhekasmirnov.innercore.api.mod.ui.elements.UIElement;
import com.zhekasmirnov.innercore.api.mod.ui.window.UIWindow;
import org.mozilla.javascript.ScriptableObject;

public class UITextElement extends UIElement {
    protected Font font;
    private boolean format;
    private float lastMeasuredScale = -1.0F;
    private int maxCharsPerLine = 0;
    private boolean multiline;
    private String text;
    private Rect textBounds = new Rect();
    private float textHeight = 0.0F;
    private String[] textLines;

    public UITextElement(UIWindow window, ScriptableObject description) {
        super(window, description);
    }

    private void measureTextIfNeeded(float var1) {
        if(var1 != this.lastMeasuredScale) {
            this.lastMeasuredScale = var1;
            this.textBounds = this.font.getBounds(this.text, this.x * var1, this.y * var1, 1.0F);
            this.textHeight = this.font.getTextHeight(this.text, this.x * var1, this.y * var1, var1);
            if(this.multiline) {
                float var2 = 0.0F;
                var1 = 0.0F;
                String[] var5 = this.textLines;
                int var4 = var5.length;

                for(int var3 = 0; var3 < var4; ++var3) {
                    String var6 = var5[var3];
                    Rect var7 = this.font.getBounds(var6, 0.0F, 0.0F, 1.0F);
                    var1 += this.textHeight * 1.1F;
                    var2 = Math.max(var2, (float) var7.width());
                }
                this.setSize(var2, var1);
            } else {
                this.setSize((float) this.textBounds.width(), (float) this.textBounds.height());
            }
        }

    }

    public void onBindingUpdated(String name, Object value) {
        if(name.equals("text")) {
            this.text = (String) value;
            if(this.format) {
                this.text = this.text.replaceAll("\n", " \n");
                String[] var9 = this.text.split(" ");
                this.text = "";
                int var3 = 0;
                int var7 = var9.length;

                for(int var5 = 0; var5 < var7; ++var5) {
                    String var8 = var9[var5];
                    StringBuilder var10 = new StringBuilder();
                    var10.append(this.text);
                    var10.append(var8);
                    var10.append(" ");
                    this.text = var10.toString();
                    int var6 = var8.trim().length();
                    int var4 = var3 + var6 + 1;
                    if(var8.contains("\n")) {
                        var4 = var6;
                    }

                    var3 = var4;
                    if(var4 > this.maxCharsPerLine) {
                        var10 = new StringBuilder();
                        var10.append(this.text);
                        var10.append("\n");
                        this.text = var10.toString();
                        var3 = 0;
                    }
                }
            }

            if(this.multiline) {
                this.textLines = this.text.split("\n");
            }
            this.lastMeasuredScale = -1.0F;
        }
    }

    public void onDraw(Canvas var1, float var2) {
        this.measureTextIfNeeded(var2);
        if(this.multiline) {
            for(int var3 = 0; var3 < this.textLines.length; ++var3) {
                this.font.drawText(var1, this.x * var2,
                    this.y * var2 + this.textHeight + (float) var3 * this.textHeight * 1.1F, this.textLines[var3],
                    var2
                );
            }
        } else {
            this.font.drawText(var1, this.x * var2, this.y * var2 + this.textHeight, this.text, var2);
        }
    }

    public void onSetup(ScriptableObject var1) {
        this.font = new Font(ScriptableObjectHelper.getScriptableObjectProperty(var1, "font", var1), this.style);
        this.multiline = ScriptableObjectHelper.getBooleanProperty(var1, "multiline", false);
        this.format = ScriptableObjectHelper.getBooleanProperty(var1, "format", false);
        this.maxCharsPerLine = ScriptableObjectHelper.getIntProperty(var1, "formatMaxCharsPerLine", 999);
        this.text = ScriptableObjectHelper.getStringProperty(var1, "text", "");
        this.setBinding("text", this.text);
    }
}
