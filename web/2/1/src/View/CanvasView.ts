export class CanvasView {
    private readonly width: number;
    private readonly height: number;
    private readonly canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private readonly blackBackgroundSquareColor = '#ccc';
    private readonly whiteBackgroundSquareColor = '#fff';
    private readonly backgroundSquareSize = 10;

    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d')!;

        this.setupCanvas();
        this.render();
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCheckerboard();
    }

    private setupCanvas(): void {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        window.addEventListener('resize', () => {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.render()
        });
    }

    private drawCheckerboard(): void {
        const size = this.backgroundSquareSize;
        for (let i = 0; i < this.canvas.width; i += size) {
            for (let j = 0; j < this.canvas.height; j += size) {
                this.ctx.fillStyle = (i + j) % (size * 2) === 0 ? this.whiteBackgroundSquareColor : this.blackBackgroundSquareColor ;
                this.ctx.fillRect(i, j, size, size);
            }
        }
    }
}