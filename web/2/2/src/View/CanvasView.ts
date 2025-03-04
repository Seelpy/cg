import { IObserver, ImagePosition, Line } from "./../Common/types.ts";
import { ImageCanvas } from "../Model/ImageCanvas.ts";

export class CanvasView implements IObserver {
    private readonly canvas: HTMLCanvasElement;
    private readonly height: number;
    private readonly width: number;
    private readonly ctx: CanvasRenderingContext2D;
    private document: ImageCanvas;

    private openFileButton!: HTMLButtonElement;
    private newFileButton!: HTMLButtonElement;
    private saveButton!: HTMLButtonElement;
    private colorPickerButton!: HTMLButtonElement;

    constructor(width: number, height: number, canvas: HTMLCanvasElement, documentImage: ImageCanvas) {
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d')!;
        this.document = documentImage;

        this.initButtons();
        this.setupCanvas();
        this.render();
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    private initButtons(): void {
        this.openFileButton = document.getElementById('openFileButton') as HTMLButtonElement;
        this.newFileButton = document.getElementById('newButton') as HTMLButtonElement;
        this.saveButton = document.getElementById('saveButton') as HTMLButtonElement;
        this.colorPickerButton = document.getElementById('colorPickerButton') as HTMLButtonElement;

        this.openFileButton.addEventListener('click', () => {
            this.openFileDialog();
        });

        this.newFileButton.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            this.document.createNewImage(canvas);
        });

        this.saveButton.addEventListener('click', () => {
            const name = prompt('Enter name file:');
            if (name) {
                this.saveImage(name);
            } else {
                alert('File name cannot be empty.');
            }
        });

        this.colorPickerButton.addEventListener('click', () => {
            const colorPicker = document.getElementById('color-picker') as HTMLInputElement;
            colorPicker.click();
            colorPicker.addEventListener('input', () => {
                this.document.setDrawingColor(colorPicker.value);
            });
        });
    }

    private setupCanvas(): void {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        window.addEventListener('resize', () => {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.render();
        });
    }

    private openFileDialog(): void {
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

    private render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCheckerboard();
    }

    private renderLines(line: Line): void {
        this.ctx.strokeStyle = line.drawingColor;
        this.ctx.lineWidth = line.brushSize;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(line.lastPosition.x, line.lastPosition.y);
        this.ctx.lineTo(line.position.x, line.position.y);
        this.ctx.stroke();
    }

    private drawCheckerboard(): void {
        const size = 10;
        for (let i = 0; i < this.canvas.width; i += size) {
            for (let j = 0; j < this.canvas.height; j += size) {
                this.ctx.fillStyle = (i + j) % (size * 2) === 0 ? '#ccc' : '#fff';
                this.ctx.fillRect(i, j, size, size);
            }
        }
    }

    private saveImage(name: string): void {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = this.document.getWidth();
        canvas.height = this.document.getHeight();

        ctx.drawImage(
            this.canvas,
            this.document.getInitX(),
            this.document.getInitY(),
            this.document.getWidth(),
            this.document.getHeight(),
            0,
            0,
            this.document.getWidth(),
            this.document.getHeight(),
        );

        const link = document.createElement('a');
        link.download = `${name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    update(image: ImagePosition|null, lines: Array<Line>): void {
        this.render();
        if (image !== null) {
            this.ctx.drawImage(image.image, image.x, image.y);
        }
        lines.forEach(line => this.renderLines(line));
    }
}