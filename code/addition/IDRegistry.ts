namespace IDRegistry {
    /**
     * Method to get valid block id: block id or vanilla block id
     * @param id any block id
     */
    export function parseBlockID(id: string): number {
        return BlockID[id] || VanillaBlockID[id];
    }

    /**
     * Method to get valid item id: item id or vanilla item id
     * @param id any item id
     */
    
    export function parseItemID(id: string): number {
        return ItemID[id] || VanillaItemID[id];
    }

    /**
     * Method to get valid block or item id
     * @param id any id of block or item
     */
    
    export function parseID(id: string): number {
        return parseBlockID(id) ?? parseItemID(id);
    }
}