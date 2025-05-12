import {Base} from "./Base.ts";

const vertexShaderSource = `
attribute float position;
uniform vec2 u_resolution;

float CalcR(float x) {
    return (1.0 + sin(x)) * (1.0 + 0.9 * cos(12.0*x)) * (1.0 + 0.1 * cos(20.0 * x)) * (0.5 + 0.05 * cos(500.0 * x));
}

void main() {
    float p = position;
    float R = CalcR(p);
    
    vec2 pos;
    pos.x = R * cos(p)*0.5;
    pos.y = R * sin(p)*0.65;
    
    pos.y -= 0.5;
    
    gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`;

class App extends Base {
    private readonly canvas: HTMLCanvasElement;
    private positionBuffer: WebGLBuffer;
    private positions: Float32Array<any>;

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
        const pointCount = 1000;
        this.positions = new Float32Array(pointCount);
        for (let i = 0; i < pointCount; i++) {
            this.positions[i] = i * (2 * Math.PI / pointCount);
        }

        this.positionBuffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
    }

    private render() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        const positionAttributeLocation = this.gl.getAttribLocation(this.program, 'position');
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(positionAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.positions.length);

        requestAnimationFrame(() => this.render());
    }
}

window.addEventListener('load', () => {
    const app = new App();
});