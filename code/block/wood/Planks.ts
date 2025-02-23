class Planks extends BasicBlock {
    constructor(id: string, public log_id: string, public bark_id: string, public hewn_id: string) {
        super(id, [{
            name: "block.infinite_forest." + id,
            inCreative: true,
            texture: [[id, 0]]
        }]);
    };
}