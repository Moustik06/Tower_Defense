import { Engine, Scene} from "@babylonjs/core";
import {GameManager} from "./model/gameManager";
import {GameScene} from "./view/gameScene";

import "@babylonjs/gui/3D/";
class App {
    constructor() {
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);

        const gameManager = GameManager.getInstance();
        const gameScene = GameScene.getInstance(scene);

        engine.runRenderLoop(() => {
            gameScene.renderLoop();
            scene.render();

        });

        gameManager.onGameEnd.add(() => {
            gameScene.onEndDisplay.notifyObservers(true);
        });

        gameScene.onStopEngine.add(() => {
            engine.stopRenderLoop();
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });
    }
}
new App();