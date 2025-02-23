interface ICommandParams {
    /**
     * Entity list got from native format: 
     * @s caller
     * @p caller
     * @a all players
     * @e all entities
     * Must be registered in constructor.
     */
    initiator?: {
        entities: number[] | [],
        players: number[] | [],
        caller: [number]
    };
};