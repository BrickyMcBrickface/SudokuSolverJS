import { Grid } from './Grid';
import { GridSize } from './GridSize';
import { BoxSize } from './BoxSize';
import { Solver } from './Solver';
import { Solution, NoSolution } from './Solution';

export class Program {
    private constructor() { }
    
    public static main() {
        Program.solvePuzzle(Puzzle9x9.EasyPuzzle, GridSize.Default,
            (solution: Solution, elapsedMilliseconds: number) => {
                console.log('9x9 easy puzzle solved in ' + elapsedMilliseconds + 'ms!');
                console.log('solution=' + solution.grid.toString());
            }, (elapsedMilliseconds: number) => {
                console.log('A solution could not be found for the 9x9 easy puzzle!');
            });
            
        Program.solvePuzzle(Puzzle9x9.MediumPuzzle, GridSize.Default,
            (solution: Solution, elapsedMilliseconds: number) => {
                console.log('9x9 medium puzzle solved in ' + elapsedMilliseconds + 'ms!');
                console.log('solution=' + solution.grid.toString());
            }, (elapsedMilliseconds: number) => {
                console.log('A solution could not be found for the 9x9 medium puzzle!');
            });
            
        Program.solvePuzzle(Puzzle9x9.HardPuzzle, GridSize.Default,
            (solution: Solution, elapsedMilliseconds: number) => {
                console.log('9x9 hard puzzle solved in ' + elapsedMilliseconds + 'ms!');
                console.log('solution=' + solution.grid.toString());
            }, (elapsedMilliseconds: number) => {
                console.log('A solution could not be found for the 9x9 hard puzzle!');
            });
            
        // Program.solvePuzzle(Puzzle25x25.UnknownDifficultyPuzzle, new GridSize(new BoxSize(5, 5)),
        //     (solution: Solution, elapsedMilliseconds: number) => {
        //         console.log('25x25 unknown difficulty puzzle solved in ' + elapsedMilliseconds + 'ms!');
        //         console.log('solution=' + solution.grid.toString());
        //     }, (elapsedMilliseconds: number) => {
        //         console.log('A solution could not be found for the 25x25 unknown difficulty puzzle!');
        //     });
    }
    
    private static solvePuzzle(puzzle: number[], gridSize: GridSize,
        onSolutionFound: (solution: Solution, elapsedMilliseconds: number) => void,
        onSolutionNotFound: (elapsedMilliseconds: number) => void) {
        
        const sw = Stopwatch.startNew();
        const grid = Grid.load(gridSize, puzzle);
        const solver = new Solver(grid);
        
        let solution = solver.solve();
        
        sw.stop();
        
        if(solution === undefined) {
            onSolutionNotFound(sw.elapsedMilliseconds);
        }
        else {
            onSolutionFound((solution as Solution), sw.elapsedMilliseconds);
        }
    }
}

class Puzzle9x9 {
    public static readonly EasyPuzzle: number[] = [
        0,2,0,1,7,8,0,3,0,
        0,4,0,3,0,2,0,9,0,
        1,0,0,0,0,0,0,0,6,
        0,0,8,6,0,3,5,0,0,
        3,0,0,0,0,0,0,0,4,
        0,0,6,7,0,9,2,0,0,
        9,0,0,0,0,0,0,0,2,
        0,8,0,9,0,1,0,6,0,
        0,1,0,4,3,6,0,5,0
    ];
    
    public static readonly MediumPuzzle: number[] = [
        5,3,0,0,7,0,0,0,0,
        6,0,0,1,9,5,0,0,0,
        0,9,8,0,0,0,0,6,0,
        8,0,0,0,6,0,0,0,3,
        4,0,0,8,0,3,0,0,1,
        7,0,0,0,2,0,0,0,6,
        0,6,0,0,0,0,2,8,0,
        0,0,0,4,1,9,0,0,5,
        0,0,0,0,8,0,0,7,9
    ];
    
    public static readonly HardPuzzle: number[] = [
        0,0,0,2,0,6,0,0,3,
        0,6,0,0,8,0,0,0,0,
        0,7,1,0,0,3,0,0,0,
        0,0,6,0,0,0,9,1,0,
        0,0,7,8,0,9,6,0,0,
        0,2,4,0,0,0,8,0,0,
        0,0,0,1,0,0,5,4,0,
        0,0,0,0,3,0,0,8,0,
        2,0,0,6,0,8,0,0,0
    ];
}

