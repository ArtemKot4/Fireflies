// Thanks Gicu
namespace TileAccess {
    export const MAX_OPEN_DISTANCE = 10;

    export function getPlayerPosition<Player extends number | PlayerActor>(player: Player): Vector {
        if(typeof player == "number") {
            return Entity.getPosition(player);
        }
        if(typeof player == "object" && "getUid" in player) {
            return Entity.getPosition(player.getUid());
        }
        return null;
    }

    export function isPlayerInRange<Player extends number | PlayerActor>(player: Player, coords: Vector, maxDistance: number = MAX_OPEN_DISTANCE): boolean {
        if(player == null || coords == null) {
            return true;
        }
        const position = getPlayerPosition(player);
        if(position == null) {
            Logger.Log("TileAccess: player position cannot be resolved, access denied (fail-closed)", "DEBUG");
            return false;
        }
        const dx = coords.x - position.x;
        const dy = coords.y - position.y;
        const dz = coords.z - position.z;
        return dx * dx + dy * dy + dz * dz <= maxDistance * maxDistance;
    }
}
