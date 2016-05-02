import { Grid } from './Grid';
import { GridSize } from './GridSize';
import { Solver } from './Solver';
import { Solution, NoSolution } from './Solution';

export class Program {
    private constructor() { }
    
    public static main() {
        Program.solvePuzzle(Program.EasyPuzzle, GridSize.Default,
            (solution: Solution, elapsedMilliseconds: number) => {
                console.log('Easy puzzle solved in ' + elapsedMilliseconds + 'ms!');
                console.log('solution=' + solution.grid.toString());
            }, (elapsedMilliseconds: number) => {
                console.log('A solution could not be found for the easy puzzle!');
            });
            
        Program.solvePuzzle(Program.MediumPuzzle, GridSize.Default,
            (solution: Solution, elapsedMilliseconds: number) => {
                console.log('Medium puzzle solved in ' + elapsedMilliseconds + 'ms!');
                console.log('solution=' + solution.grid.toString());
            }, (elapsedMilliseconds: number) => {
                console.log('A solution could not be found for the medium puzzle!');
            });
            
        Program.solvePuzzle(Program.HardPuzzle, GridSize.Default,
            (solution: Solution, elapsedMilliseconds: number) => {
                console.log('Hard puzzle solved in ' + elapsedMilliseconds + 'ms!');
                console.log('solution=' + solution.grid.toString());
            }, (elapsedMilliseconds: number) => {
                console.log('A solution could not be found for the hard puzzle!');
            });
    }
    
    private static solvePuzzle(puzzle: number[], gridSize: GridSize,
        onSolutionFound: (solution: Solution, elapsedMilliseconds: number) => void,
        onSolutionNotFound: (elapsedMilliseconds: number) => void) {
        
        const sw = Stopwatch.startNew();
        const grid = Grid.load(gridSize, puzzle);
        const solver = new Solver(grid);
        
        let solution = solver.nextSolution(false);
        
        sw.stop();
        
        if(solution instanceof NoSolution) {
            onSolutionNotFound(sw.elapsedMilliseconds);
        }
        else {
            onSolutionFound((solution as Solution), sw.elapsedMilliseconds);
        }
    }
    
    private static readonly EasyPuzzle: number[] = [
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
    
    private static readonly MediumPuzzle: number[] = [
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
    
    private static readonly HardPuzzle: number[] = [
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