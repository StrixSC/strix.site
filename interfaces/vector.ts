export default class Vector {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    copy = (): Vector => {
        return new Vector(this.x, this.y, this.z);
    };

    mag = (): number => {
        return Math.sqrt(this.magSq());
    };

    magSq = (): number => {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };

    normalize = (): Vector => {
        this.div(this.mag());
        return this;
    };

    add = (v: Vector): Vector => {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    };

    sub = (v: Vector): Vector => {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    };

    mult(n: number): Vector {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }

    div = (n: number): Vector => {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    };
}
