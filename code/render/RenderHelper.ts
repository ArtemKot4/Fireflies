namespace RenderHelper {
    export function generateMesh(
        dir: string,
        model: string,
        params: RenderMesh.ImportParams = {
            translate: [0.5, 0.5, 0.5],
            invertV: false,
            noRebuild: false,
        },
        rotate?: number[]
    ): RenderMesh {
        const mesh = new RenderMesh(
          dir + model + ".obj",
          "obj",
          params
        );

        if(rotate) {
            mesh.rotate(rotate[0], rotate[1], rotate[2]);
        };

        return mesh;
    };

}