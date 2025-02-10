// Animation.ts
import { Figure } from './Figure.ts';
import { Point } from './Point';

export interface Animation {
    next(): Figure;
}

export function createAnimation(
    figure: Figure,
    speed: number,
    maxY: number,
    minY: number
): Animation {
    return new AnimationImpl(figure, speed, maxY, minY);
}

class AnimationImpl implements Animation {
    private figure: Figure;
    private speed: number;
    private maxY: number;
    private minY: number;
    private time: number;
    private decayRate: number;
    private duration: number; // Duration of one full jump (in seconds)

    constructor(figure: Figure, speed: number, maxY: number, minY: number) {
        this.figure = figure;
        this.speed = speed;
        this.maxY = maxY;
        this.minY = minY;
        this.time = 0;
        this.duration = 1; // Default duration for one jump
        this.decayRate = 0.5; // Default decay rate
    }

    next(): Figure {
        const t = (this.time / this.duration) % 1.0;

        // Decay based on elapsed time
        const decay = Math.exp(-this.decayRate * this.time / this.duration);

        // Calculate the new Y position considering decay
        const newY =
            this.minY +
            (this.maxY - this.minY) * (-4 * (t - 0.5) * (t - 0.5) + 1) * decay;

        // Increment time by speed
        this.time += this.speed;

        // Reset time if it exceeds a threshold (5 in the original code)
        if (this.time > 5) {
            this.time = 0;
        }

        // Update the figure's position
        const position = this.figure.getPosition();
        position.y = newY; // Update Y coordinate
        this.figure.setPosition(position);

        return this.figure;
    }
}
