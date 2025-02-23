abstract class LocalTileEntity implements TileEntity.LocalTileEntityPrototype {
        /**
         * Called when the client copy is created.
         * @since 2.0.2b29
         */
        load?(): void;
        /**
         * Called on destroying the client copy.
         * @since 2.0.2b29
         */
        unload?(): void;
        /**
         * Called every tick on client thread; you cannot set
         * tick later if there is no function at all.
         */
        tick?(): void;
        /**
         * Events that receive packets on the client side.
         */

    public constructor() {};
};

namespace LocalTileEntity {
    export function NetworkEvent(target: LocalTileEntity, propertyName: string) {
        target.events[propertyName] = target[propertyName];
    };

    export function ContainerEvent(target: LocalTileEntity, propertyName: string) {
        target.containerEvents[propertyName] = target[propertyName];
    };
}