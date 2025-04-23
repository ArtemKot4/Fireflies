namespace World {
    export function getDifficulty(): number {
        return com.zhekasmirnov.innercore.api.NativeAPI.getDifficulty();
    }

    export function setDifficulty(difficulty: number): void {
        com.zhekasmirnov.innercore.api.NativeAPI.setDifficulty(difficulty);
    }

    export function resetCloudColor(): void {
        com.zhekasmirnov.innercore.api.NativeAPI.resetCloudColor();
    }

    export function resetFogColor(): void {
        com.zhekasmirnov.innercore.api.NativeAPI.resetFogColor();
    }

    export function resetFogDistance(): void {
        com.zhekasmirnov.innercore.api.NativeAPI.resetFogDistance();
    }

    export function resetSkyColor(): void {
        com.zhekasmirnov.innercore.api.NativeAPI.resetSkyColor();
    }

    export function resetSunsetColor(): void {
        com.zhekasmirnov.innercore.api.NativeAPI.resetSunsetColor();
    }

    export function resetUnderwaterFogColor(): void {
        com.zhekasmirnov.innercore.api.NativeAPI.resetUnderwaterFogColor();
    }

    export function resetUnderwaterFogDistance(): void {
        com.zhekasmirnov.innercore.api.NativeAPI.resetUnderwaterFogDistance();
    }

    export function setFogColor(r: number, g: number, b: number): void {
        com.zhekasmirnov.innercore.api.NativeAPI.setFogColor(r, g, b);
    }

    export function setSkyColor(r: number, g: number, b: number): void {
        com.zhekasmirnov.innercore.api.NativeAPI.setSkyColor(r, g, b);
    }

    export function setSunsetColor(r: number, g: number, b: number): void {
        com.zhekasmirnov.innercore.api.NativeAPI.setSunsetColor(r, g, b);
    }

    export function setUnderwaterFogColor(r: number, g: number, b: number): void {
        com.zhekasmirnov.innercore.api.NativeAPI.setUnderwaterFogColor(r, g, b);
    }

    export function setUnderwaterFogDistance(r: number, g: number, b: number): void {
        com.zhekasmirnov.innercore.api.NativeAPI.setUnderwaterFogDistance(r, g, b);
    }

    export function setFogDistance(r: number, g: number, b: number): void {
        com.zhekasmirnov.innercore.api.NativeAPI.setFogDistance(r, g, b);
    }

    export function setCloudColor(r: number, g: number, b: number): void {
        com.zhekasmirnov.innercore.api.NativeAPI.setCloudColor(r, g, b);
    }
}