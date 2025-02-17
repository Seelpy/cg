import { Figure, FigureImpl } from "./Figure.ts";

export type Letter = string;
export type Position = { x: number, y: number };
export type Color = { r: number, g: number, b: number };

export class LetterFactory {
    Get(letter: Letter, position: Position, color: Color): Figure {
        switch (letter) {
            case 'M':
                return this.createLetterM(position, color);
            case 'V':
                return this.createLetterV(position, color);
            case 'G':
                return this.createLetterG(position, color);
            default:
                throw new Error(`Unsupported letter: ${letter}`);
        }
    }

    private createLetterM(position: Position, color: Color): Figure {
        return new FigureImpl(
            [
                { x: 100, y: 100 },
                { x: 100, y: 0 },
                { x: 50, y: 50 },
                { x: 0, y: 0 },
                { x: 0, y: 100 },
                { x: 20, y: 100 },
                { x: 20, y: 30 },
                { x: 50, y: 60 },
                { x: 80, y: 30 },
                { x: 80, y: 100 },
            ],
            position,
            color
        );
    }

    private createLetterV(position: Position, color: Color): Figure {
        return new FigureImpl(
            [
                { x: 0, y: 0 },
                { x: 20, y: 0 },
                { x: 50, y: 80 },
                { x: 80, y: 0 },
                { x: 100, y: 0 },
                { x: 50, y: 100 },
            ],
            position,
            color
        );
    }

    private createLetterG(position: Position, color: Color): Figure {
        return new FigureImpl(
            [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 20 },
                { x: 20, y: 20 },
                { x: 20, y: 100 },
                { x: 0, y: 100 },
            ],
            position,
            color
        );
    }
}
