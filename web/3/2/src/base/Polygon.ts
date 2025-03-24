import { Renderable } from "./Renderable";
import { Color } from "./Types";

export class Polygon implements Renderable {
    private vertexCount: number;
    private readonly buffer: WebGLBuffer | null = null;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
        private readonly points: number[], // Массив точек [x1, y1, x2, y2, ...]
        private readonly color: Color,
    ) {
        // Количество вершин равно количеству точек
        this.vertexCount = points.length / 2;

        // Создаем буфер
        this.buffer = this.gl.createBuffer();

        // Привязываем буфер и передаем данные
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    }

    render() {
        const gl = this.gl;

        // Получаем location атрибута position и uniform цвета
        const posLoc = gl.getAttribLocation(this.program, 'position');
        const colorLoc = gl.getUniformLocation(this.program, 'u_color');

        // Привязываем буфер и настраиваем атрибут
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posLoc);

        // Устанавливаем цвет
        gl.uniform4f(colorLoc, this.color.r, this.color.g, this.color.b, this.color.a);

        // Рисуем фигуру с помощью TRIANGLE_FAN
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertexCount);
    }
}