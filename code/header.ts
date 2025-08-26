enum Side {
    CLIENT,
    SERVER
}

declare namespace com.zhekasmirnov.innercore.api.NativeBlock {
    export function setCanContainLiquid(id: number, can: boolean): void;
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
}

declare namespace com.zhekasmirnov.innercore.api.NativeAPI {
    export function getDifficulty(): EGameDifficulty;

    export function setDifficulty(difficulty: EGameDifficulty);

    export function resetCloudColor(): void;

    export function resetFogColor(): void;

    export function resetFogDistance(): void;

    export function resetSkyColor(): void;

    export function resetSunsetColor(): void;

    export function resetUnderwaterFogColor(): void;

    export function resetUnderwaterFogDistance(): void;

    export function setFogColor(r: number, g: number, b: number): void;

    export function setSkyColor(r: number, g: number, b: number): void;

    export function setSunsetColor(r: number, g: number, b: number): void;

    export function setUnderwaterFogColor(r: number, g: number, b: number): void;

    export function setUnderwaterFogDistance(r: number, g: number, b: number): void;

    export function setFogDistance(r: number, g: number, b: number): void;

    export function setCloudColor(r: number, g: number, b: number): void;
}





// declare namespace Game {
//     export function titleMessage(message: string): void;
// };

// Game.titleMessage = function(message: string): void {
//     Commands.exec(`title ${Player.getLocal()} title ${message}`);
// };

namespace RuntimeData {
    /**
     * Screen name on client. 
     */
    export namespace local {
        export let screenName: EScreenName = null;
    }
}