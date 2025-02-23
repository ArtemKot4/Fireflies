type itemTextureAnimated = [texture: string, frames: number | number[], interval: number];

interface IItemTextureDescription {
  name: string |  itemTextureAnimated,
  meta: number
};

interface IconOverrideCallback {
    onIconOverride?(item: ItemInstance, isModUi: boolean): void | Item.TextureData
};

interface NoTargetUseCallback {
    onNoTargetUse(item: ItemInstance, player: number): void;
};

interface ItemUsingReleasedCallback {
    onUsingReleased(item: ItemInstance, ticks: number, player: number): void;
};

interface onUsingCompleteCallback {
    onUsingComplete(item: ItemInstance, player: number): void;
};

interface ItemUseCallback {
    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void
};

interface NameOverrideCallback {
    onNameOverride(item: ItemInstance, translation: string, name: string): void | string;
};

interface IExplodableItem {
    isExplodable(): boolean;
};

interface IFireRestistantItem {
    isFireResistant(): boolean;
};

interface IShouldDespawnItem {
    isShouldDespawn(): boolean;
};

interface IGlintItem {
    isGlint(): boolean;
};

type ItemParams = Item.ItemParams | Item.FoodParams | Item.ArmorParams;

class BasicItem {
    public static handFunctions: Map<number, (item: ItemInstance, playerUid: number) => void> = new Map();

    public maxStack: number = 64;
    public texture: IItemTextureDescription;

    public id: number;
    public stringID: string;

    public constructor(stringID: string, texture: IItemTextureDescription, params: ItemParams);
    public constructor(stringID: string, texture: IItemTextureDescription, stack: number | ItemParams = 64, params?: ItemParams) {
        this.id = IDRegistry.genItemID(stringID);
 
        const isStack = typeof stack === "number";

        this.stringID = stringID;
        this.maxStack = isStack ? stack : 64;
        this.texture = texture;

        this.create(!isStack ? stack : params || {});
    };

    public getMaxStack(): number {
        return this.maxStack;
    };

    public getName(): string {
        return `item.${this.id}`;
    };

    public getStringID(): string {
        return this.stringID;
    };

    public getID(): number {
        return this.id
    };

    public getItemCategory(): EItemCategory {
        return EItemCategory.ITEMS;
    };

    public getTexture(): IItemTextureDescription {
        return this.texture;
    };

    public inCreative(): boolean {
        return true;
    };

    public getTags?(): string[] {
        return null;
    };

    public isThrowable?(): boolean;

    public static setFunctions(instance: { id: number, [key: string]: any }) {
        if("isFireResistant" in instance) {
            Item.setFireResistant(instance.id, true);
        };

        if("isExplodable" in instance) {
            Item.setExplodable(instance.id, true);
        };

        if("isShouldDespawn" in instance) {
            Item.setShouldDespawn(instance.id, true);
        };

        if("isGlint" in instance) {
            Item.setGlint(instance.id, true);
        };

        if('onIconOverride' in instance) {
            Item.registerIconOverrideFunction(instance.id, instance.onIconOverride);
        };

        if('onNoTargetUse' in instance) {
            Item.registerNoTargetUseFunction(instance.id, instance.onNoTargetUse);
        };

        if('onUsingReleased' in instance) {
            Item.registerUsingReleasedFunction(instance.id, instance.onUsingReleased);
        };

        if('onUsingComplete' in instance) {
            Item.registerUsingCompleteFunction(instance.id, instance.onUsingComplete);
        };

        if('onItemUse' in instance) {
            Item.registerUseFunction(instance.id, instance.onItemUse);
        };

        if('onNameOverride' in instance) {
            Item.registerNameOverrideFunction(instance.id, instance.onNameOverride);
        };

        if('onHand' in instance) {
            BasicItem.handFunctions.set(instance.id, (instance as ItemHandComponent).onHand);
        };

        if("getItemCategory" in instance) {
            Item.setCategory(instance.id, instance.getItemCategory())
        }
    };

    public create(params: ItemParams): void {
        const tags = this.getTags();

        if(tags) {
            TagRegistry.addCommonObject("items", this.id, tags);
        };

        const textureData = this.getTexture();

        const itemTexture = Object.assign(
            textureData,
            textureData.name instanceof Array && {texture: textureData.name[0]}
        ) as Item.TextureData;
        
        const itemParams = Object.assign({
            stack: this.getMaxStack(),
            isTech: !this.inCreative(),
            category: this.getItemCategory()
        }, params);

        let key = "createItem";

        if("food" in params) {
            key = "createFoodItem";
        };

        if("type" in params) {
            key = "createArmorItem";
        };

        if(this.isThrowable && this.isThrowable()) {
            key = "createThrowableItem";
        };

        Item[key](this.stringID, this.getName(), itemTexture, itemParams);
        // if(textureData.name instanceof Array) { 
        //     const [texture, frames, interval] = textureData.name;

        //     IAHelper.makeAdvancedAnim(this.id, 
        //         texture, 
        //         interval,
        //         frames instanceof Array ? frames : Utils.range(0, frames)
        //     );
        // };

        BasicItem.setFunctions(this);
    };

};

