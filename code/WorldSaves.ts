namespace WorldSaves {
    export const defaultData = {
        players: {}
    };

    export let data = {} as { players: Record<number, typeof defaultData.players & Scriptable> } & Scriptable;
};

Callback.addCallback("ModsLoaded", () => {
    for(const key in WorldSaves.defaultData) {
        WorldSaves.data[key] = WorldSaves.defaultData[key];
    };
});

Callback.addCallback("ServerPlayerLoaded", (player) => {
    if(!(player in WorldSaves.data.players)) {
        WorldSaves.data.players[player] = WorldSaves.defaultData.players;
    };

    const client = Network.getClientForPlayer(player);
    if(client) {
        client.send("packet.squid_core.set_player_data", {
            uid: player,
            data: WorldSaves.data.players[player]
        });
    };

    for(const key in WorldSaves.defaultData) {
        if(!(key in WorldSaves.data)) {
            WorldSaves.data[key] = WorldSaves.defaultData[key];
        };
    };
});

Callback.addCallback("LevelLeft", () => {
    for(const key in WorldSaves.defaultData) {
        WorldSaves.data[key] = WorldSaves.defaultData[key];
    };
});

Saver.addSavesScope("squid_core.world_saves", 
    function read(scope: {data: typeof WorldSaves.data}) {
        WorldSaves.data = scope && scope.data ? scope.data : WorldSaves.data;
    },
    function save() {
        return { data: WorldSaves.data };
    }
);

Network.addClientPacket("packet.squid_core.set_player_data", (data: {uid: number, data: typeof WorldSaves.defaultData.players}) => {
    WorldSaves.data = WorldSaves.data || {
        players: {}
    };

    WorldSaves.data[data.uid] = data.data;
});