package com.artemkot4.fireflies.biome;

public class Biome {
    public enum Vanilla {
        OCEAN(0),
        PLAINS(1),
        DESERT(2),
        EXTREME_HILLS(3),
        FOREST(4),
        TAIGA(5),
        SWAMPLAND(6),
        RIVER(7),
        HELL(8),
        THE_END(9),
        LEGACY_FROZEN_OCEAN(10),
        ICE_PLAINS(12),
        ICE_MOUNTAINS(13),
        MUSHROOM_ISLAND(14),
        MUSHROOM_ISLAND_SHORE(15),
        BEACH(16),
        DESERT_HILLS(17),
        FOREST_HILLS(18),
        TAIGA_HILLS(19),
        SMALLER_EXTREME_HILLS(20),
        JUNGLE(21),
        JUNGLE_HILLS(22),
        JUNGLE_EDGE(23),
        DEEP_OCEAN(24),
        STONE_BEACH(25),
        COLD_BEACH(26),
        BIRCH_FOREST(27),
        BIRCH_FOREST_HILLS(28),
        ROOFED_FOREST(29),
        COLD_TAIGA(30),
        COLD_TAIGA_HILLS(31),
        REDWOOD_TAIGA(32),
        REDWOOD_TAIGA_HILLS(33),
        EXTREME_HILLS_WITH_TREES(34),
        SAVANNA(35),
        SAVANNA_PLATEAU(36),
        MESA(37),
        MESA_ROCK(38),
        MESA_CLEAR_ROCK(39),
        SUNFLOWER_PLAINS(129),
        DESERT_MUTATED(130),
        EXTREME_HILLS_MUTATED(131),
        FLOWER_FOREST(132),
        TAIGA_MUTATED(133),
        SWAMPLAND_MUTATED(134),
        ICE_PLAINS_SPIKES(140),
        JUNGLE_EDGE_MUTATED(151),
        BIRCH_FOREST_HILLS_MUTATED(156),
        BIRCH_FOREST_MUTATED(155),
        ROOFED_FOREST_MUTATED(157),
        COLD_TAIGA_MUTATED(158),
        JUNGLE_MUTATED(149),
        MESA_BRYCE(165),
        MESA_PLATEAU_STONE_MUTATED(166),
        MESA_PLATEAU_MUTATED(167),
        EXTREME_HILLS_WITH_TREES_MUTATED(162),
        REDWOOD_TAIGA_HILLS_MUTATED(161),
        REDWOOD_TAIGA_MUTATED(160),
        SAVANNA_MUTATED(163),
        SAVANNA_PLATEAU_MUTATED(164);
    
        private final int id;
    
        Vanilla(int id) {
            this.id = id;
        }
    
        public int getId() {
            return id;
        }
    }
}