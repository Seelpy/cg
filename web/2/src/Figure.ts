// Point.ts
export interface Point {
    x: number;
    y: number;
}

// RGB.ts
export interface RGB {
    r: number;
    g: number;
    b: number;
}

// Contour.ts
export type Contour = Point[];

// Figure.ts
export interface Figure {
    getContour(): Contour;
    getPosition(): Point;
    getColor(): RGB;
    setPosition(position: Point): void;
}

export class FigureImpl implements Figure {
    private contour: Contour;
    private position: Point;
    private color: RGB;

    constructor(contour: Contour, position: Point, color: RGB) {
        this.contour = contour;
        this.position = position;
        this.color = color;
    }

    getContour(): Contour {
        return this.contour;
    }

    getPosition(): Point {
        return this.position;
    }

    getColor(): RGB {
        return this.color;
    }

    setPosition(position: Point): void {
        this.position = position;
    }
}
