Network.addClientPacket("send_particles", (data: { type: number, x: number, y: number, z: number, vx: number, vy: number, vz: number, data?: number }) => {
    Particles.addParticle(data.type, data.x, data.y, data.z, data.vx, data.vy, data.vz, data.data);
}); 

Network.addClientPacket("send_message", (data: { message: string }) => {
    Game.message(data.message);
}); 

/**
 * Will be deleted in future. Don't use if you don't author of library
 */
namespace NetworkHelper {
    export function sendToPlayer(playerUid: number, name: "send_particles", data: { type: number, x: number, y: number, z: number, vx: number, vy: number, vz: number, data?: number }): void;
    export function sendToPlayer(playerUid: number, name: "send_message", data: { message: string })

    /**
     * Sends packet from server for client by player uid
     * @param playerUid player uid
     * @param name packet name
     * @param data packet data
     */
    export function sendToPlayer<T extends Object = {}>(playerUid: number, name: string, data: T): void {
        const client = Network.getClientForPlayer(playerUid);
        if(client != null) {
            return client.send(name, data);
        }
    }
}