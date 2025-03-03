type INotificationElement = {
    default_x: number, 
    default_y: number, 
    icon?: {
        image: {
            /**
             * width of the icon when type is bitmap
             */
            width: number,
            /**
             * height of the icon when type is bitmap
             */
            height: number,
            bitmap?: string
        },
        item?: {
            /**
             * size of the icon when type is item
             */
            size: number,
            /**
             * x of the icon when type is item
             */
            default_x: number,
            /**
             * y of the icon when type is item
             */
            default_y: number,
            /**
             * slot bitmap
             */
            bitmap?: string
        }
    }, text?: {
        max_line_length: number,
        text?: string,
        font?: UI.FontDescription
    }
};