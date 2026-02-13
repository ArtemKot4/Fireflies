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

class WorldRenderObject implements Vector {
    public static objects: {
        [stringID: string]: {
            [uuid: string]: WorldRenderObject
        }
    } = {};
    
    public x: number;
    public y: number;
    public z: number;
    public thread?: java.lang.Thread;
    public animation: Animation.Base;
    public loaded: boolean = false;
    public renderScale?: number;
    public skin?: string;
    public uuid!: string;
    protected threadInited?: boolean;

    public constructor(x: number, y: number, z: number) {
        this.animation = new Animation.Base(x, y, z);
        this.x = x;
        this.y = y;
        this.z = z;
        const lightMode = this.getLightMode();
        if(lightMode != null) {
            switch(lightMode) {
                case "block": {
                    this.animation.setBlocklightMode();
                }
                case "skylight": {
                    this.animation.setSkylightMode();
                }
                case "ignore": {
                    this.animation.setIgnoreLightMode();
                }
            }
        }
        const id = this.getStringID();
        WorldRenderObject.objects[id] ??= {};
    }

    public getDescription(): Animation.description {
        const describeObject: Animation.description = {};
        const render = this.getRender();
        const mesh = this.getRenderMesh();
        const skin = this.getSkin();
        const material = this.getMaterial();

        if(render != null) {
            describeObject.render = render.getId();
        }
        if(mesh != null) {
            describeObject.mesh = mesh;
        }
        if(skin != null) {
            describeObject.skin = skin;
        }
        if("scale" in this) {
            describeObject.scale = this.renderScale;
        }
        if(material != null) {
            describeObject.material = material;
        }
        return describeObject;
    }

    /** Id for thread name if need
     */

    public getStringID(): string {
        return "fireflies.basic";
    }

    public getRenderMesh(): Nullable<RenderMesh> {
        return null;
    }

    public getRender(): Nullable<Render> {
        return null;
    }

    public getSkin(): Nullable<string> {
        return this.skin;
    }

    public getLightMode(): Nullable<"block" | "ignore" | "skylight"> {
        return null;
    }

    public getMaterial(): Nullable<string> {
        return null;
    }

    /**
     * If method defined, thread will be initialized with this method. While cycle already defined and sleep time (from fps).
     */
    public run?(): void;

    /**
     * Loads render object in world and puts it to the storage by id and uuid
     */
    public load(): void {
        if(this.loaded == true) {
            return;
        }
        this.animation.describe(this.getDescription());
        this.animation.load();
        this.loaded = true;
        this.uuid ??= String(java.util.UUID.randomUUID());
        WorldRenderObject.objects[this.getStringID()][this.uuid] = this;
        
        if("run" in this) {
            this.startThread();
        }
        return;
    }

    public refresh(): void {
        this.animation.refresh();
    }

    public startThread(): void {
        const sleepTime = 1000 / this.getFps();

        if(this.thread != null) {
            this.thread.stop();
        }
        this.threadInited = true;
        this.thread = Threading.initThread("thread." + this.getStringID(), () => {
            while(this.threadInited == true) {
                java.lang.Thread.sleep(sleepTime);
                this.run();
            }
        }); 
    }

    public getFps(): number {
        return 50;
    }

    public stop(): void {
        this.threadInited = false;
    }

    public start(): void {
        this.threadInited = true;
    }

    public destroy(): void {
        this.animation.destroy();
        this.loaded = false;
        delete WorldRenderObject.objects[this.getStringID()][this.uuid];
        this.threadInited = false;
    }

    public rotate(x: number, y: number, z: number): Render.Transform {
        return this.animation.transform && this.animation.transform().rotate(x, y, z);
    }

    public scale(x: number, y: number, z: number): Render.Transform {
        return this.animation.transform && this.animation.transform().scale(x, y, z);
    }

    public translate(x: number, y: number, z: number): Render.Transform {
        return this.animation.transform && this.animation.transform().translate(x, y, z);
    }

    public exists(): boolean {
        return this.loaded;
    }

    public static getAllByStringID(stringID: string): Nullable<{ [uuid: string]: WorldRenderObject }> {
        return WorldRenderObject.objects[stringID] || null;
    }

    public static getAllByPositionAndStringID(stringID: string, x: number, y: number, z: number, roundFunc: Function = Math.round): WorldRenderObject[] {
        const list: WorldRenderObject[] = [];
        const group = this.getAllByStringID(stringID) || {};
        for(const i in group) {
            const object = group[i];
            let objX = roundFunc(object.x), objY = roundFunc(object.y), objZ = roundFunc(object.z);
            if(x == objX && y == objY && z == objZ) {
                list.push(object);
            }
        }
        return list;
    }

    public static getAllByPosition(x: number, y: number, z: number, roundFunc: Function = Math.round): WorldRenderObject[] {
        let list: WorldRenderObject[] = [];
        for(const stringID in WorldRenderObject.objects) {
            list = list.concat(this.getAllByPositionAndStringID(stringID, x, y, z, roundFunc));
        }
        return list;
    }

    @SubscribeEvent
    public static onLevelLeft() {
        WorldRenderObject.objects = {};
    }
}