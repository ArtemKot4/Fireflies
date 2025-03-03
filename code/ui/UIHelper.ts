namespace UIHelper {
    export function separateText(text: string, line_size: number = 25): string {
        let result: string[] = [];
        let line = "";
    
        for (let word of text.split(" ")) {
            if (line.length + word.length <= line_size) {
                line += word + " ";
            } else {
                result.push(line.trim());
                line = word + " ";
            }
        }
    
        if (line) {
            result.push(line.trim());
        }
    
        return result.join("\n");
    };

    export function getItemIcon(itemID: string | number, x: number, y: number, size: number = 70, bitmap: string = "unknown"): UI.UISlotElement {
        return {
            type: "slot",
            visual: true,
            source: new ItemStack(typeof Number(itemID) === "number" ? Number(itemID) : Utils.parseID(itemID as string), 1),
            x,
            y,
            size,
            bitmap
        }
    }
}; 