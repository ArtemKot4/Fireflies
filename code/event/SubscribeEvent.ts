/**
 * The factory of decorators to add callback from function.
 * @example
 * ```ts
    class Example {
        \@SubscribeEvent(ECallback.LOCAL_TICK)
        public static onTick() {
            Game.message("example")
        }
    };
 * ```
 * @param event {@link ECallback} enum value
 * @param priority priority
 * @returns decorator
 */
function SubscribeEvent(event: ECallback, priority?: number): MethodDecorator;

/**
 * Decorator to add callback from function by function name and same function. Format will be "onNameOfCallback". "on" optional.
 * @example
 * ```ts
 * class ExampleDestroyBlock {
        \@SubscribeEvent
        public static onDestroyBlock() {
            Game.message("break block")
        }
    }
 * ```
 * @param target 
 * @param key 
 * @param descriptor 
 */
function SubscribeEvent(target: unknown, key: string, descriptor: PropertyDescriptor): PropertyDescriptor;

function SubscribeEvent(value: ECallback | unknown, key?: string | number, descriptor?: PropertyDescriptor): unknown {
    const method: Function = descriptor.value;
    if(arguments.length > 0) {
        return function(value: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
            Callback.addCallback(value, method, key ? Number(key) : null);
            return descriptor;
        }
    }
    const name = (key as string).replace("on", "");
    Callback.addCallback(name, method);
    return descriptor;
}