package com.artemkot4.coffee_cup.ui;

public enum EScreenName {
    IN_GAME_PLAY_SCREEN("in_game_play_screen"),
    WORLD_LOADING_PROGRESS_SCREEN("world_loading_progress_screen"),
    ENDER_CHEST_SCREEN("ender_chest_screen"),
    FURNACE_SCREEN("furnace_screen"),
    SMALL_CHEST_SCREEN("small_chest_screen"),
    CREATIVE_INVENTORY_SCREEN("creative_inventory_screen"),
    SURVIVAL_INVENTORY_SCREEN("survival_inventory_screen"),
    INVENTORY_SCREEN("inventory_screen"),
    INVENTORY_SCREEN_POCKET("inventory_screen_pocket");

    private final String screenName;

    EScreenName(String screenName) {
        this.screenName = screenName;
    }

    public static EScreenName fromString(String name) {
        if (name != null && !name.isEmpty()) {
            for (EScreenName value : values()) {
                if (value.screenName.equals(name)) {
                    return value;
                }
            }
        }
        throw new IllegalArgumentException("Unknown screen name: " + name);
    }

    public String getScreenName() {
        return screenName;
    }
}
