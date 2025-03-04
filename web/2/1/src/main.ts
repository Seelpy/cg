import { ImageDocument } from "./Model/ImageDocument.ts"
import { ImageDocumentView } from "./View/ImageDocumentView.ts"
import { CanvasView } from "./View/CanvasView.ts"
import { ImageDocumentController } from "./Controller/ImageDocumentController.ts"

function main(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    if (canvas) {
        const document = new ImageDocument();
        const canvasView =new CanvasView(window.innerWidth - 100, window.innerHeight - 100, canvas);
        const imageDocumentView = new ImageDocumentView(canvasView.getCanvas(), document);
        document.addObserver(imageDocumentView)
        new ImageDocumentController(document, imageDocumentView, canvasView);
    } else {
        console.error("Canvas element not found!");
    }
}

main();