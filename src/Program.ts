import { Grid } from './Grid';
import { GridSize } from './GridSize';
import { Solver } from './Solver';
import { Solution, NoSolution } from './Solution';

export class Program {
    private constructor() { }
    
    public static main(puzzles: { values: number[], size: GridSize, label: string }[]) {
        for(let item of puzzles) {
            Program.solvePuzzle(item.values, item.size,
                (solution: Solution, elapsedMilliseconds: number) => {
                    console.log(item.size.size + 'x' + item.size.size + ' ' + item.label + ' puzzle solved in ' + elapsedMilliseconds + 'ms!');
                    console.log('solution=' + solution.grid.toString());
                }, (elapsedMilliseconds: number) => {
                    console.log('A solution could not be found for the ' + 
                        item.size.size + 'x' + item.size.size + ' ' + item.label + ' puzzle!');
                });
        }
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