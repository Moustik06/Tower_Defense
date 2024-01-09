import {Enemy} from "./Enemy";
import {Mesh, MeshBuilder} from "@babylonjs/core";
import {Path} from "./Path";

export class EnemyFactory{
    private static instance: EnemyFactory;
    private enemyIndex: number = 0;
    private constructor(){
    }
    public static getInstance(): EnemyFactory{
        if(!this.instance){
            this.instance = new EnemyFactory();
        }
        return this.instance;
    }

    public createEnemy(health: number, path: Path, speed: number): Enemy {
        const enemyMesh = MeshBuilder.CreateIcoSphere(`enemyMesh_${this.enemyIndex}`, { radius: 0.6,subdivisions: 1 });
        if (path.getWaypoints().length > 0) {
            enemyMesh.position = path.getWaypoints()[0];
        }
        this.enemyIndex++;
        return new Enemy(health, path, speed, enemyMesh);
    }
}