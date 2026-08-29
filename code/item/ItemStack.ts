class ItemStack implements ItemInstance {
    public static EMPTY: ItemStack = new ItemStack();
    public id: number;
    public count: number
    public data: number;
    public extra?: ItemExtraData;

    public constructor();
    public constructor(instance: ItemInstance);
    public constructor(id: number | ItemInstance);
    public constructor(id: number, count?: number, data?: number, extra?: ItemExtraData);
    public constructor(id?: number | ItemInstance, count?: number, data?: number, extra?: ItemExtraData) {
        if(typeof id == "object") {
            this.id = id.id;
            this.count = id.count || (id ? this.getMaxStack() : 0);
            this.data = id.data || 0;
            this.extra = id.extra || null;
        } else {
            this.id = id || 0;
            this.count = count || (id ? this.getMaxStack() : 0);
            this.data = data || 0;
            this.extra = extra || null;
        }
    }

    public decrease(count: number = 1): void {
        this.count = Math.max(this.count - count, 0);
    }

    public increase(count: number = 1): void {
        this.count = Math.min(this.count + count, this.getMaxStack());
    }

    public equals(stack: ItemInstance): boolean {
        return ItemStack.equals(this, stack);
    }

    public contains(stack: ItemInstance): boolean {
        return ItemStack.equals(this, stack);
    }

    public getItemInstance(): ItemInstance {
        return {
            id: this.id,
            count: this.count,
            data: this.data,
            extra: this.extra
        };
    }

    public isEmpty(): boolean {
        return ItemStack.isEmpty(this);
    }

    public clear(): void {
        this.id = 0;
        this.count = 0;

        delete this.data;
        delete this.extra;
    }

    public getMaxStack(): number {
        return Item.getMaxStack(this.id);
    }

    public getMaxDamage(): number {
        return Item.getMaxDamage(this.id);
    }

    public isNativeItem(): boolean {
        return Item.isNativeItem(this.id);
    }

    public getStringID(): string {
        return IDRegistry.getStringIdForItemId(this.id);
    }

    /**
     * @param level level of string: `0` is `id` format, `1` is `id:data` format, `2` is `id:data:count` format
     * @returns 
     */
    public toString(level: 0 | 1 | 2 = 2): string {
        return ItemStack.toString(this, level);
    }
    
    public copy(): ItemStack {
        return new ItemStack(this.id, this.count, this.data, this.extra);
    }

    public static equals(stack1: ItemInstance, stack2: ItemInstance): boolean {
        return (
            stack1.id == stack2.id && 
            stack1.count == stack2.count && 
            stack1.data == stack2.data //&& 
            //((stack1.extra && stack2.extra) && stack1.extra.equals(stack2.extra))
        );
    }

    public static contains(stack1: ItemInstance, stack2: ItemInstance): boolean {
        return (
            stack1.id == stack2.id && 
            stack1.count >= (stack2.count || 1) && 
            (stack1.data || 0) == (stack2.data || 0) //&& 
            //((stack1.extra && stack2.extra) && stack1.extra.equals(stack2.extra))
        );
    }

    public static isEmpty(stack: ItemInstance): boolean {
        return stack.count <= 0; //stack.id == 0 && stack.count == 0 && stack.data == 0;
    }

    /**
     * @param level level of string: `0` is `id` format, `1` is `id:data` format, `2` is `id:data:count` format
     * @returns 
     */
    public static toString(stack: ItemInstance, level: 0 | 1 | 2 = 2): string {
        let string = `${stack.id}`;
        if(level >= 1) {
            string += `:${stack.data}`;
        }
        if(level >= 2) {
            string += `:${stack.count}`;
        }
        return string;
    }

    public static fromString(string: string): ItemStack {
        const [id, data, count] = string.split(":").map((value) => Number(value));
        return new ItemStack(id, count, data);
    }
}