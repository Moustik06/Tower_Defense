// /src/model/GameBoard.ts

import { Cell } from "./Cell";

enum Direction {
    Up,
    Right,
    Down,
}

export class GameBoard {
    private static instance: GameBoard;
    private boardMatrix: Cell[][];
    private gridSize: number;

    private constructor() {
        this.gridSize = 20; // ou la valeur que vous avez définie
        this.boardMatrix = Array.from({ length: this.gridSize }, (_, row) =>
            Array.from({ length: this.gridSize }, (_, col) => new Cell(row, col)));
        
        this.generateRandomPath();
    }

    public static getInstance(): GameBoard {
        if (!GameBoard.instance) {
            GameBoard.instance = new GameBoard();
        }
        return GameBoard.instance;
    }

    public getBoardMatrix(): Cell[][] {
        return this.boardMatrix;
    }

    public printBoardMatrix(): void {
        for (let row = 0; row < this.boardMatrix.length; row++) {
            for (let col = 0; col < this.boardMatrix[row].length; col++) {
                console.log(this.boardMatrix[row][col]);
            }
        }
    }

    private generateRandomPath(): void {
        const start = { x: 0, z: Math.floor(Math.random() * this.gridSize) };

        console.log(start);
        this.boardMatrix[start.x][start.z].isStart = true;
        this.boardMatrix[start.x][start.z].isPath = true;

        
        let x = start.x;
        let z = start.z;
        let last ={x: x, z: z}
        while(x < this.gridSize - 2) {
            const direction = Math.floor(((Math.random() * 3)) -1);
            switch(direction) {
                case Direction.Up:
                    z++;
                    break;
                case Direction.Right:
                    x++;
                    break;
                case Direction.Down:
                    z--;
                    break;
            }
            if (this.isMoveValid(x, z)) {
                this.boardMatrix[x][z].isPath = true;
            }
        }
        console.log(x, z);
        this.boardMatrix[x][z].isPath = true;
        this.boardMatrix[x][z].isEnd = true;


    }

    private isMoveValid(x: number, z: number): boolean {
        //Check out of bounds
        if (x < 0 || x >= this.gridSize || z < 0 || z >= this.gridSize) {
            console.log("Out of bounds");
            return false;
        }
        //Check if path
        if (this.boardMatrix[x][z].isPath) {
            console.log("Is path")
            return false;
        }
        console.log("In bounds")
        return true;
    }

}
