import {ImagePosition, IObservable, IObserver} from "./../Common/types.ts"

// TODO: Отделня сущность для перемещения изображений
export class ImageDocument implements IObservable {
    private images: Array<ImagePosition> = [];
    private isDragging: boolean = false;
    private dragStart: { x: number; y: number } = {x: 0, y: 0};
    private draggedImageIndex: number | null = null;
    private observers: Array<IObserver> = [];

    public loadImage(file: File): void {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                this.images.push({image: img, x: 0, y: 0});
                this.notifyListeners();
            };
        };
        reader.readAsDataURL(file);
    }

    public startDrag(x: number, y: number): void {
        for (let i = this.images.length - 1; i >= 0; i--) {
            const img = this.images[i];

            if (ImageDocument.inImage(img, x, y)) {
                this.isDragging = true;
                this.draggedImageIndex = i;
                this.dragStart.x = x - img.x;
                this.dragStart.y = y - img.y;
                break;
            }
        }
    }

    public drag(x: number, y: number): void {
        if (this.isDragging && this.draggedImageIndex !== null) {
            const img = this.images[this.draggedImageIndex];
            img.x = x - this.dragStart.x;
            img.y = y - this.dragStart.y;
            this.notifyListeners();
        }
    }

    public endDrag(): void {
        this.isDragging = false;
        this.draggedImageIndex = null;
    }

    public isDrag(): boolean {
        return this.isDragging;
    }

    public addObserver(observer: IObserver): void {
        this.observers.push(observer)
    }

    public removeObserver(): void {
        this.observers = []
    }

    private notifyListeners(): void {
        this.observers.forEach(observer =>
            observer.update(this.images)
        )
    }

    static inImage(image: ImagePosition, x: number, y: number): boolean {
        const imgWidth = image.image.width;
        const imgHeight = image.image.height;
        return x >= image.x &&
            x <= image.x + imgWidth &&
            y >= image.y &&
            y <= image.y + imgHeight
    }
}