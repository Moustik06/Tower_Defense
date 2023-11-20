// /src/controller/GameController.ts

import { Scene, ArcRotateCamera } from '@babylonjs/core';

export class GameController {
    private static instance: GameController;
    private scene: Scene;
    private camera: ArcRotateCamera;
    private rotationSpeed: number = 0.01;
    private keyState: { [key: string]: boolean } = {};

    private constructor(scene: Scene, camera: ArcRotateCamera) {
        this.scene = scene;
        this.camera = camera;

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        this.camera.inputs.clear();
    }

    public static getInstance(scene: Scene, camera: ArcRotateCamera): GameController {
        if (!GameController.instance) {
            GameController.instance = new GameController(scene, camera);
        }
        return GameController.instance;
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this.keyState[event.key.toLowerCase()] = true;
    }
    
    private handleKeyUp(event: KeyboardEvent): void {
        this.keyState[event.key.toLowerCase()] = false;
    }

    public update(): void {
        if (this.keyState['q']) {
            this.camera.alpha -= this.rotationSpeed;
        }

        if (this.keyState['d']) {
            this.camera.alpha += this.rotationSpeed;
        }
    }
}
