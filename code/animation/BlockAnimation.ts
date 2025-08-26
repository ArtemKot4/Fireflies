class BlockAnimation {
    public animation?: Animation.Base;

    constructor(public coords: Vector, public tile_entity?: TileEntity.TileEntityPrototype) {
        this.animation = new Animation.Base(coords.x, coords.y, coords.z);
        this.animation.setBlocklightMode();
        return;
    }

    public load(): void {
        if(this.animation.exists()) {
            this.animation.destroy();
        }

        return this.animation.load();
    }

    public describe(mesh: RenderMesh | RenderSide<string>, texture: string, scale: number = 1, material?: string): void {
        this.animation.describe({
            mesh: mesh instanceof RenderSide ? mesh.getForTile(this.tile_entity) : mesh,
            skin: "terrain-atlas/" + texture + ".png",
            scale: scale,
            ...(material && { material }),
        });
    }

    public rotate(x: number, y: number, z: number): com.zhekasmirnov.innercore.api.NativeRenderer.Transform {
        return this.animation.transform().rotate(x, y, z);
    }

    public scale(x: number, y: number, z: number): com.zhekasmirnov.innercore.api.NativeRenderer.Transform {
        return this.animation.transform().scale(x, y, z);
    }

    public setPos(x: number, y: number, z: number): void {
        return this.animation.setPos(x, y, z);
    }

    public refresh(): void {
        return this.animation.refresh();
    }

    public destroy(): void {
        return this.animation.destroy();
    }
}