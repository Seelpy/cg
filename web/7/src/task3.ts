import {Base} from "./Base.ts";

const vertexShaderSource = `#version 300 es
precision highp float;

in vec2 position;
uniform float progress;
uniform mat4 projection_view;

void main() {
    vec3 initial = vec3(position, position.x * position.x + position.y * position.y);
    vec3 final = vec3(position, position.x * position.x - position.y * position.y);
    vec3 morphed = mix(initial, final, progress);
    
    gl_Position = projection_view * vec4(morphed, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 color;

void main() {
    color = vec4(1.0);
}
`;

class App extends Base {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private vertexBuffer: WebGLBuffer;
    private progressLocation: WebGLUniformLocation;
    private projectionViewLocation: WebGLUniformLocation;
    private progress: number = 0;
    private direction: number = 1;
    private rotationX: number = 0;
    private rotationY: number = 30;
    private isMouseDown: boolean = false;
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;

    constructor() {
        super()
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.canvas.width = 1600;
        this.canvas.height = 900;

        this.gl = this.canvas.getContext('webgl2')!;
        this.setupShaders(vertexShaderSource, fragmentShaderSource);

        this.progressLocation = this.gl.getUniformLocation(this.program, 'progress');
        this.projectionViewLocation = this.gl.getUniformLocation(this.program, 'projection_view');

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));

        this.initGeometry();
        this.initMatrices();
        this.animate();
    }

    private onMouseDown(e: MouseEvent) {
        this.isMouseDown = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }

    private onMouseUp() {
        this.isMouseDown = false;
    }

    private onMouseMove(e: MouseEvent) {
        if (!this.isMouseDown) return;

        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;

        this.rotationY += deltaX * 0.5;
        this.rotationX = Math.min(89, Math.max(-89, this.rotationX + deltaY * 0.5));

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;

        this.updateViewMatrix();
    }

    private initGeometry() {
        const vertices: number[] = [];
        const rows = 100, cols = 100;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x0 = -1 + 2 * i / (rows - 1);
                const y0 = -1 + 2 * j / (cols - 1);

                if (i < rows - 1) {
                    const x1 = -1 + 2 * (i + 1) / (rows - 1);
                    vertices.push(x0, y0, x1, y0);
                }
                if (j < cols - 1) {
                    const y1 = -1 + 2 * (j + 1) / (cols - 1);
                    vertices.push(x0, y0, x0, y1);
                }
            }
        }

        this.vertexBuffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    }

    private updateViewMatrix() {
        const view = this.translate(0, 0, -5.5)
            .multiply(this.rotateY(this.rotationY))
            .multiply(this.rotateX(this.rotationX));

        const projection = this.ortho(
            -2, 2,
            -2 * this.canvas.height/this.canvas.width,
            2 * this.canvas.height/this.canvas.width,
            0.1, 10
        );

        const pv = projection.multiply(view);
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(this.projectionViewLocation, false, pv.data);
    }

    private initMatrices() {
        const view = this.translate(0, 0, -5.5).multiply(this.rotateY(30));
        const projection = this.ortho(
            -2, 2,
            -2 * this.canvas.height/this.canvas.width,
            2 * this.canvas.height/this.canvas.width,
            0.1, 10
        );
        const pv = projection.multiply(view);

        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(this.projectionViewLocation, false, pv.data);
    }

    private animate() {
        this.progress += this.direction * 0.005;

        if (this.progress >= 1.0 || this.progress <= 0.0) {
            this.direction *= -1;
        }

        this.gl.uniform1f(this.progressLocation, this.progress);
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    private draw() {
        this.gl.clearColor(0.2, 0.2, 0.2, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.useProgram(this.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

        const posAttrib = this.gl.getAttribLocation(this.program, 'position');
        this.gl.vertexAttribPointer(posAttrib, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(posAttrib);

        this.gl.drawArrays(this.gl.LINES, 0, 39600);
    }

    // TODO: матрица перспективного проецирования
    private ortho(left: number, right: number, bottom: number,
                  top: number, near: number, far: number): Matrix4 {
        const tx = -(right + left) / (right - left);
        const ty = -(top + bottom) / (top - bottom);
        const tz = -(far + near) / (far - near);

        return new Matrix4([
            2/(right-left), 0, 0, tx,
            0, 2/(top-bottom), 0, ty,
            0, 0, -2/(far-near), tz,
            0, 0, 0, 1
        ]);
    }

    private rotateY(deg: number): Matrix4 {
        const rad = deg * Math.PI / 180;
        const c = Math.cos(rad), s = Math.sin(rad);
        return new Matrix4([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
    }

    private rotateX(deg: number): Matrix4 {
        const rad = deg * Math.PI / 180;
        const c = Math.cos(rad), s = Math.sin(rad);
        return new Matrix4([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]);
    }

    private translate(x: number, y: number, z: number): Matrix4 {
        return new Matrix4([
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        ]);
    }
}

class Matrix4 {
    data: Float32Array<any>;

    constructor(data: number[]) {
        this.data = new Float32Array(16);
        for (let i = 0; i < 16; i++) this.data[i] = data[i];
    }

    multiply(m: Matrix4): Matrix4 {
        const result = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i * 4 + j] =
                    this.data[i * 4] * m.data[j] +
                    this.data[i * 4 + 1] * m.data[j + 4] +
                    this.data[i * 4 + 2] * m.data[j + 8] +
                    this.data[i * 4 + 3] * m.data[j + 12];
            }
        }
        return new Matrix4(Array.from(result));
    }
}

window.addEventListener('load', () => {
    const app = new App();
});
