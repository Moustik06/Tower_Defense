// model/Tower.ts

import { Enemy } from './Enemy';
import { Vector3, Mesh } from '@babylonjs/core';
import {Projectile} from "./Projectile";

export class Tower {
    private readonly range: number;
    private readonly fireRate: number;
    private readonly damage: number;
    private targetEnemy: Enemy | null = null;
    private readonly mesh: Mesh;
    private timeSinceLastShot: number = 0; // Ajout d'une variable pour suivre le temps écoulé depuis le dernier tir
    private projectiles: Projectile[] = [];
    constructor(range: number, fireRate: number, damage: number, mesh: Mesh) {
        this.range = range;
        this.fireRate = fireRate;
        this.damage = damage;
        this.mesh = mesh;
        this.mesh.checkCollisions = true;
    }

    public getMesh(): Mesh {
        return this.mesh;
    }

    public update(enemies: Enemy[], deltaTime: number): void {
        // Mettez à jour le temps écoulé depuis le dernier tir
        this.timeSinceLastShot += deltaTime;

        // Logique supplémentaire, y compris le tir si un ennemi est trouvé
        this.projectiles.forEach(projectile => projectile.update());
        if (this.timeSinceLastShot >= 1 / this.fireRate) {
            this.findTarget(enemies);

            if (this.targetEnemy && this.targetEnemy.healthPoints > 0) {
                this.shoot();
                this.timeSinceLastShot = 0; // Réinitialiser le temps écoulé après un tir
            }
        }
    }

    private findTarget(enemies: Enemy[]): void {
        this.targetEnemy = null;

        for (const enemy of enemies) {
            const distance = Vector3.Distance(this.mesh.position, enemy.mesh.position);

            if (distance <= this.range && enemy.healthPoints > 0) {
                this.targetEnemy = enemy;
                break; // On prend le premier ennemi trouvé dans la portée
            }
        }
    }

    private shoot(): void {
        // Logique de tir sur l'ennemi
        if (this.targetEnemy && this.targetEnemy.healthPoints > 0) {
            //console.log(this.targetEnemy);
            const projectile = new Projectile(this.mesh.getScene(), this.mesh.position.clone(), 0.05,this.damage);
            projectile.setTargetEnemy(this.targetEnemy);
            this.projectiles.push(projectile);

        }
    }
}
