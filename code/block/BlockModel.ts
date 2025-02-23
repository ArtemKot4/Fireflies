class BlockModel {
    protected readonly mesh: RenderMesh;
    protected readonly data: number;

    public constructor(model: string, texture: {name: string, meta: number} | string = model, data: number = -1) {
       
         texture = typeof texture === "object" ? texture : {name: texture, meta: 0}; 

         this.mesh = new RenderMesh();
         this.mesh.importFromFile(__dir__ + "/resources/assets/models/block/" + model + ".obj","obj", null);
         this.mesh.setBlockTexture(texture.name, texture.meta);
         this.mesh.translate(0.5, 0, 0.5);

         this.data = data;
    };

    public getRenderMesh(): RenderMesh {
        return this.mesh;
    };

    public scale(x: number, y: number, z: number): this {
        this.mesh.scale(x, y, z);
        return this;
    };

    public translate(x: number, y: number, z: number): this {
        this.mesh.translate(x, y, z);
        return this;
    };

    public rotate(x: number, y: number, z: number): this {
        this.mesh.rotate(x, y, z);
        return this;
    };

    public getBlockData(): number {
        return this.data;
    };

};
