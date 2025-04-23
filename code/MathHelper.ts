namespace MathHelper {
    export function randomFrom<T>(...elements: T[]): T {
        return elements[Math.floor(Math.random() * elements.length)];
    }

    export function randomFromArray<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    export function radian(gradus: number): number {
        return (gradus * Math.PI) / 180;
    }

    export function randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    export function range(min: number, max: number, number: number = 1): number[] {
        const list: number[] = [];
    
        for(let i = min; i < max; i += number) {
            list.push(i);
        }
    
        return list;
    }
}