/**
 * Decorator to create network event with your method in tile entity.
 * @param target Your tile entity
 * @param propertyName Name of method
 */

function NetworkEvent(target: CommonTileEntity | LocalTileEntity, propertyName: string, descriptor: PropertyDescriptor) {
    target.events = target.events || {};
    target.events[propertyName] = descriptor.value
};