import {Vector3} from "@babylonjs/core";

export class Path{
    private waypoints: Vector3[];

    constructor(waypoints: Vector3[]) {
        console.log(waypoints);
        this.waypoints = waypoints;
    }

    public getWaypoints(): Vector3[] {
        return [...this.waypoints];
    }
}