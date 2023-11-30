// model/Projectile.ts

import {Mesh, Vector3, Scene, MeshBuilder} from '@babylonjs/core';
import { Enemy } from './Enemy';

export class Projectile {
    private mesh: Mesh;
    private speed: number;
    private targetEnemy: Enemy | null = null;
    constructor(scene: Scene, startPosition: Vector3, speed: number) {
        this.mesh = MeshBuilder.CreateSphere('projectile', { diameter: .5 }, scene);
        this.mesh.position = startPosition.clone();
        this.speed = speed;
    }

    public update(): void {
        if (this.targetEnemy && this.targetEnemy.isAlive()) {
            // Déplacez le projectile vers l'ennemi
            const direction = this.targetEnemy.mesh.position.subtract(this.mesh.position);
            const distance = direction.length();
            if (distance > 0) {
                const moveAmount = Math.min(this.speed, distance);
                direction.normalize().scaleInPlace(moveAmount);
                this.mesh.position.addInPlace(direction);
            } else {
                this.dispose();
            }
        } else {
            // L'ennemi a été éliminé, vous pouvez choisir de disposer le projectile ou effectuer d'autres actions nécessaires.
            this.dispose();
        }
    }


    public setTargetEnemy(targetEnemy: Enemy): void {
        this.targetEnemy = targetEnemy;
    }

    public dispose(): void {
        this.mesh.dispose();
    }
}
