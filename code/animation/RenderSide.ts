class RenderSide<T extends string | RenderMesh> {
    public readonly list: RenderMesh[];

    constructor(dir: string, model: RenderMesh);
    constructor(dir: string, model: string, importParams?: RenderMesh.ImportParams);
    constructor(
        dir: string, 
        public model: T,
        public importParams: RenderMesh.ImportParams = null
    ) {
        const rotations: number[][] = [
            [0, -Math.PI, 0],
            [0, Math.PI, 0],
            [0, Math.PI / 2, 0],
            [0, -Math.PI / 2, 0]

            // [0, 0, 0],
            // [0, -Math.PI, 0],
            // [0, Math.PI / 2, 0],
            // [0, -Math.PI / 2, 0]
        ];

        if(model instanceof RenderMesh) {
            this.list = rotations.map((value: number[]) => {
                const copy = model.clone();
                copy.rotate(value[0], value[1], value[2]);
                return copy;
            });
            return;
        };

        this.list = rotations.map((value: number[]) => {
            return RenderHelper.generateMesh(dir, model, this.importParams, value)
        });
    };

    public getWithData(data: number): RenderMesh {
        return this.list[data];
    };

    public getForTile(tile_entity: TileEntity.TileEntityPrototype): RenderMesh {
        const data = BlockSource.getCurrentClientRegion().getBlockData(
            tile_entity.x,
            tile_entity.y,
            tile_entity.z
        );

        return this.getWithData(data);
    };
};
