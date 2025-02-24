/**
 * Decorator to create container event with your method in tile entity.
 * @param target Your tile entity
 * @param propertyName Name of method
 */

function ContainerEvent(target: CommonTileEntity | LocalTileEntity, propertyName: string, descriptor: PropertyDescriptor) {
    target.containerEvents = target.containerEvents || {};
    target.containerEvents[propertyName] = descriptor.value;
};