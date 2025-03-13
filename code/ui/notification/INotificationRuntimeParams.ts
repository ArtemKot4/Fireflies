type INotificationRuntimeParams = INotificationTimerParams & { color?: number } & {
    [element: string]: {
        icon?: {
            image: string,
            image_type: "image" | "item",
            size?: number,
            width?: number,
            height?: number,
        },  text?: {
            max_line_length?: number,
            text?: string,
            font?: UI.FontDescription
        }
    };
};