class Puzzle25x25 {
    public static readonly UnknownDifficultyPuzzle: number[] = [
        0, 2, 0, 0, 0,  3,14, 0, 8, 0,  0, 0, 0, 0, 0,  0, 0,13, 4,24,  0, 7, 1, 0, 0,
        0,10,17, 0, 0,  0, 6,18, 0, 0, 22,16, 0,12, 0,  0, 0, 0, 1, 0,  0, 0,13,19, 0,
        0,15,24,13, 7,  0, 0, 0, 4, 0, 10, 0, 0, 3,14,  0,18, 0, 0, 0,  0,22, 2, 6, 0,
        0, 0, 1,21, 0,  0,15, 0,22, 0,  0,19,13, 0, 0,  0, 8, 0, 0, 0,  0,16,18,20, 0,
        0, 5, 0, 0,20,  7,25,19, 0, 0,  0,21,17,18, 2, 10,12,22, 9,15, 11, 0, 0, 0, 0,

        11, 0, 0, 0,22,  8, 0,24, 7, 1,  5, 0, 0, 0,13, 16,17,25,23, 2,  4, 0, 6, 0,19,
        16, 9,12, 0,17,  0,19,22, 0, 0,  0, 0,18,21, 0,  0,20, 6,13, 0,  7, 0, 0,23,11,
        0, 0, 6, 0,21,  9,16, 0, 3, 0,  0,22,20,19, 0,  0, 0, 0,15, 8, 25, 0, 0, 0, 0,
        0, 0,23, 5, 0,  2, 0, 0,11,17,  8, 0, 0, 0,16, 12, 9, 0, 0,21,  0, 3,10, 0, 0,
        0, 0, 0, 0, 0,  6, 0, 0,12, 0,  9, 1,25, 0, 3,  0,11, 0, 0, 7,  0, 0,21, 0, 0,

        0, 0, 9, 0, 0, 23, 0, 5,17, 4, 16, 0,11, 0,22, 18, 2, 0,21,13,  0, 0, 7, 0, 0,
        4, 6, 0, 0, 5,  0, 0, 2, 0, 0,  0,18,21,24, 0,  0,19, 3, 0,12, 23, 0, 0,17, 0,
        0, 0, 0,12,11,  0, 7, 3, 0,24, 17,20,15,13,19,  1, 0, 5, 8, 0,  6, 9, 0, 0, 0,
        0,22, 0, 0,14, 19, 0, 6,16, 0,  0, 8, 9, 7, 0,  0, 0,24, 0, 0,  3, 0, 0, 1,18,
        0, 0,21, 0, 0, 25,13, 0,20, 8, 12, 0,14, 0,10,  9,16,15, 0, 6,  0, 0, 4, 0, 0,

        0, 0,25, 0, 0, 24, 0, 0,18, 0,  4, 0, 3,10, 5,  0, 1, 0, 0,14,  0, 0, 0, 0, 0,
        0, 0, 5, 3, 0, 17, 0, 0,23, 7, 13, 0, 0, 0,18, 19,21, 0, 0,22,  0,11,12, 0, 0,
        0, 0, 0, 0,18, 10, 8, 0, 0, 0,  0,25,23, 2, 0,  0, 5, 0,16,11,  9, 0, 3, 0, 0,
        17,20, 0, 0, 2,  0,22,16, 6, 0,  0, 7,12, 0, 0,  0, 0, 9, 3, 0, 18, 0,23,24,25,
        6, 0, 4, 0,16,  1,11,12,25, 3, 19, 0, 0, 0,21, 17,23, 8, 0,18,  2, 0, 0, 0,14,

        0, 0, 0, 0, 4, 14,24,11,19,23, 21,17,16, 8, 0,  0, 0, 1, 2, 9, 13, 0, 0, 5, 0,
        0, 1,14,23, 0,  0, 0, 0, 9, 0,  0, 0,19, 5, 0,  0,24, 0,12, 0,  0, 8,17, 0, 0,
        0,16,11, 8, 0,  0, 0, 0, 1, 0,  6, 4, 0, 0,23,  0,15, 0, 0, 0, 14,12, 9,10, 0,
        0,21, 3, 0, 0,  0,17, 0, 0, 0,  0,15, 0,25,20,  0, 0, 4,10, 0,  0, 0,16,11, 0,
        0, 0,20, 2, 0, 16, 5, 8, 0, 0,  0, 0, 0, 0, 0,  0, 6, 0,19,25,  0, 0, 0, 3, 0
    ];
}

class Stopwatch {
    private _startTime: number;
    private _endTime: number;
    private _running: boolean = false;
    
    public constructor() {
        
    }
    
    public get elapsedMilliseconds(): number {
        return this._endTime - this._startTime;
    }
    
    public start() {
        if(this._running) {
            return;
        }
        
        if(this._startTime > 0) {
            return;
        }
        
        this._startTime = Date.now();
        this._running = true;
    }
    
    public stop() {
        if(!this._running) {
            return;
        }
        
        this._endTime = Date.now();
        this._running = false;
    }
    
    public reset() {
        this._startTime = 0;
        this._endTime = 0;
        this._running = false;
    }
    
    public restart() {
        this._startTime = Date.now();
        this._endTime = 0;
        this._running = true;
    }
    
    public static startNew(): Stopwatch {
        let sw = new Stopwatch();
        
        sw.start();
        
        return sw;
    }
}