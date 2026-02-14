class BlockAnimation {
    public animation?: Animation.Base;

    constructor(public coords: Vector, public tileEntity?: TileEntity.TileEntityPrototype) {
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
            mesh: mesh instanceof RenderSide ? mesh.getForTile(this.tileEntity) : mesh,
            skin: "terrain-atlas/" + texture + ".png",
            scale: scale,
            ...(material && { material }),
        });
    }

    public rotate(x: number, y: number, z: number): Render.Transform {
        return this.animation.transform && this.animation.transform().rotate(x, y, z);
    }

    public scale(x: number, y: number, z: number): Render.Transform {
        return this.animation.transform && this.animation.transform().scale(x, y, z);
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

declare namespace Animation {
    type description = {
        /**
         * {@link RenderMesh} object to be displayed with animation.
         * @since 2.0.2b20
         */
        mesh?: RenderMesh,
        /**
         * Numeric ID of the {@link Render} object to be displayed with animation.
         * Can be obtained using {@link Render.getId}
         */
        render?: number,
        /**
         * Name of the texture to be used as render's skin.
         */
        skin?: string,
        /**
         * Animation scale.
         * @default 1
         */
        scale?: number,
        /**
         * Animation material, can be used to apply custom materials to the
         * animation.
         * @since 2.0.2b20
         */
        material?: string
    };
}