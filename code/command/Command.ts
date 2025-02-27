type ArgumentTypes = "string" | "number" | "boolean" | "any";

abstract class Command {
    public static list: Record<string, Command> = {};

    public caller: string;
    public arguments: Record<string, ArgumentTypes>;
    public require_count: number;

    public constructor(caller: string, args?: Record<string, ArgumentTypes>, require_count?: number) {
        this.caller = caller;
        this.arguments = args || {};
        this.require_count = typeof require_count === "number" ? require_count : Object.keys(this.arguments).length;

        Command.list[caller] = this;
    };

};
