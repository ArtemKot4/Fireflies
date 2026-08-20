namespace LiquidRegistry {
    /**
     * in mili buckets
     */
    export const BUCKET_CAPACITY = 1000;
}

/**
 * For create item liquid storages that can in one item contain functions for get and give different liquids. 
 * For example: canister -> can contain water, lava -> can be empty -> all that functions in one item
 */
namespace CanisterLiquidRegistry {
    /**
     * @key `liquids` liquid list that can canister contain
     * @key `capacity` at mili buckets
     */
    export interface ILiquidStorage {
        capacity: number;
        liquids: string[]
    }
    export const storage: Record<string, ILiquidStorage> = {};

    /**
     * Method to register item as canister
     * @param id item id
     * @param data item data
     * @param liquids liquid list that must can canister contain
     * @param capacity at mili buckets 
     */
    export function createFor(id: number, liquids: string[] = [], capacity: number = 1000, data: number = -1): void {
        const key = (id + ":" + data);
        if(getLiquidStorage(id, data) != null) {
            throw `Item liquid storage by "${key}" already registered`;
        }
        storage[key] = { capacity, liquids };
    }

    /**
     * @throws error if liquid storage is not exists
     * @param id item id
     * @param data item data
     * @param liquids additional liquid list that must can canister contain
     */
    export function addLiquidsFor(liquids: string[], id: number, data: number = -1): void {
        if(!hasLiquidStorage(id, data)) {
            throw `LiquidRegistry: "${id}:${data}" must have liquid registry.`;
        }
        const liquidStorage = getLiquidStorage(id, data);
        liquidStorage.liquids = new Set(liquidStorage.liquids.concat(liquids)).values().toArray();
    }

    export function hasLiquidStorage(id: number, data: number = -1): boolean {
        return (id + ":" + data) in storage;
    }

    export function getLiquidStorage(id: number, data: number = -1): Nullable<ILiquidStorage> {
        return storage[id + ":" + data] || null;
    }

    export function getCapacity(id: number, data: number = -1): Nullable<number> {
        const capacity = getLiquidStorage(id, data)?.capacity;
        if(capacity != null) {
            return capacity;
        }
        if(LiquidRegistry.getItemLiquid(id, data) != null) {
            return LiquidRegistry.BUCKET_CAPACITY;
        }
    }

    /** 
     * @returns `[...liquids]` from {@link ILiquidStorage} if liquid storage was registered, else `[liquid]` from {@link LiquidRegistry.getItemLiquid} (works only if item is full bucket) 
     */
    export function getLiquids(id: number, data: number = -1): string[] {
        const liquids = getLiquidStorage(id, data)?.liquids;
        if(liquids != null) {
            return liquids;
        }
        const list: string[] = [];
        const liquid = LiquidRegistry.getItemLiquid(id, data);
        if(liquid != null) {
            list.push(liquid);
        }
        return list;
    }

    /**
     * @returns liquid from extra by string key `liquid.name`
     */
    export function getCurrentLiquid(extra: Nullable<ItemExtraData>): Nullable<string> {
        if(extra == null) {
            return null;
        }
        return extra.getString("liquid.name");
    }

    /**
     * @returns liquid amount from extra by int key `liquid.amount` 
     */
    export function getCurrentLiquidAmount(extra: Nullable<ItemExtraData>): Nullable<number> {
        if(extra == null) {
            return null;
        }
        return extra.getInt("liquid.amount", 0);
    }
}