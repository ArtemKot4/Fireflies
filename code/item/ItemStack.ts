class ItemStack {
    public id: number;
    public count: number;
    public data?: number;
    public extra?: ItemExtraData;

    public constructor();
    public constructor(instance: ItemInstance);
    public constructor(id: number, count: number, data?: number, extra?: ItemExtraData);
    public constructor(id?: number | ItemInstance, count?: number, data?: number, extra?: ItemExtraData) {
        if(typeof id === "object") {
            this.id = id.id;
            this.count = id.count;
            this.data = id.data;
            this.extra = id.extra;
        } else {
            this.id = id || 0;
            this.count = count || id ? 64 : 0;
            this.data = data;
            this.extra = extra;
        };
    };

    public decrease(count: number = 1) {
        this.count = Math.max(this.count - count, 0);
    };

    public increase(count: number = 1, stack_count?: number) {
        this.count = Math.min(this.count + count, stack_count || 64);
    };

    public equals(stack: ItemStack): boolean {
        return (
            stack.id === this.id && 
            this.count === stack.count && 
            stack.data === this.data && 
            ((stack.extra && this.extra) && stack.extra.equals(this.extra))
        );
    };

    public getItemInstance(): ItemInstance {
        return {
            id: this.id,
            count: this.count,
            data: this.data,
            extra: this.extra
        };
    }; 

    public isEmpty(): boolean {
        return this.id === 0 && this.count === 0 && this.data === 0 && this.extra === null;
    };

    public clear() {
        this.id = 0;
        this.count = 0;
        delete this.data;
        delete this.extra;
    };

    public getMaxStack(): number {
        return Item.getMaxStack(this.id);
    };

    public getMaxDamage(): number {
        return Item.getMaxDamage(this.id);
    };

    public isNativeItem(): boolean {
        return Item.isNativeItem(this.id);
    };

    public getStringID(): string {
        return IDRegistry.getStringIdForIntegerId(this.id);
    };
    
    public copy() {
        return new ItemStack(this.id, this.count, this.data, this.extra);
    }
};