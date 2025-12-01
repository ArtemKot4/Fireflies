interface IItemTextureDescription {
    name: string,
    meta: number
}

interface IIconOverrideCallback {
    onIconOverride?(item: ItemInstance, isModUi: boolean): void | Item.TextureData;
}

interface INoTargetUseCallback {
    onNoTargetUse(item: ItemStack, player: number): void;
}

interface IItemUsingReleasedCallback {
    onUsingReleased(item: ItemStack, ticks: number, player: number): void;
}

interface IItemUsingCompleteCallback {
    onUsingComplete(item: ItemStack, player: number): void;
}

interface IItemUseCallback {
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
}

interface INameOverrideCallback {
    onNameOverride(item: ItemInstance, translation: string, name: string): void | string;
}

interface IExplodableItem {
    isExplodable(): boolean;
}

interface IFireRestistantItem {
    isFireResistant(): boolean;
}

interface IShouldDespawnItem {
    isShouldDespawn(): boolean;
}

interface IGlintItem {
    isGlint(): boolean;
}

type ItemParams = Item.ItemParams | Item.FoodParams | Item.ArmorParams;

class BasicItem<T extends Item.ItemParams = Item.ItemParams> {
    public maxStack: number = 64;
    public texture: IItemTextureDescription;
    public id: number;
    public stringID: string;

    public constructor(stringID: string, texture: IItemTextureDescription, params: T = {} as T) {
        this.id = IDRegistry.genItemID(stringID);
        this.stringID = stringID;
        this.maxStack = params.stack || 64;
        this.texture = texture;
        
        if("getFood" in this) {
            (params as Item.FoodParams).food = this.getFood();
        }
        this.create(params || {});
    }

    public getMaxStack(): number {
        return this.maxStack;
    }

    public getName(): string {
        return `item.${this.stringID}`;
    }

    public getStringID(): string {
        return this.stringID;
    }

    public getID(): number {
        return this.id
    }

    public getItemCategory(): EItemCategory {
        return EItemCategory.ITEMS;
    }

    public getTexture(): IItemTextureDescription {
        return this.texture;
    }

    public inCreative(): boolean {
        return true;
    }

    public getTags?(): string[] {
        return null;
    }

    public isThrowable?(): boolean;

    public getFood?(): number;

    public static setFunctions(instance: 
            (
                IIconOverrideCallback | 
                INoTargetUseCallback |
                IItemUsingReleasedCallback | 
                IItemUsingCompleteCallback |
                IItemUseCallback | 
                INameOverrideCallback | 
                IItemHoldCallback | 
                BasicItem
            ) & { id: number }
        ) {
        if("isFireResistant" in instance) {
            Item.setFireResistant(instance.id, true);
        }

        if("isExplodable" in instance) {
            Item.setExplodable(instance.id, true);
        }

        if("isShouldDespawn" in instance) {
            Item.setShouldDespawn(instance.id, true);
        }

        if("isGlint" in instance) {
            Item.setGlint(instance.id, true);
        }

        if('onIconOverride' in instance) {
            Item.registerIconOverrideFunction(instance.id, instance.onIconOverride.bind(this));
        }

        if('onNoTargetUse' in instance) {
            Item.registerNoTargetUseFunction(instance.id, (item, player) => instance.onNoTargetUse(new ItemStack(item), player));
        }

        if('onUsingReleased' in instance) {
            Item.registerUsingReleasedFunction(instance.id, (item, ticks, player) => instance.onUsingReleased(new ItemStack(item), ticks, player));
        }

        if('onUsingComplete' in instance) {
            Item.registerUsingCompleteFunction(instance.id, (item, player) => instance.onUsingComplete(new ItemStack(item), player));
        }

        if('onItemUse' in instance) {
            Item.registerUseFunction(instance.id, (coords, item, block, player) => instance.onItemUse(coords, new ItemStack(item), block, player));
        }

        if('onNameOverride' in instance) {
            Item.registerNameOverrideFunction(instance.id, instance.onNameOverride.bind(this));
        }

        if('onItemHold' in instance) {
            Item.registerHoldFunctionForID(instance.id, (item, playerUid, slotIndex) => (instance as IItemHoldCallback).onItemHold(item, playerUid, slotIndex));
        }

        if("getItemCategory" in instance) {
            Item.setCategory(instance.id, instance.getItemCategory())
        }
    }

    public create(params: ItemParams = {}): void {
        const tags = this.getTags();
        const itemParams = Object.assign({ 
            stack: this.getMaxStack(), 
            isTech: !this.inCreative(), 
            category: this.getItemCategory()
        }, params);
        let key = "createItem";

        if(tags != null) {
            TagRegistry.addCommonObject("items", this.id, tags);
        }
        if("food" in params) {
            key = "createFoodItem";
        }
        if("type" in params) {
            key = "createArmorItem";
        }
        if("isThrowable" in this && this.isThrowable() == true) {
            key = "createThrowableItem";
        }
        Item[key](this.stringID, this.getName(), this.getTexture(), itemParams);
        BasicItem.setFunctions(this);
    }
}

const a = 1 //hello 