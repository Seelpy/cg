import {Renderable} from "../base/Renderable";
import {Line} from "../base/Line";

export class KroshMouth implements Renderable {
    private mouth: Line;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
    ) {
        // Параметры полукруга
        const radius = 1.5; // Радиус полукруга
        const segments = 100; // Количество сегментов (чем больше, тем глаже полукруг)
        const points = this.createSemiCirclePoints(radius, segments);

        // Создаем линию с точками полукруга
        this.mouth = new Line(gl, program, points, {r: 0.2, g: 0.2, b: 0.2, a: .8}, 0.1);
    }

    private createSemiCirclePoints(radius: number, segments: number): number[] {
        const points: number[] = [];

        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI;
            const x = radius * Math.cos(theta);
            const y = -radius * Math.sin(theta);

            points.push(x, y);
        }

        return points;
    }

    render() {
        this.mouth.render();
    }
}