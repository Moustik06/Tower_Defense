// model/Enemy.ts

import { Vector3, Mesh } from '@babylonjs/core';
import { Path } from './Path';
import {GameManager} from "./gameManager";

export class Enemy {
    private health: number;
    private path: Path;
    private speed: number;
    private currentPositionIndex: number = 0;
    private alive: boolean = true;
    mesh: Mesh;

    constructor(health,path: Path, speed: number, mesh: Mesh) {
        this.health = health;
        this.path = path;
        this.speed = speed;
        this.mesh = mesh;
    }

    public updateMovement(): void {

        const waypoints = this.path.getWaypoints();

        if (this.currentPositionIndex < waypoints.length - 1) {
            const currentPosition = waypoints[this.currentPositionIndex];
            const nextPosition = waypoints[this.currentPositionIndex + 1];

            const direction = nextPosition.subtract(currentPosition).normalize();
            this.mesh.position = this.mesh.position.add(direction.scale(this.speed));

            // Vérifiez si l'ennemi a atteint le waypoint suivant
            if (Vector3.Distance(this.mesh.position, nextPosition) < 0.1) {
                this.currentPositionIndex++;
            }
        }
    }
    public get healthPoints(): number {
        return this.health;
    }
    public takeDamage(damage: number) {
        if (this.health > 0) {
            this.health -= damage;
            console.log(`New health: ${this.health}`);
            if (this.health <= 0) {
                this.health = 0;
                GameManager.getInstance().enemyKilled();
                this.mesh.dispose();
                this.alive = false;
            }
        }
    }

    public isAlive() {
        return this.alive;
    }
}
