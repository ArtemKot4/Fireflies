namespace TagRegistry {
    export function getBlockTags(id: number): string[] {
        return TagRegistry.getTagsFor("blocks", id);
    }

    export function getItemTags(id: number): string[] {
        return TagRegistry.getTagsFor("items", id);
    }

    export function getDimensionTags(id: number): string[] {
        return TagRegistry.getTagsFor("dimensions", id);
    }
}