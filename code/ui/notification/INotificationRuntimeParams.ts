type INotificationRuntimeParams = INotificationTimerParams & { color?: number } & {
    [element: string]: NotificationElement
};