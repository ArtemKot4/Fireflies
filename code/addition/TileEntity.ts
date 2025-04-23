namespace TileEntity {
    export function buildEvents(prototype: TileEntity.TileEntityPrototype): void {
        if("eventNames" in prototype) {
            prototype.events = {};
            prototype.containerEvents = {};

            for(const i in prototype.eventNames.network) {
                const name = prototype.eventNames.network[i];

                prototype.events[name] = prototype[name];
            }
    
            for(const i in prototype.eventNames.container) {
                const name = prototype.eventNames.container[i];

                prototype.containerEvents[name] = prototype[name];
            }
        }
    }

    export function openFor(client: NetworkClient, tile: TileEntity.TileEntityPrototype & { container: ItemContainer }) {
        if(tile != null) {
            const screenName = tile.getScreenName(client.getPlayerUid(), new Vector3(tile.x, tile.y, tile.z));
            if(screenName != null) {
                tile.container.openFor(client, screenName);
            }
        }
    }
}