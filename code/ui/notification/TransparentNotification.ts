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

    protected run(style: INotificationStyle, data: INotificationWindowData): boolean {
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
                this.setLock(false);
                this.setStop(true);

                java.lang.Thread.sleep(style.queueTime);
                this.close();
                return true;
            };
        };
    };      
};

new TransparentNotification();