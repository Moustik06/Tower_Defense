export class Cell {
    public x: number;
    public z: number;
    public isOccupied: boolean;
    public isPath: boolean;
    public isStart: boolean;
    public isEnd: boolean;
    constructor(x: number, z: number) {
        this.x = x;
        this.z = z;
        this.isOccupied = false;
        this.isPath = false;
    }
}
