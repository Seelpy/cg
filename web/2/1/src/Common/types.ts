// TODO: image data correct name
export interface ImagePosition {
    image: HTMLImageElement;
    x: number;
    y: number;
}

// TODO: более конкретно обозвать
export interface IObserver {
    update(images: Array<ImagePosition>): void
}

// TODO: сделать чтобы отдельно прослушивалось изображение

export interface IObservable {
    addObserver(observer: IObserver): void

    notifyListeners(): void

    removeObserver(): void
}