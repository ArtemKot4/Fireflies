/**
 * Enum with names of all callbacks
 */
enum ECallback {
    CRAFT_RECIPE_PRE_PROVIDED = "CraftRecipePreProvided",
    CRAFT_RECIPE_PROVIDED_FUNCTION = "CraftRecipeProvidedFunction",
    VANILLA_WORKBENCH_CRAFT = "VanillaWorkbenchCraft",
    VANILLA_WORKBENCH_POST_CRAFT = "VanillaWorkbenchPostCraft",
    VANILLA_WORKBENCH_RECIPE_SELECTED = "VanillaWorkbenchRecipeSelected",
    CONTAINER_CLOSED = "ContainerClosed",
    CONTAINER_OPENED = "ContainerOpened",
    CUSTOM_WINDOW_OPENED = "CustomWindowOpened",
    CUSTOM_WINDOW_CLOSED = "CustomWindowClosed",
    CORE_CONFIGURED = "CoreConfigured",
    PRE_LOADED = "PreLoaded",
    API_LOADED = "APILoaded",
    MODS_LOADED = "ModsLoaded",
    POST_LOADED = "PostLoaded",
    PRE_BLOCKS_DEFINED = "PreBlocksDefined",
    BLOCKS_DEFINED = "BlocksDefined",
    ADD_RUNTIME_PACKS = "AddRuntimePacks",
    LEVEL_SELECTED = "LevelSelected",
    DIMENSION_LOADED = "DimensionLoaded",
    DESTROY_BLOCK_END = "DestroyBlock",
    DESTROY_BLOCK_START = "DestroyBlockStart",
    DESTROY_BLOCK_CONTINUE = "DestroyBlockContinue",
    BUILD_BLOCK = "BuildBlock",
    BLOCK_CHANGED = "BlockChanged",
    BREAK_BLOCK = "BreakBlock",
    ITEM_USE = "ItemUse",
    ITEM_USE_LOCAL_SERVER = "ItemUseLocalServer",
    EXPLOSION = "Explosion",
    FOOD_EATEN = "FoodEaten",
    EXP_ADD = "ExpAdd",
    EXP_LEVEL_ADD = "ExpLevelAdd",
    NATIVE_COMMAND = "NativeCommand",
    PLAYER_ATTACK = "PlayerAttack",
    ENTITY_ADDED = "EntityAdded",
    ENTITY_REMOVED = "EntityRemoved",
    ENTITY_ADDED_LOCAL = "EntityAddedLocal",
    ENTITY_REMOVED_LOCAL = "EntityRemovedLocal",
    ENTITY_DEATH = "EntityDeath",
    ENTITY_HURT = "EntityHurt",
    ENTITY_INTERACT = "EntityInteract",
    EXP_ORBS_SPAWNED = "ExpOrbsSpawned",
    PROJECTILE_HIT = "ProjectileHit",
    REDSTONE_SIGNAL = "RedstoneSignal",
    POP_BLOCK_RESOURCES = "PopBlockResources",
    ITEM_ICON_OVERRIDE = "ItemIconOverride",
    ITEM_NAME_OVERRIDE = "ItemNameOverride",
    ITEM_USE_NO_TARGET = "ItemUseNoTarget",
    ITEM_USING_RELEASED = "ItemUsingReleased",
    ITEM_USING_COMPLETE = "ItemUsingComplete",
    ITEM_DISPENSED = "ItemDispensed",
    NATIVE_GUI_CHANGED = "NativeGuiChanged",
    ENCHANT_POST_ATTACK = "EnchantPostAttack",
    ENCHANT_GET_PROTECTION_BONUS = "EnchantGetProtectionBonus",
    ENCHANT_GET_DAMAGE_BONUS = "EnchantGetDamageBonus",
    ENCHANT_POST_HURT = "EnchantPostHurt",
    GENERATE_CHUNK = "GenerateChunk",
    GENERATE_CHUNK_UNDERGROUND = "GenerateChunkUnderground",
    GENERATE_NETHER_CHUNK = "GenerateNetherChunk",
    GENERATE_END_CHUNK = "GenerateEndChunk",
    GENERATE_CHUNK_UNIVERSAL = "GenerateChunkUniversal",
    GENERATE_BIOME_MAP = "GenerateBiomeMap",
    PRE_PROCESS_CHUNK = "PreProcessChunk",
    POST_PROCESS_CHUNK = "PostProcessChunk",
    READ_SAVES = "ReadSaves",
    WRITE_SAVES = "WriteSaves",
    CUSTOM_BLOCK_TESSELLATION = "CustomBlockTessellation",
    LOCAL_PLAYER_TICK = "LocalPlayerTick",
    SERVER_PLAYER_TICK = "ServerPlayerTick",
    CUSTOM_DIMENSION_TRANSFER = "CustomDimensionTransfer",
    BLOCK_EVENT_ENTITY_INSIDE = "BlockEventEntityInside",
    BLOCK_EVENT_ENTITY_STEP_ON = "BlockEventEntityStepOn",
    BLOCK_EVENT_NEIGHBOUR_CHANGE = "BlockEventNeighbourChange",
    CONNECTING_TO_HOST = "ConnectingToHost",
    DIMENSION_UNLOADED = "DimensionUnloaded",
    LEVEL_PRE_LEFT = "LevelPreLeft",
    GAME_LEFT = "GameLeft",
    LEVEL_LEFT = "LevelLeft",
    LOCAL_LEVEL_LEFT = "LocalLevelLeft",
    LOCAL_LEVEL_PRE_LEFT = "LocalLevelPreLeft",
    SERVER_LEVEL_LEFT = "ServerLevelLeft",
    SERVER_LEVEL_PRE_LEFT = "ServerLevelPreLeft",
    ITEM_USE_LOCAL = "ItemUseLocal",
    SYSTEM_KEY_EVENT_DISPATCHED = "SystemKeyEventDispatched",
    NAVIGATION_BACK_PRESSED = "NavigationBackPressed",
    LEVEL_CREATED = "LevelCreated",
    LEVEL_DISPLAYED = "LevelDisplayed",
    LEVEL_PRE_LOADED = "LevelPreLoaded",
    LEVEL_LOADED = "LevelLoaded",
    LOCAL_LEVEL_LOADED = "LocalLevelLoaded",
    REMOTE_LEVEL_LOADED = "RemoteLevelLoaded",
    REMOTE_LEVEL_PRE_LOADED = "RemoteLevelPreLoaded",
    SERVER_LEVEL_LOADED = "ServerLevelLoaded",
    SERVER_LEVEL_PRE_LOADED = "ServerLevelPreLoaded",
    TICK = "tick",
    LOCAL_TICK = "LocalTick",
    APP_SUSPENDED = "AppSuspended",
    ENTITY_PICK_UP_DROP = "EntityPickUpDrop",
    LOCAL_PLAYER_LOADED = "LocalPlayerLoaded",
    SERVER_PLAYER_LOADED = "ServerPlayerLoaded",
    SERVER_PLAYER_LEFT = "ServerPlayerLeft",
    LOCAL_PLAYER_CHANGED_DIMENSION = "LocalPlayerChangedDimension",
    PLAYER_CHANGED_DIMENSION = "PlayerChangedDimension",
    LOCAL_PLAYER_EAT = "LocalPlayerEat",
    SERVER_PLAYER_EAT = "ServerPlayerEat",
    GENERATE_CUSTOM_DIMENSION_CHUNK = "GenerateCustomDimensionChunk",
    TILE_ENTITY_ADDED = "TileEntityAdded",
    TILE_ENTITY_REMOVED = "TileEntityRemoved",
    /**
     * Custom callback. Works in one time of 8 ticks, if player held the item.
     */
    ITEM_HOLD = "ItemHold",
    BLOCK_SELECTION = "BlockSelection"
};

declare namespace Callback {
    /** 
     * Function used in "ItemHold" callback. Callback works one time of 8 ticks.
     * @since 0.1a  
     * @param item ItemInstance of held item
     * @param playerUid unique identifier of holder player
     */

    export interface ItemHoldFunction {
        (item: ItemInstance, playerUid: number, slotIndex: number): void;
    }

    export interface BlockSelectionFunction {
        (block: Tile, position: BlockPosition, vector: Vector);
    }

    export interface EntitySelectionFunction {
        (entityUid: number, vector: Vector);
    }

    export function addCallback(name: "ItemHold", func: ItemHoldFunction, priority?: number): void;
    export function addCallback(name: "BlockSelection", func: BlockSelectionFunction, priority?: number): void
    export function addCallback(name: "EntitySelection", func: EntitySelectionFunction, priority?: number);
}