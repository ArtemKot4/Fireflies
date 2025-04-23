class AchievementNotification extends Notification {
    public maxHeight: number = 100;
    public mark: boolean = false;
    public height: number = 0;
    public defaults: {};

    public override getType(): string {
        return "achievement";    
    }

    protected updateElementsHeight(value: number): void {
        const elements = this.UI.getElements();

        for(const name in this.defaults) {
            elements.get(name).setPosition(this.defaults[name].x, value + this.defaults[name].y);
        }
    }

    protected override onInit(style: INotificationStyle, description: INotificationWindowData): void {
        this.maxHeight = style.height * style.scale;
        this.height = -this.maxHeight;
        this.mark = false;
        this.defaults = {};

        for(const i in description.content.elements) {
            const element = description.content.elements[i];
            this.defaults[i] = {
                x: element.x = this.height - element.x,
                y: element.y
            }
        }
    }

    protected override run(style: INotificationStyle, data: INotificationWindowData): boolean {
        if(!this.mark) {
            if(this.height < 0) {
                this.updateElementsHeight(this.height += 1);
            } else {
                java.lang.Thread.sleep(data.waitTime);
                this.mark = true;
            }
        } else {
            if(this.height > -this.maxHeight) {
                this.updateElementsHeight(this.height -= 1);
            } else {
                this.setLock(false);
                this.setStop(true);
                
                java.lang.Thread.sleep(style.queueTime);
                this.close();
                return true;
            }
        }
    }
}

new AchievementNotification();