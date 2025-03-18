// TODO: change name on correct
export interface ImagePosition {
    image: HTMLImageElement;
    x: number;
    y: number;
}

export interface Line {
    lastPosition: Position,
    position: Position,
    drawingColor: string,
    brushSize: number,
}

export interface Position {
    x: number;
    y: number;
}

// TODO: более коррестное имя
export interface IObserver {
    update(images: ImagePosition|null, lines: Array<Line>): void
}

export interface IObservable {
    addObserver(observer: IObserver): void

    notifyListeners(): void

    removeObserver(): void
}