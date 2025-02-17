import { Figure } from './Figure.ts';

export interface CanvasInterface {
    clear(): void;
    drawFigure(figure: Figure): void;
}

export class Canvas implements CanvasInterface {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawFigure(figure: Figure): void {
        const contour = figure.getContour();
        const position = figure.getPosition();
        const color = figure.getColor();

        this.ctx.save();

        this.ctx.beginPath();
        if (contour.length > 0) {
            this.ctx.moveTo(contour[0].x + position.x, contour[0].y  + position.y);
            for (let i = 1; i < contour.length; i++) {
                this.ctx.lineTo(contour[i].x  + position.x, contour[i].y  + position.y);
            }
            this.ctx.closePath();
        }

        this.ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        this.ctx.fill();

        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
}