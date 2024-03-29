import {ArcRotateCamera, Color3, CubeTexture, HemisphericLight, Mesh, MeshBuilder, Observable, ParticleHelper, Scene, StandardMaterial, Vector3} from '@babylonjs/core';
import {AdvancedDynamicTexture, Button, Control, StackPanel, TextBlock} from "@babylonjs/gui";
import {GameBoard} from '../model/gameBoard';
import {GameController} from "../controller/gameController";
import {GameManager} from "../model/gameManager";
import {Path} from "../model/Path";
import {EnemyFactory} from "../model/EnemyFactory";
import {Enemy} from "../model/Enemy";
import {Tower} from "../model/Tower";

export class GameScene {
    private static instance: GameScene;
    public onEndDisplay: Observable<boolean> = new Observable<boolean>();
    public onStopEngine: Observable<void> = new Observable<void>();
    private camera: ArcRotateCamera;
    private gameController: GameController;
    private gui: AdvancedDynamicTexture;
    private ground: Mesh;
    private enemy: Enemy[] = [];
    private towers: Tower[] = [];
    private gameManager: GameManager = GameManager.getInstance();

    private constructor(private scene: Scene) {
        this.generateWorld();
        this.setupSkybox();
        this.gameController = GameController.getInstance(this.scene, this.camera);
        scene.collisionsEnabled = true;

        this.onEndDisplay.add(() => {
            this.endSceneDisplay();
        });
    }

    public static getInstance(scene: Scene): GameScene {
        if (!GameScene.instance) {
            GameScene.instance = new GameScene(scene);
        }
        return GameScene.instance;
    }

