import {
    Mesh,
    Vector3,
    Scene,
    MeshBuilder,
    ParticleSystem,
    Texture,
    SphereParticleEmitter,
    Color4, ParticleHelper, IParticleSystem, AbstractMesh
} from '@babylonjs/core';
import { Enemy } from './Enemy';
import {GameScene} from "../view/gameScene";

export class Projectile {
    private mesh: Mesh;
    private readonly speed: number;
    private targetEnemy: Enemy | null = null;
    private readonly damage:number;
    constructor(scene: Scene, startPosition: Vector3, speed: number,dmg:number) {
        this.mesh = MeshBuilder.CreateSphere('projectile', { diameter: .5 }, scene);
        this.mesh.position = startPosition.clone();
        this.speed = speed;
        this.damage = dmg;
        this.mesh.checkCollisions = true;
    }

    public update(): void {
        if (!this.mesh) {
            return;
        }
        if (this.targetEnemy && this.targetEnemy.isAlive()) {
            const direction = this.targetEnemy.mesh.position.subtract(this.mesh.position);
            if (!this.mesh.intersectsMesh(this.targetEnemy.mesh)) {
                const moveAmount = this.speed;
                direction.normalize().scaleInPlace(moveAmount);
                this.mesh.position.addInPlace(direction);
                return;
            }else{
                this.targetEnemy.takeDamage(this.damage);
                this.dispose();
            }
        } else{
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
