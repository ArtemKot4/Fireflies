ModAPI.registerAPI("FirefliesAPI", {
    MathHelper,
    Utils,
    RenderHelper,
    RenderSide,
    BlockAnimation,
    EDestroyLevel,
    Vector3,
    ItemStack,
    BasicBlock,
    BlockModel,
    BlockPlant,
    BlockBush,
    Keyboard,
    UIHelper,
    PlayerUser,
    Bark,
    Hewn,
    Log,
    Planks,
    RotatableLog,
    BasicItem,
    Command,
    ClientCommand,
    ServerCommand,
    CommonTileEntity,
    LocalTileEntity,
    NetworkEvent,
    ContainerEvent,
    Dimension,
    RuntimeData,
    EScreenName,
    Notification,
    ECallback,
    SubscribeEvent,
    requireGlobal(command: string) {
		return eval(command);
	}
});