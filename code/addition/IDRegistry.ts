namespace IDRegistry {
    export function parseBlockID(id: string): number {
        return BlockID[id] || VanillaBlockID[id];
    }
    
    export function parseItemID(id: string): number {
        return ItemID[id] || VanillaItemID[id];
    }
    
    export function parseID(id: string): number {
        return parseBlockID(id) ?? parseItemID(id);
    }
}