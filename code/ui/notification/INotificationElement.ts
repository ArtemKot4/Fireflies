interface INotificationElementInitEvent {
    onInit?(element: NotificationElement, style: INotificationStyle, runtimeStyle: INotificationRuntimeParams): void;
}

type NotificationElement = (UI.UICustomElement
| UI.UIButtonElement
| UI.UICloseButtonElement
| UI.UIFrameElement
| UI.UIImageElement & { item?: string | number }
| UI.UIScaleElement
| UI.UIScrollElement
| UI.UISlotElement
| UI.UISwitchElement
| UI.UITabElement
| UI.UITextElement & { maxLineLength?: number }
| UI.UIFPSTextElement
| UI.UIInvSlotElement) & INotificationElementInitEvent;
