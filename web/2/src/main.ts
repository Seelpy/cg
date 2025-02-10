import './style.css'
import {Canvas} from "./Canvas.ts";
import {Home} from "./Home.ts";

function main (): void {
    const canvasElement = document.getElementById("canvas") as HTMLCanvasElement; // Явное указание типа
    if (!canvasElement) {
        console.error("Canvas element not found!");
        return
    }

    const ctx: CanvasRenderingContext2D | null = canvasElement.getContext("2d"); // Получаем 2D контекст
    if (!ctx) {
        console.error("2D context not supported or canvas not properly initialized!");
        return;
    }

    const canvas = new Canvas(ctx);

    function animate() {
        if (!ctx) {
            console.error("2D context not supported or canvas not properly initialized!");
            return;
        }

        canvas.clear()

        Home.forEach(figure => {
            canvas.drawFigure(figure)
        });

        requestAnimationFrame(animate);
    }
    animate();
}

main();