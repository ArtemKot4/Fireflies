namespace ToolAPI {
    export function isAxe(item: number): boolean {
        return ToolAPI.getToolData(item)?.blockMaterials?.["wood"];
    }

    export function isPickaxe(item: number): boolean {
        return ToolAPI.getToolData(item)?.blockMaterials?.["stone"];
    }

    export function isShovel(item: number): boolean {
        return ToolAPI.getToolData(item)?.blockMaterials?.["dirt"];
    }

    export function isHoe(item: number): boolean {
        return ToolAPI.getToolData(item)?.blockMaterials?.["farmland"];
    }
}