/**
 * The factory of decorators to add callback from function.
 * @example
 * ```ts
    class Example {
        [@SubscribeEvent(ECallback.LOCAL_TICK)]
        public onTick() {
            Game.message("example")
        }
    };
 * ```
 * @param event {@link ECallback} enum value
 * @returns decorator
 */
function SubscribeEvent(event: ECallback): MethodDecorator;

/**
 * Decorator to add callback from function by function name and same function. Format will be "onNameOfCallback". "on" optional.
 * @example
 * ```ts
 * class ExampleDestroyBlock {
        [@SubscribeEvent]
        public onDestroyBlock() {
            Game.message("break block")
        }
    }
 * ```
 * @param target 
 * @param key 
 * @param descriptor 
 */
function SubscribeEvent(target: unknown, key: string, descriptor: PropertyDescriptor): PropertyDescriptor;

function SubscribeEvent(value: unknown, key?: string, descriptor?: PropertyDescriptor): unknown {
    if(typeof value === "string" && arguments.length === 1) {
        return function(target: Function, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
            Callback.addCallback(value, descriptor.value);
            return descriptor;
        };
    };

    if(key.startsWith("on")) {
        key.replace("on", "");
    };

    if(!key) {
        throw new java.lang.RuntimeException("Decorator SubscribeEvent error: name of the function after change become is not valid.");
    };

    key.replace(key[0], key[0].toLocaleLowerCase());

    Callback.addCallback(key, descriptor.value);
    return descriptor;
};