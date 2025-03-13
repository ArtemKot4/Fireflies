interface IPlayerDataCommand extends ICommandParams {
    key: string;
};

class PlayerDataCommand extends ServerCommand<IPlayerDataCommand> {
    public constructor() {
        super("core_engine:player_data", {
            "key": "string"
        }, 0);
    };

    public override onServer(client: NetworkClient, data: IPlayerDataCommand) {
        const playerData = WorldSaves.data.players[Player.getLocal()];

        if('key' in data) {
            if(data.key === "clear" && new PlayerActor(client.getPlayerUid()).isOperator()) {
                WorldSaves.data.players = WorldSaves.defaultData.players;
                return;
            };

            if(data.key in playerData) {
                Game.message(Native.Color.GREEN + Translation.translate("squid_core.command.player_data_key") + playerData[data.key]);
            } else {
                Game.message(Native.Color.RED + Translation.translate("squid_core.command.player_data_key_not_exists"));
            };
            return;
        };

        Game.message(Native.Color.GREEN + Translation.translate("squid_core.command.all_player_data") + "\n");

        for(const key in playerData) {
            Game.message(Native.Color.GREEN + key + " -> " + Native.Color.GRAY + JSON.stringify(playerData[key]) + "\n")
        };
    };
};

namespace ServerCommands {
    export const PLAYER_DATA = new PlayerDataCommand();
};

Notification.get("achievement").addStyle("transparent", ENotificationStyle.TRANSPARENT);
Notification.get("transparent").addStyle("transparent", ENotificationStyle.TRANSPARENT);