    public renderLoop(): void {

        this.gameController.update();

        this.towers.forEach(tower => {
            tower.update(this.enemy, this.scene.getEngine().getDeltaTime() / 1000);
        });

        this.enemy.forEach(enemy => {
            enemy.updateMovement();
        });


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
                const cube = MeshBuilder.CreateBox(`Cube_${row}_${col}`, {size: 0.8, height: 0.2}, this.scene);

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

    private setupSkybox(): void {
        let cube = new CubeTexture("https://assets.babylonjs.com/environments/environmentSpecular.env", this.scene);
        cube.level = 0.5;
        this.scene.environmentTexture = cube;
        this.scene.createDefaultSkybox(this.scene.environmentTexture, true, 2000, 0.15, true);
    }

    private generateWorld(): void {
        this.createLight();
        this.createGround();
        this.configureCamera();
        this.createGameBoard();
        this.initGUI();
        this.spawnEnemy();

    }

    private initGUI(): void {

        let isPlacingTower = false;
        let currentMoney = this.gameManager.getMoney;
        let selectedTower = "";
        this.gui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const updateButtonState = () => {
            const btn = ["tower1Button", "tower2Button", "tower3Button"];
            const cost = [10, 20, 30];
            for (let i = 0; i < btn.length; i++) {
                let button = this.gui.getControlByName(btn[i]) as Button;
                if (currentMoney >= cost[i]) {
                    button.isEnabled = true;
                    button.color = "white";
                } else {
                    button.isEnabled = false;
                }
            }
        }
        const canPlaceTower = (position: Vector3): boolean => {

            const offset = (20 - 1) * 0.5;

            const row = Math.round(position.x + offset);
            const col = Math.round(position.z + offset);

            let board = GameBoard.getInstance().getBoardMatrix();
            if (board[row][col].isPath || board[row][col].isOccupied) {
                return false;
            }
            board[row][col].isOccupied = true;
            return true;
        }

        let leftPanel = new StackPanel();
        leftPanel.width = "220px";
        leftPanel.fontSize = "14px";
        leftPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        leftPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.gui.addControl(leftPanel);

        let money = new TextBlock();
        money.height = "40px";
        money.text = "Money: " + currentMoney + "$";
        money.color = "white";
        money.fontSize = 20;
        leftPanel.addControl(money);

        this.gameManager.onMoneyUpdate.add((amount: number) => {
            currentMoney = amount;
            updateButtonState();
            money.text = "Money: " + currentMoney + "$";
        }, 1);
        let stackPanel = new StackPanel();
        stackPanel.width = "220px";
        stackPanel.fontSize = "14px";
        stackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.gui.addControl(stackPanel);

        let nukebutton = Button.CreateSimpleButton("but1", "Nuke ! - 50$");
        nukebutton.width = "100px"
        nukebutton.height = "50px";
        nukebutton.color = "white";
        nukebutton.background = "green";

        nukebutton.onPointerUpObservable.add(() => {
            if (currentMoney < 50) {
                return;
            }
            currentMoney -= 50;
            this.gameManager.setMoney = currentMoney;
            money.text = "Money: " + currentMoney + "$";
            updateButtonState();

            ParticleHelper.CreateAsync("explosion", this.scene).then((set) => {
                set.systems.forEach(s => {
                    s.disposeOnStop = true;
                });

                set.start();
            });
            this.enemy.forEach(enemy => {
                enemy.takeDamage(1000);
            });
        });
        stackPanel.addControl(nukebutton);
        let towersTitle = new TextBlock();
        towersTitle.text = "Towers";
        towersTitle.height = "30px";
        towersTitle.color = "white";
        towersTitle.fontSize = 20;
        leftPanel.addControl(towersTitle);

        let tower1Button = Button.CreateSimpleButton("tower1Button", "Tower 1 - 10$");
        tower1Button.width = "100%";
        tower1Button.height = "40px";
        tower1Button.color = "white";
        tower1Button.background = "green";
        tower1Button.onPointerUpObservable.add(() => {
            selectedTower = "Tower1";
            isPlacingTower = true;
        });
        leftPanel.addControl(tower1Button);

        let tower2Button = Button.CreateSimpleButton("tower2Button", "Tower 2 - 20$");
        tower2Button.width = "100%";
        tower2Button.height = "40px";
        tower2Button.color = "white";
        tower2Button.background = "green";
        tower2Button.onPointerUpObservable.add(() => {
            selectedTower = "Tower2";
            isPlacingTower = true;
        });
        leftPanel.addControl(tower2Button);

        let tower3Button = Button.CreateSimpleButton("tower3Button", "Tower 3 - 30$");
        tower3Button.width = "100%";
        tower3Button.height = "40px";
        tower3Button.color = "white";
        tower3Button.background = "green";
        tower3Button.onPointerUpObservable.add(() => {
            selectedTower = "Tower3";
            isPlacingTower = true;
        });

        leftPanel.addControl(tower3Button);

        let spawnButton = Button.CreateSimpleButton("spawnButton", "Spawn");
        spawnButton.width = "100%";
        spawnButton.height = "40px";
        spawnButton.color = "white";
        spawnButton.background = "green";
        spawnButton.onPointerUpObservable.add(() => {
            this.spawnEnemy();
        });
        leftPanel.addControl(spawnButton);
        updateButtonState();
        this.scene.onPointerUp = (evt, pickResult) => {
            if (isPlacingTower) {
                let pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                if (pickInfo.hit && pickInfo.pickedMesh && pickInfo.pickedMesh.name.includes("Cube")) {
                    const cost = GameManager.getInstance().getTowerCost(selectedTower);
                    if (currentMoney >= cost) {
                        currentMoney -= cost;
                        this.gameManager.setMoney = currentMoney;
                        money.text = "Money: " + currentMoney + "$";
                        updateButtonState();
                        isPlacingTower = false;
                        let towerPosition = pickInfo.pickedMesh.getAbsolutePosition()
                        console.log(towerPosition);
                        if (!canPlaceTower(towerPosition)) {
                            console.log("Can't place tower here");
                            currentMoney += cost;
                            this.gameManager.setMoney = currentMoney;
                            money.text = "Money: " + currentMoney + "$";
                            updateButtonState();
                            return;
                        }
                        this.buyAndPlaceTower(selectedTower, towerPosition);
                        pickInfo.pickedMesh.dispose();
                    } else {
                        console.log("Not enough money");
                        isPlacingTower = false;
                    }
                }
            }
        }
    }

    private buyAndPlaceTower(type: string, position: Vector3): void {
        console.log("Buying and placing tower of type " + type + " at position " + position);
        let tower = MeshBuilder.CreateCylinder("tower", {diameter: 1, height: 1.5}, this.scene);
        const tower1Material = new StandardMaterial("tower1Material", this.scene)
        const tower2Material = new StandardMaterial("tower2Material", this.scene)
        const tower3Material = new StandardMaterial("tower3Material", this.scene)
        tower1Material.diffuseColor = new Color3(0, 1, 0);
        tower2Material.diffuseColor = new Color3(0, 0, 1);
        tower3Material.diffuseColor = new Color3(1, 0, 0);
        switch (type) {
            case "Tower1":
                tower.material = tower1Material;
                this.towers.push(new Tower(5, 1, 5, tower));
                break;
            case "Tower2":
                tower.material = tower2Material;
                this.towers.push(new Tower(5, 2, 10, tower));
                break;
            case "Tower3":
                tower.material = tower3Material;
                this.towers.push(new Tower(10, 5, 15, tower));
                break;
        }

        tower.position = position;
    }

    private createGround(): void {
        this.ground = MeshBuilder.CreateGround('myGround', {width: 20, height: 20}, this.scene);
        this.ground.checkCollisions = true;
        this.ground.position.y = 0;
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

    private spawnEnemy(): void {
        let pathcells = GameBoard.getInstance().pathCells;
        let waypoints = [];
        let offset = (20 - 1) * 0.5;
        for (let i = 0; i < pathcells.length; i++) {
            console.log(pathcells[i]);
            waypoints.push(new Vector3(pathcells[i].x - offset, 1, pathcells[i].z - offset));
        }

        const path = new Path(waypoints);
        this.enemy.push(EnemyFactory.getInstance().createEnemy(100, path, 0.02));
    }

    private endSceneDisplay(): void {

        let test = MeshBuilder.CreateBox("test", {height: 5, width: 100, depth: 100}, this.scene);
        let mat = new StandardMaterial("mat", this.scene);
        mat.diffuseColor = new Color3(0, 0, 0);
        mat.specularColor = new Color3(0, 0, 0);
        test.material = mat;
        this.gui.dispose();
        let newGui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        let panel = new StackPanel();
        panel.width = "500px";
        panel.fontSize = "14px";
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        newGui.addControl(panel);

        let endText = new TextBlock();
        endText.height = "250px";
        endText.text = "Game Over";
        endText.color = "white";
        endText.fontSize = 50;
        panel.addControl(endText);

        let restartButton = Button.CreateSimpleButton("restartButton", "Restart");
        restartButton.width = "60%";
        restartButton.height = "40px";
        restartButton.color = "black";
        restartButton.background = "white";
        restartButton.onPointerUpObservable.add(() => {
            window.location.reload();
        });

        panel.addControl(restartButton);

        this.onStopEngine.notifyObservers();
    }
}
