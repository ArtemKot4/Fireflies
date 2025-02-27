namespace Utils {
    export function setEmptyBlockCollision(id: number) {
        const render = new ICRender.Model();
        const model = BlockRenderer.createModel();
        const shape = new ICRender.CollisionShape();
        const entry = shape.addEntry();

        entry.addBox(0, 0, 0, 0, 0, 0);
        BlockRenderer.setCustomCollisionShape(id, -1, shape);
        render.addEntry(model);
    };

    export function getBlockTags(id: number): string[] {
        return TagRegistry.getTagsFor("blocks", id);
    };

    export function getItemTags(id: number): string[] {
        return TagRegistry.getTagsFor("items", id);
    };

    export function getDimensionTags(id: number): string[] {
        return TagRegistry.getTagsFor("dimensions", id);
    };

    export function actionbarMessage(player: number, message: string): void {
        Commands.exec("/title " + Entity.getNameTag(player) + " actionbar " + message);
    };

    export function isCreativePlayer(player: number): boolean {
        const gamemode = new PlayerActor(player).getGameMode();
        
        return gamemode === EGameMode.CREATIVE || gamemode === EGameMode.SPECTATOR;
    };

    export function range(min: number, max: number, number: number = 1): number[] {
        const list = [];
    
        for (let i = min; i < max; i += number) {
            list.push(i);
        }
    
        return list;
    };
    
    export function parseBlockID(id: string): number {
        return BlockID[id] || VanillaBlockID[id];
    };
    
    export function parseItemID(id: string): number {
        return ItemID[id] || VanillaItemID[id];
    };
    
    export function parseID(id: string): number {
        return parseBlockID(id) ?? parseItemID(id);
    };
};

const NativeBlock = com.zhekasmirnov.innercore.api.NativeBlock;

type NativeRendererTransform = com.zhekasmirnov.innercore.api.NativeRenderer.Transform;

declare namespace com.zhekasmirnov.innercore.api.NativeBlock {
    export function setSolid(id: number, solid: boolean): void;
    export function setRenderAllFaces(id: number, render: boolean): void;
    export function setRenderType(id: number, type: number): void;
    export function setRenderLayer(id: number, layer: number): void;
    export function setLightLevel(id: number, level: number): void;
    export function setLightOpacity(id: number, opacity: number): void;
    export function setExplosionResistance(id: number, resistance: number): void;
    export function setFriction(id: number, friction: number): void;
    export function setTranslucency(id: number, translucency: number): void;
    export function setSoundType(id: number, type: Block.Sound): void;
    export function setMapColor(id: number, color: number): void;
    export function setBlockColorSource(id: number, source: Block.ColorSource): void;
    export function setMaterialBase(id: number, base_id: number): void;
};

enum EDestroyLevel {
    HAND = 0,
    STONE = 1,
    IRON = 2,
    DIAMOND = 3,
    OBSIDIAN = 4
};

declare namespace ToolAPI {
    export function isAxe(item: number): boolean;
    export function isPickaxe(item: number): boolean;
};

ToolAPI.isAxe = function(item: number): boolean {
    return ToolAPI.getToolData(item)?.blockMaterials?.["wood"];
};

ToolAPI.isPickaxe = function(item: number): boolean {
    return ToolAPI.getToolData(item)?.blockMaterials?.["stone"];
};

declare namespace Game {
    export function actionbarMessage(message: string): void;
};

Game.actionbarMessage = function(message: string): void {
    Commands.exec(`title ${Player.getLocal()} actionbar ${message}`);
};