export enum MazeElementType {
    EMPTY,
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX
}

class Maze {
    size: number
    grid: number[][]

    constructor() {
        this.size = 16
        this.grid = this.getFixedMaze()
    }

    isWall(x: number, z: number): boolean {
        const buffer = 0.15; // Буферное расстояние

        const positions = [
            [x + buffer, z],       // право
            [x - buffer, z],       // лево
            [x, z + buffer],       // верх
            [x, z - buffer],       // низ
            [x + buffer, z + buffer], // диагонали
            [x - buffer, z - buffer],
            [x + buffer, z - buffer],
            [x - buffer, z + buffer]
        ];

        return positions.some(([checkX, checkZ]) => {
            const gridX = Math.floor(checkX);
            const gridZ = Math.floor(checkZ);
            return this.grid[gridZ]?.[gridX] !== MazeElementType.EMPTY;
        });
    }
    // TODO: сделатб блолее удобный для редактирования
    private getFixedMaze(): MazeElementType[][] {
        return [
            [MazeElementType.ONE, MazeElementType.TWO, MazeElementType.THREE, MazeElementType.FOUR, MazeElementType.FIVE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE],
            [MazeElementType.ONE, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.TWO],
            [MazeElementType.SIX, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.SIX, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.SIX, MazeElementType.TWO],
            [MazeElementType.FIVE, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.TWO],
            [MazeElementType.FOUR, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.TWO, MazeElementType.FOUR, MazeElementType.FOUR, MazeElementType.FOUR, MazeElementType.FOUR, MazeElementType.FOUR, MazeElementType.FOUR, MazeElementType.FOUR, MazeElementType.FOUR, MazeElementType.FOUR, MazeElementType.FOUR, MazeElementType.FOUR],
            [MazeElementType.THREE, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.THREE, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX],
            [MazeElementType.TWO, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.EMPTY, MazeElementType.FOUR, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.FIVE],
            [MazeElementType.TWO, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX],
            [MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FOUR, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.SIX],
            [MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FOUR, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX],
            [MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FOUR, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.TWO, MazeElementType.TWO, MazeElementType.TWO, MazeElementType.TWO, MazeElementType.TWO, MazeElementType.TWO, MazeElementType.TWO, MazeElementType.TWO],
            [MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FOUR, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.TWO, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX],
            [MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FOUR, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.TWO, MazeElementType.SIX, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE],
            [MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FOUR, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.TWO, MazeElementType.SIX, MazeElementType.THREE, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.FOUR],
            [MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FOUR, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.TWO, MazeElementType.SIX, MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.FOUR],
            [MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FOUR, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.TWO, MazeElementType.SIX, MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.FOUR],
            [MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FOUR, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.ONE, MazeElementType.SIX, MazeElementType.TWO, MazeElementType.SIX, MazeElementType.THREE, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.FOUR],
            [MazeElementType.THREE, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.FIVE, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.TWO, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX, MazeElementType.SIX],
            [MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE, MazeElementType.THREE]
        ];
    }
}

export {
    Maze,
}