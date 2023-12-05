import { GameBoard } from "./gameBoard";
import {Cell} from "./Cell";
import {Observable} from "@babylonjs/core";
export class GameManager {

    private static instance: GameManager;
    private gameBoard: GameBoard;
    private money: number = 50;
    private lives: number = 5;

    private onGameEnd: Observable<void> = new Observable<void>();

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
    public get getMoney(): number {
        return this.money;
    }
    public set setMoney(money: number) {
        this.money = money;
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

    public enemyReachedGoal() {
        this.lives--;
        console.log(`New lives: ${this.lives}`);
        if (this.lives <= 0) {
            this.lives = 0;
            this.onGameEnd.notifyObservers();
        }
    }
}
