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

    };
};

namespace ServerCommands {
    export const PLAYER_DATA = new PlayerDataCommand();
};
