type INotificationStyle = INotificationParams | INotificationParams & {
    [element: string]: NotificationElement
};