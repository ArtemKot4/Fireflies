interface INotificationParams extends INotificationTimerParams {
    /**
     * scale of all elements
     */
    scale: number,
    /**
     * width of window. Influences on background width
     */
    width: number,
    /**
     * height of window. Influences on background height
     */
    height: number,
    x?: number,
    y?: number
    color?: number;
};