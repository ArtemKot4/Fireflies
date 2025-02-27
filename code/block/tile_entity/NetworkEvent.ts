/**
 * Decorator to create network event with your method in tile entity.
 * @param target Your tile entity
 * @param propertyName Name of method
 */

function NetworkEvent(target: CommonTileEntity | LocalTileEntity, propertyName: string) {
    target.eventNames = { ...target.eventNames };
    target.eventNames.network = target.eventNames.network || [];

    target.eventNames.network.push(propertyName);
};