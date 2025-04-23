class TransparentNotification extends Notification {
    public mark: boolean = false;

    protected onInit(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void {
        this.mark = false;
        this.UI.layout.setAlpha(0);
    };

    public setAlpha(value: number): void {
        this.UI.layout.setAlpha(value);
    };

    protected run(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, data: INotificationWindowData): boolean {
        const alpha = this.UI.layout.getAlpha();
        if(alpha < 1 && !this.mark) {
            this.setAlpha(alpha + 0.01);
        } else {
            if(!this.mark) {
                this.mark = true;
                java.lang.Thread.sleep(data.waitTime);
            };
        };
        if(this.mark) {
            this.setAlpha(alpha - 0.01);
            if(alpha <= 0) {
                java.lang.Thread.sleep(style.queueTime);
                this.close();

                return true;
            };
        };
    };      
};

Notification.register("transparent", new TransparentNotification())
.addStyle("transparent", ENotificationStyle.TRANSPARENT);

