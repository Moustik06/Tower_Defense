// /src/model/GameBoard.ts

import { Cell } from "./Cell";

enum Direction {
    Up,
    Right,
    Down,
}

export class GameBoard {
    private static instance: GameBoard;
    private readonly boardMatrix: Cell[][];
    private readonly gridSize: number;
    private readonly path: Cell[] = [];
    private constructor() {
        this.gridSize = 20; // ou la valeur que vous avez définie
        this.boardMatrix = Array.from({ length: this.gridSize }, (_, row) =>
            Array.from({ length: this.gridSize }, (_, col) => new Cell(row, col)));
        
        this.generateRandomPath();
    }
    public get pathCells(): Cell[] {
        return this.path;
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

        console.log("----start----");
        console.log(start);
        this.path.push(this.boardMatrix[start.x][start.z]);
        this.boardMatrix[start.x][start.z].isStart = true;
        this.boardMatrix[start.x][start.z].isPath = true;

        let x = start.x;
        let z = start.z;

        let maxZposition = this.gridSize-4;
        let minZposition = 3;
        const setPath = (x: number, z: number) => {
            this.boardMatrix[x][z].isPath = true;
            this.path.push(this.boardMatrix[x][z]);
        };
        while (x < this.gridSize-1){
            x++;
            setPath(x,z);
        }
        /*

        0,0 -> en bas a gauche
        0,19 -> en haut a gauche
        19,19 -> en haut a droite
        19,0 -> en bas a droite


        vers le haut -> z++
        vers la droite -> x++
        vers le bas -> z--


        Idée :
            Si on doit aller vers le haut, on regarde si on est inférieur à maxZposition. Si c'est le cas, on monte
            en aléatoire entre 0 et 4 en faisant attention de pas dépasser maxZposition.
            Si on est déjà sur maxZposition on va déscendre entre 3 et 6.

            Si on doit aller vers le bas on regarde si on est supérieur à minZposition. Si c'est le cas, on descend
            en aléatoire entre 0 et 10 sans déscendre en dessous de minZposition.

            Si on doit aller a droite, on vérifie qu'on ne dépasse pas this.gridsize -1 et on avance de 3 a 7 pas

            On doit bien marquer comme Path chaque case entre les mouvements, on va utiliser une variable last qui
            va contenir la dernière position et on va marquer comme path toutes les cases entre last et la nouvelle.
            On ne doit pas pouvoir revenir en arrière


        let last = { x, z ,direction : Direction.Up};


        const goUp = (z: number) => {
            return
        }
        const goDown = (z: number) => {
            return
        }
        const goRight = (x: number) => {
            return
        }
        let counter = 0;
        while (counter < 20) {
            counter++;
            const weightedRandom = Math.random();
            let direction: Direction;

            if (weightedRandom < 0.4) {
                direction = Direction.Up;
            } else if (weightedRandom < 0.8) {
                direction = Direction.Right;
            } else {
                direction = Direction.Down;
            }

            // Si la dernière direction == direction on va changer en fonction de la direction
            // Up -> Right
            // Right -> Down || Up
            // Down -> Right
            switch (last.direction) {
                case Direction.Up:
                    direction = Direction.Right;
                    break;
                case Direction.Right:
                    direction = Math.random() > 0.5 ? Direction.Down : Direction.Up;
                    break;
                case Direction.Down:
                    direction = Direction.Right;
                    break;
            }
            switch (direction) {
                case Direction.Up:
                    console.log("up");
                    last.direction = Direction.Up;
                    //goUp(z);
                    break;
                case Direction.Right:
                    console.log("right");
                    last.direction = Direction.Right;
                    //goRight(x);
                    break;
                case Direction.Down:
                    console.log("down");
                    last.direction = Direction.Down;
                    //goDown(z);
                    break;
            }
            this.boardMatrix[x][z].isPath = true;
            this.boardMatrix[x][z].isEnd = true;
        }

         */
    }
}
