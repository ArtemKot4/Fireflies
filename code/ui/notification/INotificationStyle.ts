type INotificationStyle = INotificationParams | INotificationParams & {
    [key: string]: NotificationElement
};