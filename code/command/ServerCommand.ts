/**
 * Class to create your server & client side commands
 */
abstract class ServerCommand<T extends ICommandParams> extends Command {
    public static initiator_chars = ["s", "p", "a", "e"];
    /**
     * @param caller string name of your command 
     * @param args object of your arguments and types. Use initiator name to create entity vanilla like find argument.
     * @param require_count count of non optional arguments.
     */
    public constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number) {
        super(caller, args, require_count);
        this.buildPacket();
    };

    /**
     * Method, works on client. If you use it, you must send it packet from server.
     * @param data data from server
     * @returns void;
     */

    protected onClient(data: T): void {
        return null;
    };

    /**
     * Method, works after player send a command in chat in server side.
     * @param client client, that send your command in game
     * @param data your arguments from client
     */

    abstract onServer(client: NetworkClient, data: T): void;

    /**
     * Method to parse arguments: initiator -> @s, @p, @a, @e.
     * @param client just NetworkClient from server side
     * @param data your arguments from client
     * @returns 
     */

    protected getParsedData(client: NetworkClient, data: T) {
        for(const i in data) {
            const argument_name = i as string;

            if(argument_name.startsWith("initiator")) {
                const value = data[argument_name] as string;

                const obj = {
                    entities: [],
                    players: [],
                    caller: client.getPlayerUid()
                };

                if(typeof Number(value) !== "number") {
                    if(!value.startsWith("@") || !ServerCommand.initiator_chars.includes(value[1])) {
                        const error = Translation.translate("command.invalid_search_entities")
                        .replace("%s", argument_name);
                            
                        client.sendMessage(Native.Color.RED + error);
                        break;
                    };

                    switch(value.slice(0, 2)) {
                        case "@a": {
                            const players = Network.getConnectedPlayers();

                            for(const i in players) {
                                obj.players.push(Number(players[i]));
                            };

                            break;
                        };
                        case "@e": {
                            const blockSource = BlockSource.getDefaultForActor(client.getPlayerUid());
                            const radius = Number(value.slice(3, -1).split("r=")[1]);

                            if(radius && radius > 0) {
                                const position = Entity.getPosition(client.getPlayerUid());
                                const radius_multipliered = radius * 2;
                                
                                obj.entities = blockSource.listEntitiesInAABB(
                                    position.x - radius, 
                                    position.y - radius, 
                                    position.z - radius, 
                                    position.x + radius_multipliered, 
                                    position.y + radius_multipliered, 
                                    position.z + radius_multipliered
                                );
                            } else {
                                obj.entities = Entity.getAll();
                            };                   
                        };
                    };
                };
                data[argument_name] = obj;
            };
        };
        return data;
    };

    /**
     * Method that create packets;
     */

    protected buildPacket(): void {
        Network.addClientPacket("packet.command.client." + this.caller, this.onClient.bind(this));
        Network.addServerPacket("packet.command.server." + this.caller, (client, data: T) => this.onServer(client, this.getParsedData(client, data)));
    };

    /**
     * Method to call client function. Sends packet to client.
     * @param client just NetworkClient from server side
     * @param data your arguments from client
     */

    protected sendToClient(client: NetworkClient, data: T): void {
        if(client) {
            client.send("packet.command.client." + this.caller, data);
        };
    };

    /**
     * Method, sends message to client.
     * @param client just NetworkClient from server side
     * @param message any string message
     */

    protected sendMessageToClient(client: NetworkClient, message: string): void {
        if(client) {
            client.sendMessage(Translation.translate(message));
        };
    };

    /**
     * Method to call client function with all valid players.
     * @param data your arguments from client
     */

    protected sendToAllClients(data: T): void {
        Network.sendToAllClients("packet.command.client." + this.caller, data);
    };
};

class TestServerCommand extends ServerCommand<ICommandParams> {
    constructor() {
        super("hello", {
            "initiator": "number"
        });
    };

    public onServer(client: NetworkClient, data: ICommandParams) {
        return this.sendMessageToClient(client, "Список сущностей: " + JSON.stringify(data.initiator.entities) + ", игроков: " + JSON.stringify(data.initiator.players) + ", вызвавшего: " + data.initiator.caller)
    };
};

new TestServerCommand();