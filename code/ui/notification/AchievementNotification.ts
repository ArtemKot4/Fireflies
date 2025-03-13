class AchievementNotification extends Notification {
    public maxHeight: number = 100;
    public mark: boolean = false;
    public height: number = 0;

    public override getType(): string {
        return "achievement";    
    };

    protected updateElementsHeight(description: {}, value: number): void {
        const elements = this.UI.getElements();

        for(const name in description) {
            elements.get(name).setPosition(description[name].default_x, value + description[name].default_y);
        };
    };

    protected override onInit(style: INotificationStyle, description: INotificationWindowData): void {
        this.maxHeight = style.height * style.scale;
        this.height = -this.maxHeight;
        this.mark = false;

        for(const i in description.content.elements) {
            const element = description.content.elements[i];
            element.x = this.height - element.x;
        };
    };

    protected override run(style: INotificationStyle, data: INotificationWindowData): void {
        if(!this.mark) {
            if(this.height < 0) {
                this.updateElementsHeight(data.coords, this.height += 1);
            } else {
                java.lang.Thread.sleep(data.wait_time);
                this.mark = true;
            };
        } else {
            if(this.height > -this.maxHeight) {
                this.updateElementsHeight(data.coords, this.height -= 1);
            } else {
                this.setLock(false);
                this.setStop(true);
                
                if(this.initLast()) {
                    java.lang.Thread.sleep(style.queue_time);
                    return;
                };

                this.close();
            };
        };
    };
};

new AchievementNotification();