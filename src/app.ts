import { Program } from './Program';
import * as Puzzles from './Puzzles';
import { GridSize } from './GridSize';
import { GridSizeFactory } from './GridSizeFactory';

Program.main([
    { values: Puzzles.Puzzle9x9.EasyPuzzle, size: GridSize.Default, label: 'Easy' },
    { values: Puzzles.Puzzle9x9.MediumPuzzle, size: GridSize.Default, label: 'Medium' },
    { values: Puzzles.Puzzle9x9.HardPuzzle, size: GridSize.Default, label: 'Hard' },
    
    { values: Puzzles.Puzzle16x16.UnknownDifficultyPuzzle, size: GridSizeFactory.create(4, 4), label: 'Unknown Difficulty' }
]);