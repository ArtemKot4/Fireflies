declare namespace com {
    export namespace artemkot4 {
        export namespace fireflies {
            export namespace ui {
                export class Font {
                    public static TYPEFACES: java.util.HashMap<string, android.graphics.Typeface>;
                    public static registerTypeface(path: string, name: string): Nullable<android.graphics.Typeface>;
                    public static getTypeface(name: string): Nullable<android.graphics.Typeface>
                    public static getTypefaceSafe(nameOfPath: string): android.graphics.Typeface;
                }
            }
        }
    }
}

namespace UI {
    export interface FontDescription {
        /** Path or name for font typeface. If not defined, will be default minecraft typeface
         */
        typeface?: string;
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
            for(const file of FileTools.GetListOfFiles(path)) {
                registerTypeface(file.getAbsolutePath(), file.getName())
            }
        }
    }
}

//test
// UI.FontManager.registerTypeface(__dir__ + "resources/assets/gui/goth.ttf", "goth");

// Callback.addCallback("ItemUse", (c,i) => {
//     if(i.id == VanillaItemID.stick) {
//         new UI.Window({
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
//                         typeface: "goth",
//                         color: android.graphics.Color.BLACK,
//                     }
//                 }
//             }
//         }).open();
//     }
// })