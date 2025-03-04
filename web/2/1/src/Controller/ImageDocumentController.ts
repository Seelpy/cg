import { ImageDocument } from "./../Model/ImageDocument.ts"
import { ImageDocumentView } from "../View/ImageDocumentView.ts"

export class ImageDocumentController {
    private model: ImageDocument;
    private view: ImageDocumentView;

    constructor(model: ImageDocument, view: ImageDocumentView) {
        this.model = model;
        this.view = view;
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
