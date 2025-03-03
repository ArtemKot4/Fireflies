type INotificationStyle = INotificationParams | INotificationParams & {
    [key: string]: INotificationElement
};