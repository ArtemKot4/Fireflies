class PlayerUser {
    public readonly actor: PlayerActor;
    public constructor(public playerUid: number) {
        this.actor = new PlayerActor(playerUid);
    };

    public getUid() {
        return this.actor.getUid();
    };

    public getDimension() {
        return this.actor.getDimension();
    };

    public getGameMode() {
        return this.actor.getGameMode();
    };

    public addItemToInventory(item: ItemInstance): void;
    public addItemToInventory(id: number, count?: number, data?: number, extra?: Nullable<ItemExtraData>): void;
    public addItemToInventory(item: ItemInstance | number, count?: number, data?: number, extra?: Nullable<ItemExtraData>) {
        if(typeof item === "object") {
            this.actor.addItemToInventory(item.id, item.count, item.data, item.extra, true);
        } else {
            this.actor.addItemToInventory(item, count || Item.getMaxStack(item), data || 0, extra, true);
        };
    };

    public getInventorySlot(slot: number): ItemStack {
        return new ItemStack(this.actor.getInventorySlot(slot));
    };

    
    public setInventorySlot(slot: number, item: ItemInstance): void;
    public setInventorySlot(slot: number, id: number, count?: number, data?: number, extra?: Nullable<ItemExtraData>): void;
    public setInventorySlot(slot: number, item: ItemInstance | number, count?: number, data?: number, extra?: Nullable<ItemExtraData>): void {
        if(typeof item === "object") {
            this.actor.setInventorySlot(slot, item.id, item.count, item.data, item.extra);
        } else {
            this.actor.setInventorySlot(slot, item, count || Item.getMaxStack(item), data || 0, extra);
        };
    };

    public getArmor(slot: number): ItemStack {
        return new ItemStack(this.actor.getArmor(slot));
    };

    public setArmor(slot: number, item: ItemInstance): void;
    public setArmor(slot: number, id: number, count?: number, data?: number, extra?: Nullable<ItemExtraData>): void;
    public setArmor(slot: number, item: ItemInstance | number, count?: number, data?: number, extra?: Nullable<ItemExtraData>): void {
        if(typeof item === "object") {
            this.actor.setArmor(slot, item.id, item.count, item.data, item.extra);
        } else {
            this.actor.setArmor(slot, item, count || Item.getMaxStack(item), data || 0, extra);
        };
    };

    public setRespawnCoords(x: number, y: number, z: number): void;
    public setRespawnCoords(vector: Vector): void;
    public setRespawnCoords(x: Vector | number, y?: number, z?: number): void {
        if(typeof x === "object") {
            this.actor.setRespawnCoords(x.x, x.y, x.z);
        } else {
            this.actor.setRespawnCoords(x, y, z);
        };
    };

    public spawnExpOrbs(x: number, y: number, z: number, value: number): void;
    public spawnExpOrbs(vector: Vector, value: number): void;
    public spawnExpOrbs(x: Vector | number, y?: number, z?: number, value?: number): void {
        if(typeof x === "object") {
            this.actor.spawnExpOrbs(x.x, x.y, x.z, value);
        } else {
            this.actor.spawnExpOrbs(x, y, z, value);
        };
    };

    public getPointer(): number {
        return this.actor.getPointer();
    };

    public isValid(): boolean {
        return this.actor.isValid();
    };

    public getSelectedSlot(): number {
        return this.actor.getSelectedSlot();
    };

    public setSelectedSlot(slot: number): void {
        this.actor.setSelectedSlot(slot);
    };

    public getExperience(): number {
        return this.actor.getExperience();
    };

    public setExperience(exp: number): void {
        this.actor.setExperience(exp);
    };

    public addExperience(amount: number): void {
        this.actor.addExperience(amount);
    };

    public getLevel(): number {
        return this.actor.getLevel();
    };

    public setLevel(level: number): void {
        this.actor.setLevel(level);
    };

    public getExhaustion(): number {
        return this.actor.getExhaustion();
    };
    
    public setExhaustion(value: number): void {
        this.actor.setExhaustion(value);
    };

    public getHunger(): number {
        return this.actor.getHunger();
    };

    public setHunger(value: number): void {
        this.actor.setHunger(value);
    };

    public getSaturation(): number {
        return this.actor.getSaturation();
    };

    public setSaturation(value: number): void {
        this.actor.setSaturation(value);
    };
    
    public getScore(): number {
        return this.actor.getScore();
    };

    public setScore(value: number): void {
        this.actor.setScore(value);
    };

    public getItemUseDuration(): number {
        return this.actor.getItemUseDuration();
    };

    public getItemUseIntervalProgress(): number {
        return this.actor.getItemUseIntervalProgress();
    };

    public getItemUseStartupProgress(): number {
        return this.actor.getItemUseStartupProgress();
    };
    
    public isOperator(): boolean {
        return this.actor.isOperator();
    };

    public setPlayerBooleanAbility(ability: EPlayerAbility, value: boolean): void {
        this.actor.setPlayerBooleanAbility(ability, value);
    };

    public setPlayerFloatAbility(ability: EPlayerAbility, value: number): void {
        this.actor.setPlayerFloatAbility(ability, value);
    };

    public getPlayerBooleanAbility(ability: string): boolean {
        return this.actor.getPlayerBooleanAbility(ability);
    };

    public getPlayerFloatAbility(ability: string): number {
        return this.actor.getPlayerFloatAbility(ability);
    };

    public canFly(): boolean {
        return this.actor.canFly();
    };

    public setCanFly(enabled: boolean): void {
        this.actor.setCanFly(enabled);
    };

    public isFlying(): boolean {
        return this.actor.isFlying();
    };

    public setFlying(enabled: boolean): void {
        return this.actor.setFlying(enabled);
    };

    public getEffect(effect: EPotionEffect): Entity.EffectInstance {
        return Entity.getEffect(this.playerUid, effect);
    };

    public setEffect(effectId: EPotionEffect, effectData: number, effectTime: number, ambience?: boolean, particles?: boolean): void {
        Entity.addEffect(this.playerUid, effectId, effectData, effectTime, ambience, particles);
    };

    public isSneaking(): boolean {
        return Entity.getSneaking(this.playerUid);
    };

    public setSneaking(value: boolean): void {
        Entity.setSneaking(this.playerUid, value);
    };

    public getName(): string {
        return Entity.getNameTag(this.playerUid);
    };

    public getCarriedItem(): ItemStack {
        return new ItemStack(Entity.getCarriedItem(this.playerUid));
    };

    public decreaseCarriedItem(count: number = 1): void {
        const stack = this.getInventorySlot(this.getSelectedSlot());

        this.setInventorySlot(this.getSelectedSlot(), stack.id, stack.count - count, stack.data, stack.extra);
    };

    public clearSlot(slot?: number): void {
        this.setInventorySlot(typeof slot === "number" ? slot : this.getSelectedSlot(), new ItemStack());
    };

    public clearInventory(): void {
        for(let i = 0; i < 36; i++) {
            this.setInventorySlot(i, new ItemStack());
        };
    };
};
