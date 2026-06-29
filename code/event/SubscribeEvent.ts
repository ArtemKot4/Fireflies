/**
 * The factory of decorators to add callback from function.
 * @example
 * ```ts
 * class Example {
 *     \@SubscribeEvent(ECallback.LOCAL_TICK)
 *     public static onTick() {
 *         Game.message("example")
 *     }
 * };
 * ```
 */
function SubscribeEvent(event: ECallback, priority?: number): MethodDecorator;

/**
 * Decorator to add callback from function by function name and same function.
 * Format will be "onNameOfCallback". "on" optional.
 * @example
 * ```ts
 * class ExampleDestroyBlock {
 *     \@SubscribeEvent
 *     public static onDestroyBlock() {
 *         Game.message("break block")
 *     }
 * }
 * ```
 */
function SubscribeEvent(target: unknown, key: string, descriptor: PropertyDescriptor): PropertyDescriptor;

function SubscribeEvent(
    eventOrTarget: ECallback | unknown,
    keyOrPriority?: string | number,
    descriptor?: PropertyDescriptor
): unknown {
    if (descriptor != undefined) {
        const target = eventOrTarget;
        const key = keyOrPriority as string;
        const method = (descriptor as PropertyDescriptor).value;
        
        if(typeof target != 'function') {
            throw new Error(`@SubscribeEvent can only be used on static methods inside class`);
        }
        const eventName = key.replace(/^on/, "");
        Callback.addCallback(eventName, method);
        
        return descriptor;
    }
    const eventName = eventOrTarget as ECallback;
    const priority = keyOrPriority as number | undefined;
    
    return function(target: any, key: string, desc: PropertyDescriptor): PropertyDescriptor {
        const method = desc.value;
        
        if(typeof target != 'function') {
            throw new Error(`@SubscribeEvent can only be used on static methods inside class`);
        }
        
        if(priority != undefined) {
            Callback.addCallback(eventName, method, priority);
        } else {
            Callback.addCallback(eventName, method);
        }
        return desc;
    };
}