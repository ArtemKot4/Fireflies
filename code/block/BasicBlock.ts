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

    public static build(blockPrototype: BasicBlock): void {
        if(blockPrototype.canRotate() == true) {
            blockPrototype.variationList.map((v) => {
                if(v.texture.length < 6) {
                    for(let i = v.texture.length; i < 6; i++) {
                        v.texture.push(v.texture[v.texture.length - 1]);
                    }
                }
                return v;
            });
            Block.createBlockWithRotation(blockPrototype.stringID, blockPrototype.variationList);
        } else {
            Block.createBlock(blockPrototype.stringID, blockPrototype.variationList);
        }
        const tags = blockPrototype.getTags();
        if(tags != null) {
            TagRegistry.addCommonObject("blocks", blockPrototype.id, tags);
        }

        const states = blockPrototype.getStates();
        if(states != null) {
            BasicBlock.setStates(blockPrototype.id, states);
        }
        if("getModel" in blockPrototype) {
            const modelList: BlockModel[] = [].concat((blockPrototype as IBlockModel).getModel());

            if(modelList.length == 1) {
                BasicBlock.setModel(blockPrototype.id, -1, modelList[0]);
            } else {
                for (let i = 0; i < modelList.length; i++) {
                    const model = modelList[i];
                    const data: number = model instanceof BlockModel ? model.getBlockData() : i;
                    BasicBlock.setModel(blockPrototype.id, data, model);
                }
            }
        }
        if("getDestroyTime" in blockPrototype) {
            Block.setDestroyTime(blockPrototype.id, blockPrototype.getDestroyTime());
        }

        if("getSoundType" in blockPrototype) {
            Block.setSoundType(blockPrototype.id, blockPrototype.getSoundType());
        }

        if("getFriction" in blockPrototype) {
            Block.setFriction(blockPrototype.id, blockPrototype.getFriction());
        }

        if("getLightLevel" in blockPrototype) {
            Block.setLightLevel(blockPrototype.id, blockPrototype.getLightLevel());
        }

        if("getLightOpacity" in blockPrototype) {
            Block.setLightOpacity(blockPrototype.id, blockPrototype.getLightOpacity());
        }

        if("getExplosionResistance" in blockPrototype) {
            Block.setExplosionResistance(blockPrototype.id, blockPrototype.getExplosionResistance());
        }

        if("getMapColor" in blockPrototype) {
            Block.setMapColor(blockPrototype.id, blockPrototype.getMapColor());
        }

        if("getMaterial" in blockPrototype) {
            ToolAPI.registerBlockMaterial(blockPrototype.id, blockPrototype.getMaterial(), blockPrototype.getDestroyLevel());
        }

        if("getRenderLayer" in blockPrototype) {
            Block.setRenderLayer(blockPrototype.id, blockPrototype.getRenderLayer());
        }

        if("getTranslucency" in blockPrototype) {
            Block.setTranslucency(blockPrototype.id, blockPrototype.getTranslucency());
        }

        if("isSolid" in blockPrototype) {
            Block.setSolid(blockPrototype.id, blockPrototype.isSolid());
        }

        if("getRenderType" in blockPrototype) {
            Block.setRenderType(blockPrototype.id, blockPrototype.getRenderType());
        }

        if("getTileEntity" in blockPrototype) {
            TileEntity.registerPrototype(blockPrototype.id, blockPrototype.getTileEntity() as any);
        }

        if("getCreativeGroup" in blockPrototype) {
            const group = blockPrototype.getCreativeGroup();
            Item.addCreativeGroup(group, group, [blockPrototype.id]);
        }

        if("getDrop" in blockPrototype) {
            Block.registerDropFunctionForID(blockPrototype.id, (coords, id, data, diggingLevel, enchant, item, region) => {
                return blockPrototype.getDrop(coords, id, data, diggingLevel, enchant, new ItemStack(item), region);
            });
        }

        if("onDestroy" in blockPrototype) {
            Block.registerDestroyFunctionForID(blockPrototype.id, (blockPrototype as IDestroyCallback).onDestroy.bind(blockPrototype));
        }

        if("onDestroyContinue" in blockPrototype) {
            Block.registerDestroyContinueFunctionForID(blockPrototype.id, (blockPrototype as IDestroyContinueCallback).onDestroyContinue.bind(blockPrototype));
        }

        if("onDestroyStart" in blockPrototype) {
            Block.registerDestroyStartFunctionForID(blockPrototype.id, (blockPrototype as IDestroyStartCallback).onDestroyStart.bind(blockPrototype));
        }

        if("onPlace" in blockPrototype) {
            Block.registerPlaceFunctionForID(blockPrototype.id, (coords, item, block, player, region) => {
                return (blockPrototype as unknown as IPlaceCallback).onPlace(coords, new ItemStack(item), block, player, region)
            });
        }

        if("onNeighbourChange" in blockPrototype) {
            Block.registerNeighbourChangeFunctionForID(blockPrototype.id, (coords, block, changedCoords, region) => {
                return (blockPrototype as unknown as INeighbourChangeCallback).onNeighbourChange(coords, block, changedCoords, region);
            });
        }

        if("onEntityInside" in blockPrototype) {
            Block.registerEntityInsideFunctionForID(blockPrototype.id, (coords, block, entity) => {
                return (blockPrototype as unknown as IEntityInsideCallback).onEntityInside(coords, block, entity);
            });
        }

        if("onEntityStepOn" in blockPrototype) {
            Block.registerEntityStepOnFunctionForID(blockPrototype.id, (coords, block, entity) => {
                return (blockPrototype as unknown as IEntityStepOnCallback).onEntityStepOn(coords, block, entity);
            });
        }

        if("onRandomTick" in blockPrototype) {
            Block.setRandomTickCallback(blockPrototype.id, (x, y, z, id, data, region) => {
                return (blockPrototype as unknown as IRandomTickCallback).onRandomTick(x, y, z, id, data, region);
            });
        }

        if("onClick" in blockPrototype) {
            Block.registerClickFunctionForID(blockPrototype.id, (coords, item, block, player) => {
                return (blockPrototype as unknown as IClickCallback).onClick(coords, new ItemStack(item), block, player);
            });
        }

        if("onProjectileHit" in blockPrototype) {
            Block.registerProjectileHitFunction(blockPrototype.id, (blockPrototype as IProjectileHitCallback).onProjectileHit.bind(blockPrototype));
        }

        if("onSelection" in blockPrototype) {
            Block.registerSelectionFunctionForID(blockPrototype.id, (blockPrototype as IBlockSelectionCallback).onSelection.bind(blockPrototype));
        }
        BasicItem.setFunctions(blockPrototype);
        Block.setDestroyLevel(blockPrototype.stringID, blockPrototype.getDestroyLevel());
    }

    // public static destroyWithTile(x: number, y: number, z: number, blockSource: BlockSource) {
    //     TileEntity.destroyTileEntityAtCoords(x, y, z, blockSource);
    //     blockSource.destroyBlock(x, y, z, true);
    //     return;
    // }
}



