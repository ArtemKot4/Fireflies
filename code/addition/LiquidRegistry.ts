namespace LiquidItemRegistry {
    export interface ILiquidStorage {
        capacity: number;
        liquids: string[]
    }
    export const storage: Record<string, ILiquidStorage> = {};

    export function registerLiquidStorage(id: number, data: number, description: ILiquidStorage): void {
        data = data == -1 ? 0 : data;
        const key = (id + ":" + data);
        if(getLiquidStorage(id, data) != null) {
            throw new Error(`Item liquid storage by "${key}" already registered`);
        }
        storage[key] = description;
    }

    export function getLiquidStorage(id: number, data: number): Nullable<ILiquidStorage> {
        return storage[id + ":" + (data == -1 ? 0 : data)] || null;
    }

    export function getCapacity(id: number, data: number): number {
        return getLiquidStorage(id, data).capacity || 0;
    }

    export function getLiquids(id: number, data: number): string[] {
        return getLiquidStorage(id, data).liquids || [];
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