import { ImageDocument } from "./../Model/ImageDocument.ts"
import { ImageDocumentView } from "../View/ImageDocumentView.ts"
import {CanvasView} from "../View/CanvasView.ts";

export class ImageDocumentController {
    private model: ImageDocument;
    private canvasView: CanvasView;
    private view: ImageDocumentView;

    constructor(model: ImageDocument, view: ImageDocumentView, canvasView: CanvasView) {
        this.model = model;
        this.view = view;
        this.canvasView = canvasView;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.view.getCanvas().addEventListener('mousedown', (e) => {
            const rect = this.view.getCanvas().getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.model.startDrag(x, y);
        });

        this.view.getCanvas().addEventListener('mousemove', (e) => {
            if (this.model.isDrag()) {
                this.canvasView.render()
                const rect = this.view.getCanvas().getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.model.drag(x, y);
            }
        });

        this.view.getCanvas().addEventListener('mouseup', () => {
            this.model.endDrag();
        });

    }
}
