import { FigureImpl } from "./Figure";

// Цвета
const brown = { r: 139, g: 69, b: 19 };
const red = { r: 255, g: 0, b: 0 };
const gray = { r: 100, g: 100, b: 100 };
const blue = { r: 135, g: 206, b: 235 };
const yellow = { r: 255, g: 255, b: 0 };
const green = { r: 34, g: 139, b: 34 };

const roofContour = [
    { x: 400, y: 200 },
    { x: 0, y: 600 },
    { x: 800, y: 600 },
];
const roof = new FigureImpl(roofContour, { x: 100, y: 100 }, red);

const chimneyContour = [
    { x: 640, y: -200 },
    { x: 640, y: 0 },
    { x: 700, y: 0 },
    { x: 700, y: -200 },
];
const chimney = new FigureImpl(chimneyContour, { x: 100, y: 600 }, gray);

const wallContour = [
    { x: 100, y: 600 },
    { x: 100, y: 1000 },
    { x: 700, y: 1000 },
    { x: 700, y: 600 },
];
const walls = new FigureImpl(wallContour, { x: 100, y: 100 }, yellow);

const windowContour = [
    { x: 360, y: 700 },
    { x: 360, y: 800 },
    { x: 460, y: 800 },
    { x: 460, y: 700 },
];
const window = new FigureImpl(windowContour, { x: 100, y: 100 }, blue);

const doorContour = [
    { x: 220, y: 800 },
    { x: 220, y: 1000 },
    { x: 380, y: 1000 },
    { x: 380, y: 800 },
];
const door = new FigureImpl(doorContour, { x: 100, y: 100 }, brown);

const fenceContour = [
    { x: 200, y: 1000 },
    { x: 200, y: 940 },
    { x: 180, y: 940 },
    { x: 180, y: 1000 },
];
const fence1 = new FigureImpl(fenceContour, { x: 400, y: 100}, brown);
const fence2 = new FigureImpl(fenceContour, { x: 430, y: 100}, brown);
const fence3 = new FigureImpl(fenceContour, { x: 460, y: 100}, brown);
const fence4 = new FigureImpl(fenceContour, { x: 490, y: 100}, brown);
const fence5 = new FigureImpl(fenceContour, { x: 520, y: 100}, brown);
const fence6 = new FigureImpl(fenceContour, { x: 550, y: 100}, brown);
const fence7 = new FigureImpl(fenceContour, { x: 580, y: 100}, brown);

const grassContour = [
    { x: 0, y: 1200 },    // Левый верхний угол травы
    { x: 0, y: 1100 },
    { x: 1000, y: 1100 },
    { x: 1000, y: 1200 },
];
const grass = new FigureImpl(grassContour, { x: 0, y: 0 }, green);

export const Home = [roof, chimney, walls, window, door, fence1, fence2, fence3, fence4, fence5, fence6, fence7, grass];