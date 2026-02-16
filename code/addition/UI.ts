declare namespace com {
    export namespace artemkot4 {
        export namespace fireflies {
            export namespace ui {
                export namespace utils {
                    export class FontManager {
                        private static TYPEFACES: java.util.HashMap<string, android.graphics.Typeface>;
                        public static registerTypeface(typeface: android.graphics.Typeface, name: string): android.graphics.Typeface;
                        public static registerTypefaceFrom(path: string, name: string): Nullable<android.graphics.Typeface>;
                        public static registerTypefacesFrom(path: string): void;
                        public static getTypeface(name: string): Nullable<android.graphics.Typeface>
                        public static getTypefaceSafe(nameOfPath: string): android.graphics.Typeface;
                    }
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

    export const FontManager = com.artemkot4.fireflies.ui.utils.FontManager;

    // export namespace FontManager {
    //     export function registerTypeface(typeface: android.graphics.Typeface, name: string): android.graphics.Typeface {
    //         return com.artemkot4.fireflies.ui.utils.FontManager.registerTypeface(typeface, name);
    //     }

    //     export function registerTypefacesFrom(path: string): void {
    //         com.artemkot4.fireflies.ui.utils.FontManager.registerTypefacesFrom(path);
    //     }

    //     export function registerTypefaceFrom(path: string, name: string) {
    //         com.artemkot4.fireflies.ui.utils.FontManager.registerTypefaceFrom(path, name);
    //     }

    //     export function getTypeface(name: string): Nullable<android.graphics.Typeface> {
    //         return com.artemkot4.fireflies.ui.utils.FontManager.getTypeface(name);
    //     }

    //     export function getTypefaceSafe(name: string): android.graphics.Typeface {
    //         return com.artemkot4.fireflies.ui.utils.FontManager.getTypefaceSafe(name);
    //     }
    // }

    export namespace FONT_TYPESPACES {
        export const MINECRAFT = UI.FontManager.getTypeface("minecraft");
        export const DEFAULT = android.graphics.Typeface.DEFAULT;
        export const DEFAULT_BOLD = android.graphics.Typeface.DEFAULT_BOLD;
        export const MONOSPACE = android.graphics.Typeface.MONOSPACE;
        export const SANS_SERIF = android.graphics.Typeface.SANS_SERIF;
        export const SERIF = android.graphics.Typeface.SERIF;
    }
}

//test
// UI.FontManager.registerTypefacesFrom(__dir__ + "resources/assets/gui/");
// UI.FontManager.registerTypefaceFrom(__dir__ + "resources/assets/gui/goth.ttf", "aboba");

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
//                         typeface: "aboba",
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