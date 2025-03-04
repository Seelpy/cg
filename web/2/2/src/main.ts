import { ImageCanvas } from "./Model/ImageCanvas.ts"
import { CanvasView } from "./View/CanvasView.ts"
import { CanvasController } from "./Controller/CanvasController.ts"

function main(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const colorPicker = document.getElementById('color-picker') as HTMLInputElement;

    if (canvas && colorPicker) {
        const imageCanvas = new ImageCanvas(1000, 800);
        const view = new CanvasView(window.innerWidth, window.innerHeight, canvas, imageCanvas);
        imageCanvas.addObserver(view)
        new CanvasController(imageCanvas, view);
    } else {
        console.error("Canvas or color picker element not found!");
    }
}

main();