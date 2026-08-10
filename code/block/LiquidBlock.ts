class LiquidBlock extends BasicBlock {
    public constructor(stringID: string, public name: string, public stillTexture: string, public flowTexture: string) {
        super(stringID, null);
    }

    public override build(): void {
        const obj: Block.LiquidDescriptor = {
            inCreative: this.inCreative(),
            isRenewable: this.isRenewable(),
            tickDelay: this.getTickDelay(),
            name: this.name,
            still: {
                id: this.stringID + "_still",
                texture: [this.stillTexture, 0]
            },
            flowing: {
                id: this.stringID + "_flow",
                texture: [this.flowTexture, 0]
            }
        };
        if("getUiTextures" in this) {
            obj.uiTextures = this.getUiTextures();
        }
        if("getModelTextures" in this) {
            obj.modelTextures = this.getModelTextures();
        }
        if("getBucket" in this) {
            const bucket = this.getBucket();
            if(Array.isArray(bucket)) {
                const [empty, full] = bucket;
                LiquidRegistry.registerItem(this.stringID + "_still", empty, full);
            } else {
                obj.bucket = bucket;
                bucket.id ??= this.stringID + "_bucket";
            }
        }
        Block.createLiquidBlock(this.stringID, obj);
        BlockEvents.applyData(this);
    }

    public inCreative(): boolean {
        return true; //debug true
    }

    /**
     * Make liquid renewable as a water
     */
    public isRenewable(): boolean {
        return true;
    }

    /**
     * Delay between liquid spreading steps in ticks.
     * @default 10
     */
    public getTickDelay(): number {
        return 10;
    }

    public getUiTextures?(): string;

    public getModelTextures?(): string;

    public getBucket?(): Block.LiquidDescriptor["bucket"] | [empty: LiquidRegistry.Bucket2LiquidMapping, full: LiquidRegistry.Bucket2LiquidMapping]
}