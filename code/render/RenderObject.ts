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

class RenderObject implements Vector {
    public x: number;
    public y: number;
    public z: number;
    public thread?: java.lang.Thread;
    public animation: Animation.Base;
    public isLoaded: boolean = false;
    public scale?: number;
    public skin?: string;
    protected threadInited?: boolean;

    public constructor(x: number, y: number, z: number) {
        this.animation = new Animation.Base(x, y, z);

        if(this.autoSetPositions() == true) {
            const self = this;
            let _x = x;
            let _y = y;
            let _z = z;
            Object.defineProperties(this, {
                x: {
                    set(v) {
                        self.translateBy(v - _x, 0, 0);
                        _x = v;
                    },
                    get() {
                        return _x;
                    }
                },
                y: {
                    set(v) {
                        self.translateBy(0, v - _y, 0);
                        _y = v;
                    },
                    get() {
                        return _y;
                    },
                },
                z: {
                    set(v) {
                        self.translateBy(0, 0, v - _z);
                        _z = v;
                    },
                    get() {
                        return _z;
                    }
                }
            });
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
        }

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
            describeObject.scale = this.scale;
        }
        if(material != null) {
            describeObject.material = material;
        }
        return describeObject;
    }

    public autoSetPositions(): boolean {
        return false;
    }

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

    public load(): void {
        if(this.isLoaded == true) {
            return;
        }
        this.animation.describe(this.getDescription());
        this.animation.load();
        this.isLoaded = true;
        
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
        this.isLoaded = false;
        this.threadInited = false;
    }

    public rotateBy(x: number, y: number, z: number): com.zhekasmirnov.innercore.api.NativeRenderer.Transform {
        return this.animation.transform && this.animation.transform().rotate(x, y, z);
    }

    public scaleBy(x: number, y: number, z: number): com.zhekasmirnov.innercore.api.NativeRenderer.Transform {
        return this.animation.transform && this.animation.transform().scale(x, y, z);
    }

    public translateBy(x: number, y: number, z: number): com.zhekasmirnov.innercore.api.NativeRenderer.Transform {
        return this.animation.transform && this.animation.transform().translate(x, y, z);
    }

    public exists(): boolean {
        return this.isLoaded;
    }
}