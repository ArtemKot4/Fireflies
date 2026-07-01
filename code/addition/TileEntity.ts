namespace TileEntity {
    const TileEntityBasePrototype = {
        remove: false,
        isLoaded: false,
        __initialized: false,
        networkEntityType: null,
        networkEntity: null,
        defaultValues: {},
        _runInit: function() {
            Saver.registerObject(this, this.saverId);
            this.blockSource = this.blockSource || BlockSource.getDefaultForDimension(this.dimension);
            if(!this.blockSource) {
                this.isLoaded = false;
                return false;
            }
            if(!TileEntity.isTileEntityLoaded(this)) {
                this.isLoaded = false;
                return false;
            }
            if(this.useNetworkItemContainer) {
                this.container.setClientContainerTypeName(this.networkEntityType.getTypeName());
                if(this.containerEvents) {
                    const self = this;
                    //@ts-ignore
                    function addContainerEventListener(name, func) {
                        self.container.addServerEventListener(name, function(container, client, packetData) {
                            func.call(self, packetData, client);
                        });
                    }
                    for(const name in this.containerEvents) {
                        addContainerEventListener(name, this.containerEvents[name]);
                    }
                }
            }
            this.networkEntity = new NetworkEntity(this.networkEntityType, this);
            this.networkData.setClients(this.networkEntity.getClients());
            this.init();
            this.load();
            const self = this;
            self.onConnectionPlayer && this.networkEntity.setConnectionPlayerListener(function(client){
                self.onConnectionPlayer(client);
            });
            self.onDisconnectionPlayer && this.networkEntity.setDisconnectionPlayerListener(function(client){
                self.onDisconnectionPlayer(client);
            })
            if(this.__delayedRedstone) {
                for(let i in this.__delayedRedstone) {
                    this.redstone(this.__delayedRedstone[i])
                }
                this.__delayedRedstone = null;
            }
            this.__initialized = true;
            this.noupdate = !this.tick;
            return true;
        },
        update: function(dt) {
            if (this.isLoaded) {
                if (!this.__initialized) {
                    if (!this._runInit()) {
                        this.noupdate = true;
                        return;
                    }
                }
                this.tick && this.tick(dt);
            }
        },
        _to_string: function() {
            return "TileEntity{" + this.networkEntityTypeName + " pos=(" + this.x + ", " + this.y + ", " + this.z + "), dimension=" + this.dimension + "}";
        },
        created: function() {},
        load: function() {},
        unload: function() {},
        init: function() {},
        onCheckerTick: function(isInitialized, isLoaded, wasLoaded) {},
        click: function(id, count, data, coords) {
            return false;
        },
        destroyBlock: function(coords, player) {},
        redstone: function(params) {},
        projectileHit: function(coords, projectile) {},
        destroy: function() {
            return false;
        },
        getGuiScreen: function() {
            return null;
        },
        getScreenByName: function(name, container) {
            return null;
        },
        onItemClick: function(id, count, data, coords, player, extra) {
            if(!this.__initialized) {
                if (!this._runInit()) {
                    return false;
                }
            }
            if(this.click(id, count, data, coords, player, extra)) {
                return true;
            }
            if(Entity.getSneaking(player)) {
                return false;
            }
            if(this.useNetworkItemContainer && this.getScreenName) {
                const screenName = this.getScreenName(player, coords);
                if(screenName) {
                    const client = Network.getClientForPlayer(player);
                    if(client != null) {
                        this.container.openFor(client, screenName);
                        return true;
                    }
                }
            } else {
                const screen = this.getGuiScreen();
                if(screen) {
                    this.container.openAs(screen);
                    return true;
                }
            }
        },
        selfDestroy: function() {
            TileEntity.destroyTileEntity(this);
        },
        //requireMoreLiquid: function(liquid, amount) {},
        sendPacket: function(name, data) {
            this.networkEntity.send(name, data);
        },
        sendResponse: function(name, data) {
            this.networkEntity.respond(name, data);
        }
    };

    export function buildEvents(prototype: TileEntity.TileEntityPrototype): void {
        if("eventNames" in prototype) {
            prototype.events = {};
            prototype.containerEvents = {};

            for(const i in prototype.eventNames.network) {
                const name = prototype.eventNames.network[i];
                prototype.events[name] = prototype[name];
            }
            for(const i in prototype.eventNames.container) {
                const name = prototype.eventNames.container[i];
                prototype.containerEvents[name] = prototype[name];
            }
        }
    }

    export function openFor(client: NetworkClient, tile: TileEntity.TileEntityPrototype & { container: ItemContainer }) {
        if(tile != null) {
            const screenName = tile.getScreenName(client.getPlayerUid(), new Vector3(tile.x, tile.y, tile.z) as unknown as Callback.ItemUseCoordinates);
            if(screenName != null) {
                tile.container.openFor(client, screenName);
            }
        }
    }

    TileEntity.registerPrototype = function(blockID, customPrototype) {
        if(!blockID) {
            Logger.info("ERROR", "TileEntity cannot be registered with invalid numeric ID: " + blockID);
            return false;
        }
        if(blockID in this.tileEntityPrototypes) {
            Logger.info("ERROR", "TileEntity with ID " + IDRegistry.getNameByID(blockID) + " (id=" + blockID + ") was already occupied");
            return false;
        }
        const Prototype = Object.create(customPrototype) as TileEntity.TileEntityPrototype;
        for(const property in TileEntityBasePrototype) {
            Prototype[property] = TileEntityBasePrototype[property];
        }
        for(const property in customPrototype) {
            Prototype[property] = customPrototype[property];
        }
        Prototype.blockID = blockID;
        this.tileEntityPrototypes[blockID] = Prototype;
        const saverName = "tile_entity:" + blockID;
        const entityTypeName = "tile_entity_name:" + IDRegistry.getNameByID(blockID);

        Prototype.saverId = Saver.registerObjectSaver(saverName, {
            read: function(obj: TileEntity) {
                if(!obj || !obj.coords) {
                    return;
                }
                const instance = Object.create(Prototype) as TileEntityPrototype & { update(dt?): void };
                for(const property in Prototype) {
                    instance[property] = Prototype[property];
                }
                instance.data = obj.data;
                instance.x = obj.coords.x || 0;
                instance.y = obj.coords.y || 0;
                instance.z = obj.coords.z || 0;
                instance.dimension = obj.coords.d || 0;
                instance.container = obj.container;
                instance.networkData = new SyncedNetworkData();
                instance.liquidStorage = obj.liquidStorage;
                if(!instance.container) {
                    instance.container = Prototype.useNetworkItemContainer ? new ItemContainer() : new UI.Container();
                }
                if(instance.container.isLegacyContainer()) {
                    if(Prototype.useNetworkItemContainer) {
                        instance.container = new ItemContainer(instance.container);
                    }
                } else {
                    if(!Prototype.useNetworkItemContainer) {
                        instance.container = instance.container.asLegacyContainer();
                    }
                }
                try {
                    instance.container.setParent(instance);
                } catch (e) {}
                if(!instance.liquidStorage) {
                    //@ts-ignore
                    instance.liquidStorage = new LiquidRegistry.Storage();
                }
                instance.liquidStorage.setParent(instance);
                TileEntity.addUpdatableAsTileEntity(instance);
                return instance;
            },
            save: function(obj: TileEntityPrototype) {
                return {
                    data: obj.data,
                    container: obj.container,
                    liquidStorage: obj.liquidStorage,
                    coords: {
                        x: obj.x,
                        y: obj.y,
                        z: obj.z,
                        d: obj.dimension
                    }
                };
            }
        });

        Prototype.networkEntityTypeName = entityTypeName;
        Prototype.networkEntityType = new NetworkEntityType(entityTypeName)
            .setClientListSetupListener(function(list, target: TileEntityPrototype, entity) {
                list.setupDistancePolicy(target.x + .5, target.y + .5, target.z + .5, target.dimension, target.networkVisibilityDistance || 128);
            })
            .setClientEntityAddedListener(function(entity, packet) {
                // create client tile entity from Prototype.client

                let networkData = SyncedNetworkData.getClientSyncedData(packet.sd);
                const client = {
                    x: packet.x,
                    y: packet.y,
                    z: packet.z,
                    dimension: packet.d,
                    networkData: networkData,
                    networkEntity: entity,
                    __initialized: false,
                    noupdate: false,
                    remove: false,
                    update: function(dt) {
                        if (!this.__initialized) {
                            this.__initialized = true;
                            this.load();
                            networkData.fromJSON(packet.data);
                            this.remove = this.remove || !this.tick;
                            if (this.remove) {
                                return;
                            }
                        }
                        this.tick(dt);
                    },
                    load: function() {},
                    unload: function() {},
                    sendPacket: function(name, data) {
                        this.networkEntity.send(name, data);
                    }
                };
                Object.defineProperty(client, "blockData", {
                    configurable: true,
                    enumerable: true,
                    get(this: LocalTileEntityPrototype) {
                        const blockSource = BlockSource.getCurrentClientRegion();
                        if(!blockSource) {
                            return -1;
                        }
                        return blockSource.getBlockData(this.x, this.y, this.z);
                    }
                });

                if(Prototype.client) {
                    for(const name in Prototype.client) {
                        client[name] = Prototype.client[name];
                    }
                }
                //@ts-ignore
                Updatable.addLocalUpdatable(client);
                return client;
            })
            .setClientEntityRemovedListener(function(target, entity) {
                target.unload();
                target.remove = true;
            })
            .setClientAddPacketFactory(function(target, entity, client) {
                return {
                    x: target.x,
                    y: target.y,
                    z: target.z,
                    d: target.dimension,
                    sd: "" + target.networkData.getName(),
                    data: "" + target.networkData.toJSON()
                }
            });
        if(Prototype.events) {
            //@ts-ignore
            function addServerPacketListener(name, func) {
                Prototype.networkEntityType.addServerPacketListener(name, function(target, entity, client, packetData, packetExtra) {
                    func.call(target, packetData, packetExtra, client);
                });
            }
            for(let name in Prototype.events) {
                addServerPacketListener(name, Prototype.events[name]);
            }
        }

        if(Prototype.client && Prototype.client.events) {
            //@ts-ignore
            function addClientPacketListener(name, func) {
                Prototype.networkEntityType.addClientPacketListener(name, function(target, entity, packetData, packetExtra) {
                    func.call(target, packetData, packetExtra);
                });
            }
            for(let name in Prototype.client.events) {
                addClientPacketListener(name, Prototype.client.events[name]);
            }
        }

        ItemContainer.registerScreenFactory(entityTypeName, function(container, name) {
            return Prototype.getScreenByName(name, container)
        });

        if(Prototype.client && Prototype.client.containerEvents) {
            for(const name in Prototype.client.containerEvents) {
                ItemContainer.addClientEventListener(entityTypeName, name, Prototype.client.containerEvents[name]);
            }
        }

        if(customPrototype.redstone) {
            Block.setRedstoneTile(blockID, -1, true);
        }
        return true;
    }

    TileEntity.createTileEntityForPrototype = function(prototype, addToUpdate) {
        const tileEntity = Object.assign(Object.create(prototype), prototype, { data: Object.assign({}, prototype.data, prototype.defaultValues) });
        tileEntity.update = prototype.update;
        Object.defineProperty(tileEntity, "blockData", {
            configurable: true,
            enumerable: true,
            get(this: TileEntity) {
                if(!this.blockSource) {
                    return -1;
                }
                return this.blockSource.getBlockData(this.x, this.y, this.z);
            }
        });
        tileEntity.networkData = new SyncedNetworkData();
        tileEntity.container = prototype.useNetworkItemContainer ? new ItemContainer() : new UI.Container(tileEntity);
        tileEntity.container.setParent(tileEntity);
        tileEntity.liquidStorage = new LiquidRegistry.Storage(tileEntity);
        
        if(addToUpdate) {
            if(tileEntity.saverId && tileEntity.saverId != -1) {
                Saver.registerObject(tileEntity, tileEntity.saverId);
            }
            Updatable.addUpdatable(tileEntity);
            tileEntity.remove = false;
            tileEntity.isLoaded = true;
        }
        return tileEntity;
    }

    interface TileEntityPrototype extends TileEntity.TileEntityPrototype {
        blockData: number;
    }

    interface LocalTileEntityPrototype extends TileEntity.LocalTileEntityPrototype {
        blockData: number;
    }
}