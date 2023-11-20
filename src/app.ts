import { Engine, Scene, Vector3, HemisphericLight, Mesh, MeshBuilder, FreeCamera } from "@babylonjs/core";

import {GameManager} from "./model/gameManager";
import {GameScene} from "./view/gameScene";

import "@babylonjs/gui/3D/";
class App {
    constructor() {
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);
        
        const gameManager = GameManager.getInstance();
        const gameScene = GameScene.getInstance(scene);
        gameManager.printBoardMatrix();

        engine.runRenderLoop(() => {
            gameScene.renderLoop();
            scene.render();
        });
        window.addEventListener("resize", function () {
            engine.resize();
        });
    }
}
new App();