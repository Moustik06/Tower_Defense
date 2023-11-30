import { GameBoard } from "./gameBoard";
export class GameManager {

    private static instance: GameManager;
    private gameBoard: GameBoard;
    private constructor() {
        this.gameBoard = GameBoard.getInstance();
    }

    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public printBoardMatrix(): void {
        this.gameBoard.printBoardMatrix();
    }

}
