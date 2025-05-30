import { IObservable, ImagePosition, Line, IObserver } from "./../Common/types.ts"

export class ImageCanvas implements IObservable {
    private readonly INIT_POSITION_X = window.innerWidth / 3 - 100;
    private readonly INIT_POSITION_Y = window.innerHeight / 3 - 250;
    private readonly width: number = 0;
    private readonly height: number = 0;
    private image: ImagePosition|null = null
    private lines: Array<Line> = [];
    private isDrawing: boolean = false;
    private drawingColor: string = '#000000';
    private brushSize: number = 5;
    private lastX: number = 0;
    private lastY: number = 0;
    private observers: Array<IObserver> = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public setDrawingColor(drawingColor: string): void {
        this.drawingColor = drawingColor;
    }

    public loadImage(file: File): void {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                this.image = {image: img, x: this.INIT_POSITION_X, y: this.INIT_POSITION_Y};
                this.notifyListeners();
            };
        };
        reader.readAsDataURL(file);
    }

    public createNewImage(canvas: HTMLCanvasElement): void {
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, this.width, this.height);
        const img = new Image();
        img.src = canvas.toDataURL()
        img.onload = () => {
            this.lines = [];
            this.image = {image: img, x: this.INIT_POSITION_X, y: this.INIT_POSITION_Y};
            this.notifyListeners();
        };
    }

    public startDrawing(x: number, y: number): void {
        this.isDrawing = true;
        this.lastX = x;
        this.lastY = y;
    }

    public draw(x: number, y: number): void {
        if (!this.isDrawing) {
            return;
        }
        if (this.isOutCanvas(x, y)) {
            return;
        }
        this.lines.push(this.makeLine(x, y));
        this.notifyListeners();
        this.lastX = x;
        this.lastY = y;
    }

    public endDrawing(): void {
        this.isDrawing = false;
    }

    public isDraw(): boolean {
        return this.isDrawing && this.image != null;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getInitX(): number {
        return this.INIT_POSITION_X;
    }

    public getInitY(): number {
        return this.INIT_POSITION_Y;
    }

    public addObserver(observer: IObserver): void {
        this.observers.push(observer)
    }

    public removeObserver(): void {
        this.observers = []
    }

    private notifyListeners(): void {
        this.observers.forEach(observer =>
            observer.update(this.image, this.lines)
        )
    }

    private makeLine(x: number, y: number): Line {
        return {
            lastPosition: {
                x: this.lastX,
                y: this.lastY,
            },
            position: {
                x: x,
                y: y,
            },
            drawingColor: this.drawingColor,
            brushSize: this.brushSize,
        };
    }

    private isOutCanvas(x: number, y: number): boolean {
        return x < this.INIT_POSITION_X || y < this.INIT_POSITION_Y || x > this.INIT_POSITION_X + this.width || y > this.INIT_POSITION_Y + this.height;
    }
}
