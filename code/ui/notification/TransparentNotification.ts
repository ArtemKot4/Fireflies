class TransparentNotification extends Notification {
    public mark: boolean = false;

    public getType(): string {
        return "transparent";    
    };

    protected onInit(style: INotificationStyle, description: INotificationWindowData): void {
        this.mark = false;
        this.UI.layout.setAlpha(0);
    };

    public setAlpha(value: number) {
        this.UI.layout.setAlpha(value);
    };

    protected run(style: INotificationStyle, data: INotificationWindowData): void {
        const alpha = this.UI.layout.getAlpha();
        if(alpha < 1 && !this.mark) {
            this.setAlpha(alpha + 0.01);
        } else {
            this.mark = true;
            java.lang.Thread.sleep(data.wait_time);
        };
        if(this.mark) {
            this.setAlpha(alpha - 0.01);
            if(alpha <= 0) {
                this.close();
                this.setLock(false);
                this.setStop(true);
                this.initLast();
            };
        };
    };      
};

new TransparentNotification();