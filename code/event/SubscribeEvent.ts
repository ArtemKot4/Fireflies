/**
 * The factory of decorators to add callback from function.
 * @example
 * ```ts
    class Example {
        SubscribeEvent(ECallback.LOCAL_TICK)
        public onTick() {
            Game.message("example")
        }
    };
 * ```
 * @param event {@link ECallback} enum value
 * @returns decorator
 */
function SubscribeEvent(event: ECallback) {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        Callback.addCallback(event, descriptor.value);
        return descriptor;
    };
};