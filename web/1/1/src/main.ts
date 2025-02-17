import './style.css'
import {LetterFactory} from "./Letters.ts";
import {Canvas} from "./Canvas.ts";
import {AnimationImpl} from "./FigureAnimation.ts";

function main (): void {
    const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvasElement) {
        console.error("Canvas element not found!");
        return
    }

    const ctx: CanvasRenderingContext2D | null = canvasElement.getContext("2d");
    if (!ctx) {
        console.error("2D context not supported or canvas not properly initialized!");
        return;
    }

    const factory = new LetterFactory();
    const canvas = new Canvas(ctx);
    const animations = [
        new AnimationImpl(factory.Get("M", {x: 10, y: 0}, {r: 255, g: 0, b: 0}), 15, 800, 200),
        new AnimationImpl(factory.Get("V", {x: 200, y: 0}, {r: 0, g: 255, b: 0}), 5, 800, 150),
        new AnimationImpl(factory.Get("G", {x: 390, y: 0}, {r: 0, g: 0, b: 255}), 20, 800, 100)
    ]

    function animate() {
        if (!ctx) {
            console.error("2D context not supported or canvas not properly initialized!");
            return;
        }

        canvas.clear()

        animations.forEach(animation => {
            canvas.drawFigure(animation.next())
        });

        requestAnimationFrame(animate);
    }
    animate();
}

main();