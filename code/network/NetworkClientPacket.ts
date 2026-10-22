interface INetworkClientPacketMethod {
    (data: Object): void;
}

type NetworkClientPacketMethodDescriptor = TypedPropertyDescriptor<INetworkClientPacketMethod>;

/**
 * The factory of decorators to add client packet from static method.
 * @example
 * ```ts
 * class ExampleClientParticleManager {
 *     \@SubscribeEvent("do_particles")
 *     public static doParticles(data: { ... }) {
 *         Particles.addParticle(...);
 *     }
 * };
 * 
 * // using
 * const playerUid = ...;
 * Network.getClientForPlayer(playerUid).send("do_particles", { ... });
 * ```
 */
function NetworkClientPacket(name: string): (target: Object, propertyKey: string | symbol, descriptor: NetworkClientPacketMethodDescriptor) => NetworkClientPacketMethodDescriptor | void;

/**
 * Decorator to add client packet from static method by static method name and same static method.
 * @example
 * ```ts
 * class ExampleClientParticleManager {
 *     \@SubscribeEvent
 *     public static doParticles(data: { ... }) {
 *         Particles.addParticle(...);
 *     }
 * };
 * 
 * // using
 * const playerUid = ...;
 * Network.getClientForPlayer(playerUid).send("doParticles", { ... });
 * ```
 */
function NetworkClientPacket(target: unknown, key?: string, descriptor?: NetworkClientPacketMethodDescriptor): NetworkClientPacketMethodDescriptor;

function NetworkClientPacket(
    target: string,
    keyMethod?,
    descriptor?: NetworkClientPacketMethodDescriptor
): unknown {
    if (descriptor != undefined) {
        const method = descriptor.value;
        
        if(typeof target != 'function') {
            throw new Error(`@NetworkClientPacket can only be used on static methods inside class`);
        }
        Network.addClientPacket(keyMethod, method);
        return descriptor;
    }
    
    return function(target: any, key: string, desc: NetworkClientPacketMethodDescriptor): NetworkClientPacketMethodDescriptor {
        const method = desc.value;
        const name = target;
        
        if(typeof target != 'function') {
            throw new Error(`@NetworkClientPacket can only be used on static methods inside class`);
        }
        Network.addClientPacket(name, method);
        return desc;
    };
}