interface IPlayerDataCommand {
    key: string;
};

class PlayerDataCommand extends ClientCommand<IPlayerDataCommand> {
    public constructor() {
        super("player_data", {
            "key": "string"
        }, 0);
    };

    public override onCall(data: IPlayerDataCommand) {
        const playerData = WorldSaves.data.players[Player.getLocal()];

        if('key' in data) {
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

namespace ClientCommands {
    export const PLAYER_DATA = new PlayerDataCommand();
};

Translation.addTranslation("squid_core.command.player_data_key_not_exists", {
    en: "Player data key not exists",
    ru: "Такого ключа не существует"
});

Translation.addTranslation("squid_core.command.player_data_key", {
    en: "Key data: ",
    ru: "Данные ключа: "
});

Translation.addTranslation("squid_core.command.all_player_data", {
    en: "All player data: ",
    ru: "Все данные игрока: "
});