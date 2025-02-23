/**
 * Class to create your client side commands.
 */
abstract class ClientCommand<T extends ICommandParams> extends Command {
    /**
     * @param caller string name of your command 
     * @param args object of your arguments and types. Use initiator name to create entity vanilla like find argument.
     * @param require_count count of non optional arguments.
     */
    public constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number) {
        super(caller, args, require_count)
    };

    /**
     * Method, works after player send a command in chat in client side.
     * @param data your arguments from client
     */
    abstract onCall(data: T): void;

    /**
     * Method, works after player send a command in chat in client side.
     */
    abstract onCall(): void;
};