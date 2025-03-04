import { IObserver, ImagePosition } from "./../Common/types.ts";
import { ImageDocument } from "./../Model/ImageDocument.ts";

export class ImageDocumentView implements IObserver {
    private readonly canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private document: ImageDocument;
    private openFileButton: HTMLButtonElement;

    constructor(canvas: HTMLCanvasElement, imageDocument: ImageDocument) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d')!;
        this.document = imageDocument;

        this.openFileButton = document.getElementById('openFileButton') as HTMLButtonElement;

        this.openFileButton.addEventListener('click', () => {
            this.openFileDialog();
        });
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public openFileDialog(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.png,.jpg,.jpeg,.bmp';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                this.document.loadImage(file);
            }
        };
        input.click();
    }

    public update(images: Array<ImagePosition>) {
        images.forEach(img => this.ctx.drawImage(img.image, img.x, img.y));
    }
}