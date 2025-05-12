import {Base} from "./Base.ts";

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_radius;
uniform float u_innerRadius;

void main() {
    vec2 center = u_center * u_resolution;           
    float dist = distance(gl_FragCoord.xy, center);
    
    if (dist < u_radius && dist > u_innerRadius) {
        gl_FragColor = vec4(0.5, 0.7, 0.1, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    
    if (dist < 5.) {
        gl_FragColor = vec4(1.0, 0., 0., 1.);
    }
}
`;

class App extends Base {
    private readonly canvas: HTMLCanvasElement;
    private readonly gl: WebGLRenderingContext;
    private program: WebGLProgram;
    private positionBuffer: WebGLBuffer;

    constructor() {
        super();
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gl = this.canvas.getContext('webgl');

        this.initialize();
        this.render();
    }

    private initialize() {
        this.setupShaders(vertexShaderSource, fragmentShaderSource);
        this.setup();
    }

    private setup() {
        this.positionBuffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                1, -1,
                -1,  1,
                -1,  1,
                1, -1,
                1,  1
            ]),
            this.gl.STATIC_DRAW
        );
    }

    private render() {
        const gl = this.gl;

        gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.program);

        const positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
        gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);

        const centerLocation = gl.getUniformLocation(this.program, "u_center");
        gl.uniform2f(centerLocation, 0.5, 0.5);

        const radiusLocation = gl.getUniformLocation(this.program, "u_radius");
        const radius = (this.canvas.height * 2) / 8;
        gl.uniform1f(radiusLocation, radius);

        const innerRadiusLocation = gl.getUniformLocation(this.program, "u_innerRadius");
        const innerRadius = (this.canvas.height * 2) / 16;
        gl.uniform1f(innerRadiusLocation, innerRadius);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(() => this.render());
    }
}

window.addEventListener('load', () => {
    const app = new App();
});