import { Program } from './Program';
import * as Puzzles from './Puzzles';
import { GridSize } from './GridSize';

Program.main([
    { values: Puzzles.Puzzle9x9.DevilPuzzle, size: GridSize.Default, label: 'Devil' }
    //{ values: Puzzles.Puzzle9x9.EmptyPuzzle, size: GridSize.Default, label: 'Empty' },
    //{ values: Puzzles.Puzzle9x9.EasyPuzzle, size: GridSize.Default, label: 'Easy' },
    //{ values: Puzzles.Puzzle9x9.MediumPuzzle, size: GridSize.Default, label: 'Medium' },
    //{ values: Puzzles.Puzzle9x9.HardPuzzle, size: GridSize.Default, label: 'Hard' },
    
    //{ values: Puzzles.Puzzle16x16.UnknownDifficultyPuzzle, size: new GridSize(4, 4), label: 'Unknown Difficulty' }
]);