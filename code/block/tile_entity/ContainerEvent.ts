/**
 * Decorator to create container event with your method in tile entity.
 * @param target Your tile entity
 * @param propertyName Name of method
 */

function ContainerEvent(target: CommonTileEntity | LocalTileEntity, propertyName: string) {
    target.eventNames = { ...target.eventNames };
    target.eventNames.container = target.eventNames.container || [];
    
    target.eventNames.container.push(propertyName);
};