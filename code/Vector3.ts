class Vector3 {
    public static readonly DOWN: Vector3 = new Vector3(0, -1, 0);
	public static readonly UP: Vector3 = new Vector3(0, 1, 0);
	public static readonly NORTH: Vector3 = new Vector3(0, 0, -1);
	public static readonly SOUTH: Vector3 = new Vector3(0, 0, 1);
	public static readonly EAST: Vector3 = new Vector3(-1, 0, 0);
	public static readonly WEST: Vector3 = new Vector3(1, 0, 0);

    public constructor(public x: number, public y: number, public z: number) {};

    public copy(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    };

    public equals(vector: Vector3) {
        return this.x === vector.x && this.y === vector.y && this.z === vector.z;
    };
};