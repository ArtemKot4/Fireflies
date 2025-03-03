interface INotificationWindowData extends INotificationTimerParams {
    content: UI.WindowContent,
    coords: Record<string, {default_x: number, default_y: number}>
};