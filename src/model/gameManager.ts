import { GameBoard } from "./gameBoard";
import {Cell} from "./Cell";
export class GameManager {

    private static instance: GameManager;
    private gameBoard: GameBoard;
    private money: number = 50;
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
    public getMoney(): number {
        return this.money;
    }
    public getBoardMatrix() : any {
        this.gameBoard.getBoardMatrix();
    }
    private addMoney(amount: number): void {
        this.money += amount;
        console.log(`New money: ${this.money}`);
    }
    public getTowerCost(type:string):number{
        switch(type){
            case "Tower1":
                return 10;
            case "Tower2":
                return 20;
            case "Tower3":
                return 30;
            default:
                return 0;
            }
    }

    public enemyKilled() {
        this.addMoney(2);
    }
}
