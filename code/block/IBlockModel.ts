interface IBlockModel {
    getModel?(): RenderMesh | RenderMesh[] | BlockModel | BlockModel[] | BlockRenderer.Model | ICRender.Model;
}