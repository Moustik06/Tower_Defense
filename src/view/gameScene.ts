import { Scene,MeshBuilder,HemisphericLight,Vector3,ArcRotateCamera,StandardMaterial,Color3 } from '@babylonjs/core';
import { GameBoard } from '../model/gameBoard';
import {GameController} from "../controller/gameController";
export class GameScene {
    private static instance: GameScene;
    private camera: ArcRotateCamera;
    private gameController : GameController;

    private constructor(private scene: Scene) {
        this.generateWorld();
        this.gameController = GameController.getInstance(this.scene, this.camera);
        

    }

    public static getInstance(scene: Scene): GameScene {
        if (!GameScene.instance) {
            GameScene.instance = new GameScene(scene);
        }
        return GameScene.instance;
    }

    private generateWorld(): void {
        this.createLight();
        this.createGround();
        this.configureCamera();
        this.createGameBoard();
        

    }
    public renderLoop(): void {
        this.gameController.update();
    }
    private createGround(): void {
        const ground = MeshBuilder.CreateGround('myGround', { width: 20, height: 20 }, this.scene);
        ground.checkCollisions = true;
        ground.position.y = 0;
    }

    private createLight(): void {
        const globalLight = new HemisphericLight('globalLight', new Vector3(0, 1, 0), this.scene);
        globalLight.intensity = 0.7;
    }

    private configureCamera(): void {
        this.camera = new ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 4, 20, Vector3.Zero(), this.scene);

        this.camera.radius = 30;
        this.camera.angularSensibilityX = 500;
        this.camera.angularSensibilityY = 500;

        this.camera.attachControl(this.scene.getEngine().getRenderingCanvas() as HTMLCanvasElement, true);
    }


    public createGameBoard(): void {
        const gameBoard = GameBoard.getInstance();
        const boardMatrix = gameBoard.getBoardMatrix();
        const cellSize = 1;
        const gridSize = boardMatrix.length;
    
        // Créez deux matériaux distincts
        const pathMaterial = new StandardMaterial('pathMaterial', this.scene);
        pathMaterial.diffuseColor = new Color3(0, 0, 0); // Noir pour le chemin
    
        const regularMaterial = new StandardMaterial('regularMaterial', this.scene);
        regularMaterial.diffuseColor = new Color3(1, 0, 0); // Rouge pour les autres cellules
        
        const startMaterial = new StandardMaterial('startMaterial', this.scene);
        startMaterial.diffuseColor = new Color3(0, 1, 0); // Vert pour le départ

        const endMaterial = new StandardMaterial('endMaterial', this.scene);
        endMaterial.diffuseColor = new Color3(0, 0, 1); // Bleu pour l'arrivée

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = boardMatrix[row][col];
                const cube = MeshBuilder.CreateBox(`Cube_${row}_${col}`, { size: 0.8 }, this.scene);
    
                const offsetX = (gridSize - 1) * cellSize * 0.5;
                const offsetZ = (gridSize - 1) * cellSize * 0.5;
    
                cube.position.x = (cell.x - offsetX) * cellSize;
                cube.position.y = 0.5;
                cube.position.z = (cell.z - offsetZ) * cellSize;
    
                // Appliquez le matériau en fonction de la valeur de isPath
                cube.material = cell.isPath ? pathMaterial : regularMaterial;

                if (cell.isStart) {
                    cube.material = startMaterial;
                }
                if (cell.isEnd) {
                    cube.material = endMaterial;
                }

            }
        }
    }
    
}
