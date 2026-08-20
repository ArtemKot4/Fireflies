class RotatableBlock extends BasicBlock {
    public override build(): void {
        this.id = IDRegistry.genBlockID(this.stringID);
        Block.createBlockWithRotation(
            this.stringID, 
            this.variationList.map((v) => {
                if(v.texture.length < 6) {
                    for(let i = v.texture.length; i < 6; i++) {
                        v.texture.push(v.texture[v.texture.length - 1]);
                    }
                }
                return v;
            })
        );
        BlockEvents.applyData(this);
    }
}