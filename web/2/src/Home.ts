import { FigureImpl } from "./Figure";

// Цвета
const brown = { r: 139, g: 69, b: 19 }; // Коричневый для забора и двери
const red = { r: 255, g: 0, b: 0 }; // Красный для крыши
const gray = { r: 100, g: 100, b: 100 }; // Серый для трубы и дыма
const blue = { r: 135, g: 206, b: 235 }; // Голубой для окна
const yellow = { r: 255, g: 255, b: 0 }; // Желтый для стен
const green = { r: 34, g: 139, b: 34 }; // Зеленый для травы

// Функция инверсии координат по оси Y
const invertY = (points) => points.map(({ x, y }) => ({ x, y: 1000 - y }));

// Крыша (треугольник)
const roofContour = invertY([
    { x: 400, y: 800 }, // Верхушка крыши
    { x: 0, y: 400 },   // Левый край крыши
    { x: 800, y: 400 }, // Правый край крыши
]);
const roof = new FigureImpl(roofContour, { x: 100, y: 100 }, red);

// Труба (прямоугольник)
const chimneyContour = invertY([
    { x: 640, y: 1200 }, // Верхний левый угол трубы
    { x: 640, y: 1000 }, // Нижний левый угол трубы
    { x: 700, y: 1000 }, // Нижний правый угол трубы
    { x: 700, y: 1200 }, // Верхний правый угол трубы
]);
const chimney = new FigureImpl(chimneyContour, { x: 100, y: 600 }, gray);

// Стены (прямоугольник)
const wallContour = invertY([
    { x: 100, y: 400 }, // Верхний левый угол стены
    { x: 100, y: 0 },   // Нижний левый угол стены
    { x: 700, y: 0 },   // Нижний правый угол стены
    { x: 700, y: 400 }, // Верхний правый угол стены
]);
const walls = new FigureImpl(wallContour, { x: 100, y: 100 }, yellow);

// Окно (квадрат)
const windowContour = invertY([
    { x: 360, y: 300 }, // Верхний левый угол окна
    { x: 360, y: 200 }, // Нижний левый угол окна
    { x: 460, y: 200 }, // Нижний правый угол окна
    { x: 460, y: 300 }, // Верхний правый угол окна
]);
const window = new FigureImpl(windowContour, { x: 100, y: 100 }, blue);

// Дверь (прямоугольник)
const doorContour = invertY([
    { x: 220, y: 200 }, // Верхний левый угол двери
    { x: 220, y: 0 },   // Нижний левый угол двери
    { x: 380, y: 0 },   // Нижний правый угол двери
    { x: 380, y: 200 }, // Верхний правый угол двери
]);
const door = new FigureImpl(doorContour, { x: 100, y: 100 }, brown);

// Забор (один элемент)
const fenceContour = invertY([
    { x: 200, y: 0 },
    { x: 200, y: 160 },
    { x: 180, y: 160 },
    { x: 180, y: 0 },
]);
const fence1 = new FigureImpl(fenceContour, { x: 400, y: 100}, brown);
const fence2 = new FigureImpl(fenceContour, { x: 430, y: 100}, brown);
const fence3 = new FigureImpl(fenceContour, { x: 460, y: 100}, brown);
const fence4 = new FigureImpl(fenceContour, { x: 490, y: 100}, brown);
const fence5 = new FigureImpl(fenceContour, { x: 520, y: 100}, brown);
const fence6 = new FigureImpl(fenceContour, { x: 550, y: 100}, brown);
const fence7 = new FigureImpl(fenceContour, { x: 580, y: 100}, brown);

const grassContour = invertY([
    { x: 0, y: -200 },    // Левый верхний угол травы
    { x: 0, y: -100 },      // Левый нижний угол травы
    { x: 1000, y: -100 },   // Правый нижний угол травы
    { x: 1000, y: -200 }, // Правый верхний угол травы
]);
const grass = new FigureImpl(grassContour, { x: 0, y: 0 }, green);

// Итоговый массив объектов дома
export const Home = [roof, chimney, walls, window, door, fence1, fence2, fence3, fence4, fence5, fence6, fence7, grass];