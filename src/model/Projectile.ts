// model/Projectile.ts

import {Mesh, Vector3, Scene, MeshBuilder} from '@babylonjs/core';
import { Enemy } from './Enemy';

export class Projectile {
    private mesh: Mesh;
    private readonly speed: number;
    private targetEnemy: Enemy | null = null;
    private damage:number;
    constructor(scene: Scene, startPosition: Vector3, speed: number,dmg:number) {
        this.mesh = MeshBuilder.CreateSphere('projectile', { diameter: .5 }, scene);
        this.mesh.position = startPosition.clone();
        this.speed = speed;
        this.damage = dmg;
    }

    public update(): void {
        if (!this.mesh) {
            return;
        }

        if (this.targetEnemy && this.targetEnemy.isAlive()) {
            // Déplacez le projectile vers l'ennemi
            const direction = this.targetEnemy.mesh.position.subtract(this.mesh.position);
            const distance = direction.length();
            if (distance > 0) {
                const moveAmount = Math.min(this.speed, distance);
                direction.normalize().scaleInPlace(moveAmount);
                this.mesh.position.addInPlace(direction);
            } else {
                console.log("dispose 1 ligne 28 - Projectile.ts");
                this.dispose();
            }
        } else{

            // L'ennemi a été éliminé,disposer le projectile si il a atteint la dernière position de l'ennemi
            console.log("dispose 2 ligne 34 - Projectile.ts");
            this.dispose();

        }
    }


    public setTargetEnemy(targetEnemy: Enemy): void {
        this.targetEnemy = targetEnemy;
    }

    public dispose(): void {
        this.mesh.dispose();
        this.mesh = null;
    }
}
