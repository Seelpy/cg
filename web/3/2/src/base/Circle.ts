import {Renderable} from "./Renderable";
import {Color} from "./Types";

export class Circle implements Renderable {
    private vertexCount: number;
    private readonly buffer: WebGLBuffer | null = null;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
        private readonly radius: number,
        private readonly segments: number,
        private readonly color: Color,
        private readonly offsetX: number = 0,
        private readonly offsetY: number = 0
    ) {
        this.vertexCount = segments * 3;
        this.buffer = this.gl.createBuffer();

        const vertices = [];
        for (let i = 0; i < segments; i++) {
            const angle1 = (i / segments) * 2 * Math.PI;
            const angle2 = ((i + 1) / segments) * 2 * Math.PI;

            vertices.push(offsetX, offsetY);
            vertices.push(offsetX + Math.cos(angle1) * radius, offsetY + Math.sin(angle1) * radius);
            vertices.push(offsetX + Math.cos(angle2) * radius, offsetY + Math.sin(angle2) * radius);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }

    render() {
        const gl = this.gl;
        const posLoc = gl.getAttribLocation(this.program, 'position');
        const colorLoc = gl.getUniformLocation(this.program, 'u_color');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posLoc);

        gl.uniform4f(colorLoc, this.color.r, this.color.g, this.color.b, this.color.a);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    }
}