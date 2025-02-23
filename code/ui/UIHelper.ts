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
}; 