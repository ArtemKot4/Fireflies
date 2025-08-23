interface IDestroyCallback {
    onDestroy(coords: Callback.ItemUseCoordinates, block: Tile, player: number): void
}

interface IDestroyContinueCallback {
    onDestroyContinue(coords: Callback.ItemUseCoordinates, block: Tile, progress: number): void
}

interface IDestroyStartCallback {
    onDestroyStart(coords: Callback.ItemUseCoordinates, block: Tile, player: number): void
}

interface IPlaceCallback {
    onPlace(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number, region: BlockSource): Vector | void
}

interface INeighbourChangeCallback {
    onNeighbourChange(coords: Vector, block: Tile, changedCoords: Vector, region: BlockSource): void
}

interface IEntityInsideCallback {
    onEntityInside(blockCoords: Vector, block: Tile, entity: number): void
}

interface IEntityStepOnCallback {
    onEntityStepOn(coords: Vector, block: Tile, entity: number): void
}

interface IRandomTickCallback {
    onRandomTick(x: number, y: number, z: number, id: number, data: number, region: BlockSource): void;
}

interface IAnimateTickCallback {
    onAnimateTick(x: number, y: number, z: number, id: number, data: number): void;
}

interface IClickCallback {
    onClick(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void;
}

interface IProjectileHitCallback {
    onProjectileHit(projectile: number, item: ItemStack, target: Callback.ProjectileHitTarget): void;
}

class BasicBlock {
    public readonly variationList: Block.BlockVariation[];

    public readonly id: number;
    public readonly stringID: string;

    public constructor(stringID: string, variationList?: Block.BlockVariation[]) {
        this.id = IDRegistry.genBlockID(stringID);

        this.stringID = stringID;
        this.variationList = variationList || [{
            inCreative: true,
            name: `block.${stringID}`,
            texture: [[stringID, 0]]
        }];

        this.build();
    }

    public canRotate() {
        return false;
    }

    public build() {
        const canRotate = this.canRotate();

        if(canRotate) {
            this.variationList.map((v) => {
                if(v.texture.length < 6) {
                    for(let i = v.texture.length; i < 6; i++) {
                        v.texture.push(v.texture[v.texture.length - 1]);
                    };
                };
                return v;
            });
            Block.createBlockWithRotation(this.stringID, this.variationList);
        } else {
            Block.createBlock(this.stringID, this.variationList);
        }

        const tags = this.getTags();

        if(tags != null) {
            TagRegistry.addCommonObject("blocks", this.id, tags);
        }

        const states = this.getStates();

        if(states != null) {
            this.setStates(states);
        }

        if("getModel" in this) {
            const modelList: BlockModel[] = [].concat((this as IBlockModel).getModel());

            if(modelList.length === 1) {
                this.setModel(modelList[0], -1);
            } else {
                for (let i: number = 0; i < modelList.length; i++) {
                    const model = modelList[i];

                    const data: number = model instanceof BlockModel ? model.getBlockData() : i;
                    this.setModel(model, data);
                }
            }
        }

        if("getDestroyTime" in this) {
            Block.setDestroyTime(this.id, this.getDestroyTime());
        }

        if("getSoundType" in this) {
            Block.setSoundType(this.id, this.getSoundType());
        }

        if("getFriction" in this) {
            Block.setFriction(this.id, this.getFriction());
        }

        if("getLightLevel" in this) {
            Block.setLightLevel(this.id, this.getLightLevel());
        }

        if("getLightOpacity" in this) {
            Block.setLightOpacity(this.id, this.getLightOpacity());
        }

        if("getExplosionResistance" in this) {
            Block.setExplosionResistance(this.id, this.getExplosionResistance());
        }

        if("getMapColor" in this) {
            Block.setMapColor(this.id, this.getMapColor());
        }

        if("getMaterial" in this) {
            ToolAPI.registerBlockMaterial(this.id, this.getMaterial(), this.getDestroyLevel());
        }

        if("getRenderLayer" in this) {
            Block.setRenderLayer(this.id, this.getRenderLayer());
        }

        if("getTranslucency" in this) {
            Block.setTranslucency(this.id, this.getTranslucency());
        }

        if("isSolid" in this) {
            Block.setSolid(this.id, this.isSolid());
        }

        if("getRenderType" in this) {
            Block.setRenderType(this.id, this.getRenderType());
        }

        if("getTileEntity" in this) {
            TileEntity.registerPrototype(this.id, this.getTileEntity() as any);
        }

        if("getCreativeGroup" in this) {
            const group = this.getCreativeGroup();
            Item.addCreativeGroup(group, Translation.translate(group), [this.id]);
        }

        if("getDrop" in this) {
            Block.registerDropFunctionForID(this.id, (coords, id, data, diggingLevel, enchant, item, region) => {
                return this.getDrop(coords, id, data, diggingLevel, enchant, new ItemStack(item), region);
            });
        }

        if("onDestroy" in this) {
            Block.registerDestroyFunctionForID(this.id, (this as IDestroyCallback).onDestroy);
        }

        if("onDestroyContinue" in this) {
            Block.registerDestroyContinueFunctionForID(this.id, (this as IDestroyContinueCallback).onDestroyContinue);
        }

        if("onDestroyStart" in this) {
            Block.registerDestroyStartFunctionForID(this.id, (this as IDestroyStartCallback).onDestroyStart);
        }

        if("onPlace" in this) {
            Block.registerPlaceFunctionForID(this.id, (coords, item, block, player, region) => {
                return (this as unknown as IPlaceCallback).onPlace(coords, new ItemStack(item), block, player, region)
            });
        }

        if("onNeighbourChange" in this) {
            Block.registerNeighbourChangeFunctionForID(this.id, (coords, block, changedCoords, region) => {
                return (this as unknown as INeighbourChangeCallback).onNeighbourChange(coords, block, changedCoords, region);
            });
        }

        if("onEntityInside" in this) {
            Block.registerEntityInsideFunctionForID(this.id, (coords, block, entity) => {
                return (this as unknown as IEntityInsideCallback).onEntityInside(coords, block, entity);
            });
        }

        if("onEntityStepOn" in this) {
            Block.registerEntityStepOnFunctionForID(this.id, (coords, block, entity) => {
                return (this as unknown as IEntityStepOnCallback).onEntityStepOn(coords, block, entity);
            });
        }

        if("onRandomTick" in this) {
            Block.setRandomTickCallback(this.id, (x, y, z, id, data, region) => {
                return (this as unknown as IRandomTickCallback).onRandomTick(x, y, z, id, data, region);
            });
        }

        if("onClick" in this) {
            Block.registerClickFunctionForID(this.id, (coords, item, block, player) => {
                return (this as unknown as IClickCallback).onClick(coords, new ItemStack(item), block, player);
            });
        }

        if("onProjectileHit" in this) {
            Block.registerProjectileHitFunction(this.id, (this as IProjectileHitCallback).onProjectileHit);
        }

        BasicItem.setFunctions(this);
        Block.setDestroyLevel(this.stringID, this.getDestroyLevel());
    }

