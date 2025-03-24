import {Renderable} from "./Renderable";
import {Color} from "./Types";

export class Line implements Renderable {
    private readonly buffer: WebGLBuffer | null = null;
    private readonly vertexCount: number;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
        private readonly points: number[],
        private readonly color: Color,
        private readonly thickness: number = 1.0 // Толщина линии
    ) {
        this.buffer = this.gl.createBuffer();
        const vertices = this.createLineVertices(points, thickness);
        this.vertexCount = vertices.length / 2; // Количество вершин

        // Загружаем вершины в буфер
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }

    private createLineVertices(points: number[], thickness: number): number[] {
        const vertices: number[] = [];
        const halfThickness = thickness / 2;

        for (let i = 0; i < points.length - 2; i += 2) {
            const x1 = points[i];
            const y1 = points[i + 1];
            const x2 = points[i + 2];
            const y2 = points[i + 3];

            // Вычисляем направление линии
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);

            // Нормализуем направление
            const nx = -dy / length;
            const ny = dx / length;

            // Вычисляем смещение для толщины
            const offsetX = nx * halfThickness;
            const offsetY = ny * halfThickness;

            // Создаем вершины для прямоугольника
            vertices.push(
                x1 - offsetX, y1 - offsetY, // Левая нижняя
                x1 + offsetX, y1 + offsetY, // Правая нижняя
                x2 - offsetX, y2 - offsetY, // Левая верхняя

                x2 - offsetX, y2 - offsetY, // Левая верхняя
                x1 + offsetX, y1 + offsetY, // Правая нижняя
                x2 + offsetX, y2 + offsetY  // Правая верхняя
            );
        }

        return vertices;
    }

    render() {
        const gl = this.gl;
        const posLoc = gl.getAttribLocation(this.program, 'position');
        const colorLoc = gl.getUniformLocation(this.program, 'u_color');

        // Устанавливаем буфер и атрибуты
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posLoc);

        // Устанавливаем цвет
        gl.uniform4f(colorLoc, this.color.r, this.color.g, this.color.b, this.color.a);

        // Рисуем треугольники
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    }
}