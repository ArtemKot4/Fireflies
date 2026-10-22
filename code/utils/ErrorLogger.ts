/**
 * Decorator to log your errors instead they be throwed.
 * @example 
 * ```ts
 * class ErrorThrower {
 *     \@ErrorLogger({ customMessage: (error) => error.message })
 *     public method() {
 *         throw 'I love throw error for this case';
 *     }
 * }
 * ``` 
 * It will print error at logs instead throw
 */
function ErrorLogger(
    settings: {
        customMessage: ((error: Error) => string) | string,
        /**
         * @default "error"
         */
        prefix?: string,
        /**
         * @default false
         */
        sendGameMessage?: boolean,
        /**
         * @default 20
         */
        gameMessageTickRate?: number
    } 
) {
    const prefix = settings.prefix ?? "error";
    const gameMessageTickRate = settings.gameMessageTickRate ?? 20;

    return function<T extends Function> (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        const original: T = descriptor.value;
        descriptor.value = function (this: unknown, ...args: unknown[]) {
            let result = null;
            try {
                result = original.apply(this, args);
            } catch(error) {
                const message = typeof settings.customMessage == "string" ? settings.customMessage : settings.customMessage(error); 
                Logger.Log(message, prefix);
                if(settings.sendGameMessage == true && World.getThreadTime() % gameMessageTickRate == 0) {
                    Network.sendServerMessage(`[<${prefix}>] ${message}`)
                }
            }
            return result;
        };
        return descriptor;
    };
}