    public setModel(model: BlockModel | RenderMesh | BlockRenderer.Model | ICRender.Model, data: number): this {
        let render: ICRender.Model = null;
        let mesh: RenderMesh = null;
        let blockModel: BlockRenderer.Model = null;

        if(model instanceof ICRender.Model) {
            render = model;
        } else {
            if(model instanceof BlockRenderer.Model) {
                blockModel = model;
            } else {
                render = new ICRender.Model();
            
                if(model instanceof BlockModel) {
                    mesh = model.getRenderMesh();
                    data = model.getBlockData();
                } else {
                    mesh = model;
                }

                blockModel = new BlockRenderer.Model(mesh);
            }
            render.addEntry(blockModel);
        }
        BlockRenderer.setStaticICRender(this.id, data || -1, render);
        return this;
    }

    public setStates(states: ReturnType<typeof this.getStates>) {
        for(const i in states) {
            const state = states[i];
            if(typeof state == "string") {
                Block.addBlockState && Block.addBlockState(this.id, state);
            } else {
                Block.addBlockStateId && Block.addBlockStateId(this.id, state);
            }
        }
    }

    public getID() {
        return BlockID[this.stringID];
    }

    public getStates(): (string | number)[] {
        return null;
    }

    public getTags(): string[] {
        return null;
    }

    public getDrop?(coords: Callback.ItemUseCoordinates, id: number, data: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemStack, region: BlockSource): ItemInstanceArray[]
    public getDestroyTime?(): number;
    public getSoundType?(): Block.Sound;
    public getFriction?(): number;
    public getLightLevel?(): number;
    public getLightOpacity?(): number;
    public getExplosionResistance?(): number;
    public getMapColor?(): number;
    public getMaterial?(): string;
    public getRenderLayer?(): number;
    public getRenderType?(): number;
    public getTranslucency?(): number;

    public getDestroyLevel(): EDestroyLevel {
        return EDestroyLevel.STONE;
    }

    public getCreativeGroup?(): string;

    public getTileEntity?(): CommonTileEntity;

    public isSolid?(): boolean;

    public static destroyWithTile(x: number, y: number, z: number, blockSource: BlockSource) {
        TileEntity.destroyTileEntityAtCoords(x, y, z, blockSource);
        blockSource.destroyBlock(x, y, z, true);
        return;
    }
}



