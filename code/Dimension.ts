interface CustomGeneratorDescription {
    base?: string | number;
    buildVanillaSurfaces?: boolean;
    generateVanillaStructures?: boolean;
    modWorldgenDimension?: string | number;
    type?: string;
    biome?: number;
    layers?: Dimensions.TerrainLayerParams[];
}

abstract class Dimension {
    public static generateChunkFunctions: Record<number, (chunkX: number, chunkZ: number, random: java.util.Random) => void> = {};
    public static insideTransferFunctions: Record<number, typeof Dimension.prototype.onInsideEntityTransfer> = {};
    public static outsideTransferFunctions: Record<number, typeof Dimension.prototype.onOutsideEntityTransfer> = {};

    public dimension: Dimensions.CustomDimension;
    public biome: CustomBiome;
    public layers: Dimensions.TerrainLayerParams[] = [];
    
    public hasSkyLight?: boolean;
    public hasBedrockLayer?: boolean;
    public hasMoon?: boolean;
    public hasSun?: boolean;
    public hasVanillaWeather?: boolean;
    public hasStars?: boolean;
    public hasClouds?: boolean;
    public canEvaporatesLiquids?: boolean;
    
    public constructor(public id: number, public stringId: string, biome?: CustomBiome) {
        this.dimension = new Dimensions.CustomDimension(stringId, id);
        this.biome = biome || new CustomBiome(stringId + "_biome");

        if("getLayers" in this) {
            this.layers = this.getLayers();
        }

        const tags = this.getTags();
        if(tags != null) {
            TagRegistry.addCommonObject("dimensions", this.id, tags);
        }
        this.dimension.setGenerator(this.getGenerator());

        if("getSkyColor" in this) {
            const skyColor = this.getSkyColor();
            this.dimension.setSkyColor(skyColor[0], skyColor[1], skyColor[2]);
        }
        if("getFogColor" in this) {
            const fogColor = this.getFogColor();
            this.dimension.setFogColor(fogColor[0], fogColor[1], fogColor[2]);
        }
        if("getCloudColor" in this) {
            const cloudColor = this.getCloudColor();
            this.dimension.setCloudColor(cloudColor[0], cloudColor[1], cloudColor[2]);
        }
        if("getSunsetColor" in this) {
            const sunsetColor = this.getSunsetColor();
            this.dimension.setSunsetColor(sunsetColor[0], sunsetColor[1], sunsetColor[2]);
        }
        if("getFogDistance" in this) {
            const fogDistance = this.getFogDistance();
            this.dimension.setFogDistance(fogDistance[0], fogDistance[1]);
        }
        if("hasSkyLight" in this) {
            this.dimension.setHasSkyLight(this.hasSkyLight);
        }

        if(this.getSkyAtmosphereEnabled()) {
            if("hasMoon" in this) {
                Dimensions.setShouldRenderMoon(this.dimension.id, this.hasMoon);
            }
            if("hasSun" in this) {
                Dimensions.setShouldRenderSun(this.dimension.id, this.hasSun);
            }
            if("hasStars" in this) {
                Dimensions.setShouldRenderStars(this.dimension.id, this.hasStars);
            }
            if("hasClouds" in this) {
                Dimensions.setShouldRenderClouds(this.dimension.id, this.hasClouds);
            }
            if("getStarBrightness" in this) {
                this.dimension.setStarBrightness(this.getStarBrightness())
            }
        } else this.dimension.setSkyAtmosphereEnabled(false);
        
        if("hasVanillaWeather" in this) {
            Dimensions.setWeatherSeasons(this.dimension.id, this.hasVanillaWeather);
        }
        if("getDayTimeInterval" in this) {
            this.dimension.setTimeOfDay(this.getDayTimeInterval());
        }
        if("canEvaporatesLiquids" in this) {
            this.dimension.setEvaporatesLiquids(this.canEvaporatesLiquids);
        }

        if("generateDimensionChunk" in this) {
            Dimension.generateChunkFunctions[this.id] = this.generateDimensionChunk;
        }
        if("insidePlayerDimensionTransfer" in this) {
            Dimension.insideTransferFunctions[this.id] = this.onInsideEntityTransfer;
        }
        if("outsidePlayerDimensionTransfer" in this) {
            Dimension.outsideTransferFunctions[this.id] = this.onOutsideEntityTransfer;
        }
    }
    
    public addLayer(layer: Dimensions.TerrainLayerParams): void {
        this.layers.push(layer);
        this.dimension.setGenerator(this.getGenerator());
    }

    public getLayers?(): Dimensions.TerrainLayerParams[];

    public getSkyAtmosphereEnabled(): boolean {
        return true;
    }
    
    public getGenerator(): Dimensions.CustomGenerator {
        const object = {
            biome: this.biome.id,
            layers: this.hasBedrockLayer ? 
            this.layers.concat({
                minY: 0,
                maxY: 1,
                yConversion: [[0.7, 1]],
                material: { base: VanillaBlockID.bedrock },
            }) : this.layers
        } as CustomGeneratorDescription;

        if("getBase" in this) {
            object.base = this.getBase();
        }
        if("modWorldgenDimension" in this) {
            object.modWorldgenDimension = this.modWorldgenDimension();
        }
        if("getType" in this) {
            object.type = this.getType();
        }
        object.generateVanillaStructures = this.generateVanillaStructures();
        object.buildVanillaSurfaces = this.buildVanillaSurfaces();
        const generator = Dimensions.newGenerator(object);
        const generateCaves = this.generateCaves(); 
        generator.setGenerateCaves(generateCaves[0], generateCaves[1]);

        return Dimensions.newGenerator(object);
    }

    public getTags(): string[] {
        return null;
    }

    /**
     * Number between 0 and 1
     */
    public getDayTimeInterval?(): number;

    /**Specifies base generator, see CustomGenerator constructor for details. */
    public getBase?(): string | number;

    public modWorldgenDimension?(): string | number;
    
    public getType?(): string;

    public buildVanillaSurfaces(): boolean {
        return false;
    }

    public generateCaves(): [caves: boolean, underwater_caves: boolean] {
        return [false, false];
    }

    public generateVanillaStructures(): boolean {
        return false;
    }

    /** Method places colors in rgb format */
    public getSkyColor?(): number[];
    /** Method places colors in rgb format */
    public getFogColor?(): number[];
    /** Method places colors in rgb format */
    public getCloudColor?(): number[];
    /** Method places colors in rgb format */
    public getFogDistance?(): [start: number, end: number];
    /** Method places colors in rgb format */
    public getSunsetColor?(): number[];
    
    /**
     * Number between 0 and 1
     */
    public getStarBrightness?(): number;
    public generateDimensionChunk?(chunkX: number, chunkZ: number, random: java.util.Random): void;
    public onInsideEntityTransfer?(entityUid: number, from: number): void;
    public onOutsideEntityTransfer?(entityUid: number, to: number): void;
}

Callback.addCallback("CustomDimensionTransfer", (entityUid, from, to) => {
    if(to in Dimension.insideTransferFunctions) {
        Dimension.insideTransferFunctions[to](entityUid, from);
    }

    if(from in Dimension.outsideTransferFunctions) {
        Dimension.outsideTransferFunctions[from](entityUid, to);
    }
});

Callback.addCallback("GenerateCustomDimensionChunk", (chunkX, chunkZ, random, dimensionId) => {
    if(dimensionId in Dimension.generateChunkFunctions) {
        return Dimension.generateChunkFunctions[dimensionId](chunkX, chunkZ, random);
    }
});
