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

    public add(vector: Vector3): Vector3 {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    };

    public subtract(vector: Vector3): Vector3 {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    };

    public multiply(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    };

    public divide(scalar: number): Vector3 {
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    };

    public dot(vector: Vector3): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    };

    public cross(vector: Vector3): Vector3 {
        return new Vector3(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    };

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };

    public normalize(): Vector3 {
        const length = this.length();
        return new Vector3(this.x / length, this.y / length, this.z / length);
    };
};
