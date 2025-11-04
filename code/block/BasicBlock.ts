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

interface IBlockSelectionCallback {
    /**
     * Method, adds client event for block selection of player 
     * @param block block id and data
     * @param position position of block
     * @param vector look vector of player
     */
    onSelection(block: Tile, position: BlockPosition, vector: Vector): void;
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

        BasicBlock.build(this);
    }

    /**
     * Method declares, can block place rotated by data or not
     */
    public canRotate(): boolean {
        return false;
    }

    /**
     * Method must list of blockstates which will be registered to block
     */

    public getStates(): (string | number)[] {
        return null;
    }

    /**
     * Method must return tags which will be added to block
     */

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
    
    public static setStates(id: number, states: ReturnType<typeof BasicBlock.prototype.getStates>): void {
        for(const i in states) {
            const state = states[i];
            if(typeof state == "string") {
                Block.addBlockState && Block.addBlockState(id, state);
            } else {
                Block.addBlockStateId && Block.addBlockStateId(id, state);
            }
        }
    }

    public static setModel(id: number, data: number, model: BlockModel | RenderMesh | BlockRenderer.Model | ICRender.Model): void {
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
        BlockRenderer.setStaticICRender(id, data || -1, render);
    }

    public static build(block: BasicBlock): void {
        if(block.canRotate() == true) {
            block.variationList.map((v) => {
                if(v.texture.length < 6) {
                    for(let i = v.texture.length; i < 6; i++) {
                        v.texture.push(v.texture[v.texture.length - 1]);
                    };
                };
                return v;
            });
            Block.createBlockWithRotation(block.stringID, block.variationList);
        } else {
            Block.createBlock(block.stringID, block.variationList);
        }
        const tags = block.getTags();
        if(tags != null) {
            TagRegistry.addCommonObject("blocks", block.id, tags);
        }

        const states = block.getStates();
        if(states != null) {
            BasicBlock.setStates(block.id, states);
        }
        if("getModel" in block) {
            const modelList: BlockModel[] = [].concat((block as IBlockModel).getModel());

            if(modelList.length === 1) {
                BasicBlock.setModel(block.id, -1, modelList[0]);
            } else {
                for (let i: number = 0; i < modelList.length; i++) {
                    const model = modelList[i];

                    const data: number = model instanceof BlockModel ? model.getBlockData() : i;
                    BasicBlock.setModel(block.id, data, model);
                }
            }
        }
        if("getDestroyTime" in block) {
            Block.setDestroyTime(block.id, block.getDestroyTime());
        }

        if("getSoundType" in block) {
            Block.setSoundType(block.id, block.getSoundType());
        }

        if("getFriction" in block) {
            Block.setFriction(block.id, block.getFriction());
        }

        if("getLightLevel" in block) {
            Block.setLightLevel(block.id, block.getLightLevel());
        }

        if("getLightOpacity" in block) {
            Block.setLightOpacity(block.id, block.getLightOpacity());
        }

        if("getExplosionResistance" in block) {
            Block.setExplosionResistance(block.id, block.getExplosionResistance());
        }

        if("getMapColor" in block) {
            Block.setMapColor(block.id, block.getMapColor());
        }

        if("getMaterial" in block) {
            ToolAPI.registerBlockMaterial(block.id, block.getMaterial(), block.getDestroyLevel());
        }

        if("getRenderLayer" in block) {
            Block.setRenderLayer(block.id, block.getRenderLayer());
        }

        if("getTranslucency" in block) {
            Block.setTranslucency(block.id, block.getTranslucency());
        }

        if("isSolid" in block) {
            Block.setSolid(block.id, block.isSolid());
        }

        if("getRenderType" in block) {
            Block.setRenderType(block.id, block.getRenderType());
        }

        if("getTileEntity" in block) {
            TileEntity.registerPrototype(block.id, block.getTileEntity() as any);
        }

        if("getCreativeGroup" in block) {
            const group = block.getCreativeGroup();
            Item.addCreativeGroup(group, group, [block.id]);
        }

        if("getDrop" in block) {
            Block.registerDropFunctionForID(block.id, (coords, id, data, diggingLevel, enchant, item, region) => {
                return block.getDrop(coords, id, data, diggingLevel, enchant, new ItemStack(item), region);
            });
        }

        if("onDestroy" in block) {
            Block.registerDestroyFunctionForID(block.id, (block as IDestroyCallback).onDestroy.bind(block));
        }

        if("onDestroyContinue" in block) {
            Block.registerDestroyContinueFunctionForID(block.id, (block as IDestroyContinueCallback).onDestroyContinue.bind(block));
        }

        if("onDestroyStart" in block) {
            Block.registerDestroyStartFunctionForID(block.id, (block as IDestroyStartCallback).onDestroyStart.bind(block));
        }

        if("onPlace" in block) {
            Block.registerPlaceFunctionForID(block.id, (coords, item, block, player, region) => {
                return (block as unknown as IPlaceCallback).onPlace(coords, new ItemStack(item), block, player, region)
            });
        }

        if("onNeighbourChange" in block) {
            Block.registerNeighbourChangeFunctionForID(block.id, (coords, block, changedCoords, region) => {
                return (block as unknown as INeighbourChangeCallback).onNeighbourChange(coords, block, changedCoords, region);
            });
        }

        if("onEntityInside" in block) {
            Block.registerEntityInsideFunctionForID(block.id, (coords, block, entity) => {
                return (block as unknown as IEntityInsideCallback).onEntityInside(coords, block, entity);
            });
        }

        if("onEntityStepOn" in block) {
            Block.registerEntityStepOnFunctionForID(block.id, (coords, block, entity) => {
                return (block as unknown as IEntityStepOnCallback).onEntityStepOn(coords, block, entity);
            });
        }

        if("onRandomTick" in block) {
            Block.setRandomTickCallback(block.id, (x, y, z, id, data, region) => {
                return (block as unknown as IRandomTickCallback).onRandomTick(x, y, z, id, data, region);
            });
        }

        if("onClick" in block) {
            Block.registerClickFunctionForID(block.id, (coords, item, block, player) => {
                return (block as unknown as IClickCallback).onClick(coords, new ItemStack(item), block, player);
            });
        }

        if("onProjectileHit" in block) {
            Block.registerProjectileHitFunction(block.id, (block as IProjectileHitCallback).onProjectileHit.bind(block));
        }

        if("onSelection" in block) {
            Block.registerSelectionFunctionForID(block.id, (block as IBlockSelectionCallback).onSelection.bind(block));
        }

        BasicItem.setFunctions(block);
        Block.setDestroyLevel(block.stringID, block.getDestroyLevel());
    }

    // public static destroyWithTile(x: number, y: number, z: number, blockSource: BlockSource) {
    //     TileEntity.destroyTileEntityAtCoords(x, y, z, blockSource);
    //     blockSource.destroyBlock(x, y, z, true);
    //     return;
    // }
}



