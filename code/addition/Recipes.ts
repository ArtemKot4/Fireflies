namespace Recipes {
    export const itemsAfterBurn: Record<string, ItemInstance> = {};
    export const specialFuelBurnDurations: Record<string, number> = {}; 

    export function getFuelBurnDurationResult(item: ItemInstance | number): Nullable<ItemInstance> {
        return itemsAfterBurn[new ItemStack(item).toString(1)] || null;
    } 

    export function registerFuelBurnDurationResult(item: ItemInstance | number, itemResult: ItemInstance | number): void {
        itemsAfterBurn[new ItemStack(item).toString(1)] = new ItemStack(itemResult);
    }

    /**
     * It can be used by mods, but don't usings inside vanilla furnaces
     */
    export function getSpecialFuelBurnDuration(id: number, data: number): number {
        return specialFuelBurnDurations[`${id}:${data}`] || Recipes.getFuelBurnDuration(id, data);
    }

    /**
     * Registers fuel burn duration special: not work with vanilla furnaces
     */
    export function registerSpecialFuelBurnDuration(id: number, data: number, duration: number): void {
        specialFuelBurnDurations[`${id}:${data}`] = duration;
    }

    registerSpecialFuelBurnDuration(VanillaItemID.lava_bucket, 0, 1000 * 20);

    registerFuelBurnDurationResult(
        { id: VanillaItemID.lava_bucket, count: 1, data: 0 }, 
        { id: VanillaItemID.bucket, count: 1, data: 0 }
    );
}