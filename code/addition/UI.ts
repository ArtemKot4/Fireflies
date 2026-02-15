declare namespace com {
    export namespace artemkot4 {
        export namespace fireflies {
            export namespace ui {
                export class Font {
                    public static TYPEFACES: java.util.HashMap<string, android.graphics.Typeface>;
                    public static registerTypeface(path: string, name: string): Nullable<android.graphics.Typeface>;
                    public static registerTypefaceAll(path: string): void;
                    public static getTypeface(name: string): Nullable<android.graphics.Typeface>
                    public static getTypefaceSafe(nameOfPath: string): android.graphics.Typeface;
                }
            }
        }
    }
}

namespace UI {
    export interface FontDescription {
        /** typeface, or path or name for font typeface. If not defined, will be default minecraft typeface
         */
        typeface?: string | android.graphics.Typeface;
    }

    export namespace FontManager {
        export function registerTypeface(path: string, name: string): Nullable<android.graphics.Typeface> {
            return com.artemkot4.fireflies.ui.Font.registerTypeface(path, name);
        }
    
        /**
         * Returns typeface for font
         * @param name name of typeface
         */
        export function getTypeface(name: string): Nullable<android.graphics.Typeface>;

        /**
         * Returns minecraft default typeface for font
         */
        export function getTypeface(name: "minecraft"): android.graphics.Typeface;

        export function getTypeface(name: string): Nullable<android.graphics.Typeface> {
            return com.artemkot4.fireflies.ui.Font.getTypeface(name);
        }

        /** 
         * @returns default minecraft font typeface
         */
    
        export function getTypefaceSafe(nameOrPath: string): android.graphics.Typeface {
            return com.artemkot4.fireflies.ui.Font.getTypefaceSafe(nameOrPath);
        }

        export function registerTypefaceAll(path: string): void {
            return com.artemkot4.fireflies.ui.Font.registerTypefaceAll(path);
        }

        export namespace TYPESPACES {
            export const MINECRAFT = UI.FontManager.getTypeface("minecraft");
            export const DEFAULT = android.graphics.Typeface.DEFAULT;
            export const DEFAULT_BOLD = android.graphics.Typeface.DEFAULT_BOLD;
            export const MONOSPACE = android.graphics.Typeface.MONOSPACE;
            export const SANS_SERIF = android.graphics.Typeface.SANS_SERIF;
            export const SERIF = android.graphics.Typeface.SERIF;
        }
    }
}

//test
// UI.FontManager.registerTypeface(__dir__ + "resources/assets/gui/goth.ttf", "goth");

// Callback.addCallback("ItemUse", (c,i) => {
//     if(i.id == VanillaItemID.stick) {
//         const ui = new UI.Window({
//             "drawing": [
//                 {
//                     type: "background",
//                     color: android.graphics.Color.TRANSPARENT
//                 }
//             ],
//             "elements": {
//                 "aboba": {
//                     x: 35,
//                     y: 50,
//                     type: "text",
//                     text: "Проверка прекрасного текста",
//                     font: {
//                         size: 50,
//                         typeface: UI.FontManager.getTypeface("goth"),
//                         color: android.graphics.Color.BLACK,
//                     }
//                 },
//                 "aboba2": {
//                     x: 35,
//                     y: 90,
//                     type: "text",
//                     text: "Сегодня хороший день",
//                     font: {
//                         size: 50,
//                         typeface: "goth",
//                         color: android.graphics.Color.BLACK,
//                     }
//                 },
//                 "aboba3": {
//                     x: 35,
//                     y: 130,
//                     type: "text",
//                     text: "Это должен быть обычный шрифт",
//                     font: {
//                         size: 30,
//                         color: android.graphics.Color.BLACK,
//                     }
//                 }
//             }
//         });
//         ui.setTouchable(false);
//         ui.open();
//     }
// })