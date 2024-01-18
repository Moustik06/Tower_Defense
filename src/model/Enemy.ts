import { Vector3, Mesh } from '@babylonjs/core';
import { Path } from './Path';
import {GameManager} from "./gameManager";

export class Enemy {
    private health: number;
    private path: Path;
    private speed: number;
    private currentPositionIndex: number = 0;
    private alive: boolean = true;
    private static gameManager: GameManager;
    mesh: Mesh;

    constructor(health: number,path: Path, speed: number, mesh: Mesh) {
        this.health = health;
        this.path = path;
        this.speed = speed;
        this.mesh = mesh;
        Enemy.gameManager = GameManager.getInstance();
    }

    public updateMovement(): void {
        if(!this.alive){
            return;
        }

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

        if(this.currentPositionIndex >= waypoints.length - 1){
            this.mesh.dispose();
            this.alive = false;
            Enemy.gameManager.enemyReachedGoal();
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
                Enemy.gameManager.enemyKilled();
                this.mesh.dispose();
                this.alive = false;
            }
        }
    }

    public isAlive() {
        return this.alive;
    }
}
