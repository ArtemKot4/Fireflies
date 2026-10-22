interface INetworkServerPacketMethod {
    (client: NetworkClient, data: Object): void;
}

type NetworkServerPacketMethodDescriptor = TypedPropertyDescriptor<INetworkServerPacketMethod>;

/**
 * The factory of decorators to add server packet from static method.
 * @example
 * ```ts
 * class ExampleGriefManager {
 *     \@SubscribeEvent("clear_someone_inventory")
 *     public static clearSomeoneInventory(senderClient: NetworkClient, data: { ... }) {
 *         const clients = Network.getConnectedClients();
 *         for(const i in clients) {
 *             const client = clients[i];
 *             if(client != null && client.getPlayerUid() != senderClient.getPlayerUid()) {
 *                 new PlayerWrapper(client.getPlayerUid()).clearInventory();
 *             }
 *         }
 *     }
 * };
 * 
 * // using
 * Network.sendToServer("clear_someone_inventory", {});
 * ```
 */

function NetworkServerPacket(name: string): (target: Object, propertyKey: string | symbol, descriptor: NetworkServerPacketMethodDescriptor) => NetworkServerPacketMethodDescriptor | void;

/** 
 * Decorator to add server packet from static method by static method name and same static method.
 * @example
 * ```ts
 * class ExampleGriefManager {
 *     \@SubscribeEvent
 *     public static clearSomeoneInventory(senderClient: NetworkClient, data: { ... }) {
 *         const clients = Network.getConnectedClients();
 *         for(const i in clients) {
 *             const client = clients[i];
 *             if(client != null && client.getPlayerUid() != senderClient.getPlayerUid()) {
 *                 new PlayerWrapper(client.getPlayerUid()).clearInventory();
 *             }
 *         }
 *     }
 * };
 * 
 * // using
 * Network.sendToServer("clearSomeoneInventory", {});
 * ```
 */

function NetworkServerPacket(target: unknown, key?: string, descriptor?: NetworkServerPacketMethodDescriptor): NetworkServerPacketMethodDescriptor;

function NetworkServerPacket(
    target: string,
    keyMethod?,
    descriptor?: NetworkServerPacketMethodDescriptor
): unknown {
    if(descriptor != undefined) {
        const method = descriptor.value;
        
        if(typeof target != 'function') {
            throw new Error(`@NetworkServerPacket can only be used on static methods inside class`);
        }
        Network.addServerPacket(keyMethod, method);
        return descriptor;
    }
    
    return function(target: any, key: string, desc: NetworkServerPacketMethodDescriptor): NetworkServerPacketMethodDescriptor {
        const method = desc.value;
        const name = target;
        
        if(typeof target != 'function') {
            throw new Error(`@NetworkServerPacket can only be used on static methods inside class`);
        }
        Network.addServerPacket(name, method);
        return desc;
    };
}