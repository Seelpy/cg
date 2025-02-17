import { Figure } from './Figure';

export interface FigureAnimation {
    next(): Figure;
}

export class AnimationImpl implements FigureAnimation {
    private figure: Figure;
    private speed: number;
    private maxY: number;
    private minY: number;
    private time: number;
    private duration: number;
    private initialVelocity: number;
    private gravity: number;

    constructor(figure: Figure, speed: number, maxY: number, minY: number) {
        this.figure = figure;
        this.speed = speed;
        this.maxY = maxY;
        this.minY = minY;
        this.time = 0;
        this.duration = 1000;
        this.gravity = 9.8 * 100;
        this.initialVelocity = Math.sqrt(2 * this.gravity * (this.maxY - this.minY));
    }

    next(): Figure {
        const t = this.time / 1000;
        let newY = this.maxY - this.initialVelocity * t + 0.5 * this.gravity * t * t;

        newY = Math.max(newY, this.minY);

        const position = this.figure.getPosition();
        position.y = newY;
        this.figure.setPosition(position);

        this.time += this.speed;

        if (newY >= this.maxY && this.time >= this.duration) {
            this.time = 0;
        }

        return this.figure;
    }
}
