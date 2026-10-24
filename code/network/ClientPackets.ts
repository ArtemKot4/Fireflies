Network.addClientPacket("send_particles", (data: { type: number, x: number, y: number, z: number, vx: number, vy: number, vz: number, data?: number }) => {
    Particles.addParticle(data.type, data.x, data.y, data.z, data.vx, data.vy, data.vz, data.data);
}); 

Network.addClientPacket("send_message", (data: { message: string }) => {
    Game.message(data.message);
}); 

/**
 * Will be deleted or renamed in future. Don't use now if you don't author of library
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
    export function sendToPlayer<Data extends Object = {}>(playerUid: number, name: string, data: Data): void {
        const client = Network.getClientForPlayer(playerUid);
        if(client != null) {
            return client.send(name, data);
        }
    }

    /**
     * @returns failed clients
     */
    export function sendToClients<Data extends Object = {}, Client = (number | NetworkClient)>(clients: Client[], name: string, data: Data): Nullable<Client[]> {
        let failed: Client[];

        for(let client of clients) {
            let actual: NetworkClient;
            if(typeof client == "number") {
                actual = Network.getClientForPlayer(client);
            } else {
                actual = client as Nullable<NetworkClient>;
            }
            if(actual == null) {
                failed ??= [];
                failed.push(client);
                continue;
            }
            actual.send(name, data);
        }
        return failed;
    }
}