namespace WorldSaves {
    export const defaultData = {
        players: {}
    };

    export let data = {} as { players: Record<number, typeof defaultData.players & Scriptable> } & Scriptable;

    export function addData<T>(name: string, value: T) {
        defaultData[name] = value;
    };

    export function addPlayerData(name: string, value: any) {
        defaultData.players[name] = value;
    };

    Callback.addCallback("ModsLoaded", () => {
        for(const key in defaultData) {
            data[key] = defaultData[key];
        };
    });

    Callback.addCallback("ServerPlayerLoaded", (player) => {
        if(!(player in data.players)) {
            data.players[player] = defaultData.players;
        };

        const client = Network.getClientForPlayer(player);
        if(client) {
            client.send("packet.squid_core.set_player_data", {
                uid: player,
                data: data.players[player]
            });
        };

        for(const key in defaultData) {
            if(!(key in data)) {
                data[key] = defaultData[key];
            };
        };
    });

    Callback.addCallback("LevelLeft", () => {
        for(const key in defaultData) {
            data[key] = defaultData[key];
        };
    });

    Saver.addSavesScope("squid_core.world_saves", 
        function read(scope: {data: typeof data}) {
            WorldSaves.data = scope && scope.data ? scope.data : WorldSaves.data;
        },
        function save() {
            return { data: WorldSaves.data };
        }
    );

    Network.addClientPacket("packet.squid_core.set_player_data", (data: {uid: number, data: typeof defaultData.players}) => {
        WorldSaves.data = WorldSaves.data || {
            players: {}
        };

        WorldSaves.data[data.uid] = data.data;
    });
};