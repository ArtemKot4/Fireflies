class AchievementNotification extends Notification {
    public maxHeight: number = 100;
    public mark: boolean = false;
    public height: number = 0;

    public override getType(): string {
        return "achievement";    
    };

    protected updateElementHeights(description: {}, value: number): void {
        const elements = this.UI.getElements();

        for(const name in description) {
            elements.get(name).setPosition(description[name].default_x, value + description[name].default_y);
        };

        return;
    };

    protected override onInit(style: INotificationStyle, description: INotificationWindowData): void {
        this.maxHeight = style.height * style.scale;
        this.height = -this.maxHeight;
        this.mark = false;
    };

    protected override run(style: INotificationStyle, data: INotificationWindowData): void {
        if(!this.mark) {
            if(this.height < 0) {
                this.updateElementHeights(data.coords, this.height += 1);
            } else {
                java.lang.Thread.sleep(data.wait_time);
                this.mark = true;
            };
        } else {
            if(this.height > -this.maxHeight) {
                this.updateElementHeights(data.coords, this.height -= 1);
            } else {
                this.setLock(false);

                if(this.queue.length > 0 && LocalData.screenName === EScreenName.IN_GAME_PLAY_SCREEN) {
                    java.lang.Thread.sleep(style.queue_time);
                    this.initLast();
                    
                    this.setStop(true);
                    return;
                };

                this.close();
                this.setStop(true);
            };
        };
    };
};



new AchievementNotification();