namespace LiquidItemRegistry {
    /**
     * in mili buckets
     */
    export const BUCKET_CAPACITY = 1000;

    export interface ILiquidStorage {
        capacity: number;
        liquids: string[]
    }
    export const storage: Record<string, ILiquidStorage> = {};

    export function registerLiquidStorage(id: number, data: number, description: ILiquidStorage): void {
        const key = (id + ":" + data);
        if(getLiquidStorage(id, data) != null) {
            throw new Error(`Item liquid storage by "${key}" already registered`);
        }
        storage[key] = description;
    }

    export function getLiquidStorage(id: number, data: number): Nullable<ILiquidStorage> {
        return storage[id + ":" + data] || null;
    }

    export function getCapacity(id: number, data: number): number {
        const capacity = getLiquidStorage(id, data)?.capacity;
        if(capacity != null) {
            return capacity;
        }
        if(LiquidRegistry.getItemLiquid(id, data) != null) {
            return LiquidItemRegistry.BUCKET_CAPACITY;
        }
    }

    export function getLiquids(id: number, data: number): string[] {
        const liquids = getLiquidStorage(id, data).liquids;
        if(liquids != null) {
            return liquids;
        }
        const list = [];
        const liquid = LiquidRegistry.getItemLiquid(id, data);
        if(liquid != null) {
            list.push(liquid);
        }
        return list;
    }

    export function getCurrentLiquid(extra: Nullable<ItemExtraData>): Nullable<string> {
        if(extra == null) {
            return null;
        }
        return extra.getString("liquid.name");
    }

    export function getCurrentLiquidCapacity(extra: Nullable<ItemExtraData>): number {
        if(extra == null) {
            return null;
        }
        return extra.getInt("liquid.capacity", 0);
    }
}