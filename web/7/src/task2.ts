const vertexShaderSource = `
#version 300 es
precision highp float;

layout(location = 0) in vec3 position;

uniform float progress;
uniform mat4 projection_view;

void main()
{
    vec3 initial_position = vec3(position.x, position.y, position.x * position.x + position.y * position.y);
    vec3 final_position = vec3(position.x, position.y, position.x * position.x - position.y * position.y);
    vec3 morphed_position = mix(initial_position, final_position, progress);

    gl_Position = projection_view * vec4(morphed_position, 1.0);
}
`;

const fragmentShaderSource = `
#version 300 es
precision highp float;

out vec4 color;

void main()
{
    color = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

class MorphingApp {
    private readonly canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private positionBuffer: WebGLBuffer;
    private progress: number = 0.0;
    private direction: number = 1;
    private speed: number = 0.005;
    private projectionViewMatrix: Float32Array;
    private animationId: number = 0;

    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const gl = this.canvas.getContext('webgl2');
        if (!gl) {
            throw new Error('WebGL2 not supported');
        }
        this.gl = gl;

        this.initialize();
        this.startAnimation();
    }

    private initialize() {
        this.setupShaders();
        this.setupGeometry();
        this.setupMatrices();
    }

    private setupShaders() {
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.program = this.gl.createProgram()!;
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Program linking error:', this.gl.getProgramInfoLog(this.program));
        }
    }

    private compileShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            throw new Error('Shader compilation failed');
        }

        return shader;
    }

    private setupGeometry() {
        this.positionBuffer = this.gl.createBuffer()!;
    }

    private setupMatrices() {
        const viewMatrix = this.multiplyMatrices(
            this.rotateYMatrix(45),
            this.translateZMatrix(-3.5),
            this.translateXMatrix(-2.5)
        );

        const projectionMatrix = this.perspectiveMatrix(
            45,
            this.canvas.width / this.canvas.height,
            0.1,
            100
        );

        this.projectionViewMatrix = this.multiplyMatrices(projectionMatrix, viewMatrix);
    }

    private render() {
        const gl = this.gl;

        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        gl.useProgram(this.program);

        // Set uniforms
        const progressLocation = gl.getUniformLocation(this.program, "progress");
        gl.uniform1f(progressLocation, this.progress);

        const projectionViewLocation = gl.getUniformLocation(this.program, "projection_view");
        gl.uniformMatrix4fv(projectionViewLocation, false, this.projectionViewMatrix);

        this.drawSurface();
    }

    private drawSurface() {
        const gl = this.gl;
        const rows = 100;
        const cols = 100;

        const positions: number[] = [];

        for (let i = 0; i < rows - 1; i++) {
            for (let j = 0; j < cols - 1; j++) {
                const x0 = -1.0 + 2.0 * i / (rows - 1);
                const y0 = -1.0 + 2.0 * j / (cols - 1);

                const x1 = -1.0 + 2.0 * (i + 1) / (rows - 1);
                const y1 = -1.0 + 2.0 * j / (cols - 1);

                const x2 = -1.0 + 2.0 * i / (rows - 1);
                const y2 = -1.0 + 2.0 * (j + 1) / (cols - 1);

                // First triangle
                positions.push(x0, y0, 0);
                positions.push(x1, y1, 0);

                // Second triangle
                positions.push(x1, y1, 0);
                positions.push(x2, y2, 0);

                // Third triangle
                positions.push(x2, y2, 0);
                positions.push(x0, y0, 0);
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const positionAttributeLocation = gl.getAttribLocation(this.program, "position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINES, 0, positions.length / 3);
    }

    private startAnimation() {
        const animate = () => {
            this.updateProgress();
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    private updateProgress() {
        this.progress += this.direction * this.speed;
        if (this.progress >= 1.0) {
            this.direction = -1;
        } else if (this.progress <= 0.0) {
            this.direction = 1;
        }
    }

    private perspectiveMatrix(fov: number, aspect: number, near: number, far: number): Float32Array {
        const f = 1.0 / Math.tan(fov * Math.PI / 360);
        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) / (near - far), 2 * far * near / (near - far),
            0, 0, -1, 0
        ]);
    }

    private rotateYMatrix(angle: number): Float32Array {
        const rad = angle * Math.PI / 180;
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        return new Float32Array([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
    }

    private translateZMatrix(z: number): Float32Array {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, z,
            0, 0, 0, 1
        ]);
    }

    private translateXMatrix(x: number): Float32Array {
        return new Float32Array([
            1, 0, 0, x,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    private multiplyMatrices(a: Float32Array, b: Float32Array, ...matrices: Float32Array[]): Float32Array {
        let result = this.multiplyTwoMatrices(a, b);
        for (const matrix of matrices) {
            result = this.multiplyTwoMatrices(result, matrix);
        }
        return result;
    }

    private multiplyTwoMatrices(a: Float32Array, b: Float32Array): Float32Array {
        const result = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i * 4 + j] = 0;
                for (let k = 0; k < 4; k++) {
                    result[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
                }
            }
        }
        return result;
    }

    public resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.setupMatrices();
    }

    public destroy() {
        cancelAnimationFrame(this.animationId);
        this.gl.deleteProgram(this.program);
        this.gl.deleteBuffer(this.positionBuffer);
        document.body.removeChild(this.canvas);
    }
}

window.addEventListener('load', () => {
    const app = new MorphingApp();

    window.addEventListener('resize', () => {
        app.resize();
    });
});