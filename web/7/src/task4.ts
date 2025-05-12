import {Base} from "./Base.ts";

const vertexShaderSource = `
    attribute vec2 aPosition;
    varying vec2 vTexCoord;
    
    void main() {
        // Переворачиваем текстуру по вертикали (1.0 - ...)
        vTexCoord = vec2(aPosition.x * 0.5 + 0.5, 1.0 - (aPosition.y * 0.5 + 0.5));
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision highp float;
    
    varying vec2 vTexCoord;
    uniform sampler2D uTexture1;
    uniform sampler2D uTexture2;
    uniform vec2 uResolution;
    uniform float uTime;
    
    void main() {
        float freq = 8.0;
        float period = 8.0;
        float speed = 2.0;
        float fade = 4.0;
        float displacement = 0.2;
        
        vec2 R = uResolution.xy;
        vec2 U = ((2.0 * gl_FragCoord.xy) - R) / min(R.x, R.y);
        vec2 T = vTexCoord; 
        float D = length(U);
        
        float frame_time = mod(uTime * speed, period);
        float pixel_time = max(0.0, frame_time - D);
        
        float wave_height = (cos(pixel_time * freq) + 1.0) / 2.0;
        float wave_scale = (1.0 - min(1.0, pixel_time / fade));
        float frac = wave_height * wave_scale;
        
        if (mod(uTime * speed, period * 2.0) > period) {
            frac = 1.0 - frac;
        }
        
        vec2 tc = T + ((U / D) * -((sin(pixel_time * freq) / fade) * wave_scale) * displacement);
       
        gl_FragColor = mix(
            texture2D(uTexture1, tc),
            texture2D(uTexture2, tc),
            frac);
    }
`;

class App extends Base {
    private canvas: HTMLCanvasElement;
    private time = 0;
    private animationId = 0;
    private textures: WebGLTexture[] = [];

    constructor(canvas: HTMLCanvasElement) {
        super()
        this.canvas = canvas;
        this.canvas.width = 1000;
        this.canvas.height = 800;
        this.gl = this.canvas.getContext('webgl')!;
        this.setupShaders(vertexShaderSource, fragmentShaderSource);
        this.initGeometry();
        this.loadTextures().then(() => {
            this.startAnimation();
        });
    }

    private initGeometry(): void {
        const vertices = new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0,  1.0,
            1.0,  1.0
        ]);

        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const positionLocation = this.gl.getAttribLocation(this.program, "aPosition");
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    }

    private async loadTextures(): Promise<void> {
        const urls = [
            '/1.jpeg',
            '/2.jpg'
        ];

        this.textures = await Promise.all(urls.map(url => this.loadTexture(url)));
    }

    private async loadTexture(url: string): Promise<WebGLTexture> {
        return new Promise((resolve, reject) => {
            const texture = this.gl.createTexture()!;
            const image = new Image();
            image.crossOrigin = 'Anonymous';

            image.onload = () => {
                this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                resolve(texture);
            };

            image.onerror = () => {
                reject(new Error(`Failed to load texture: ${url}`));
            };

            image.src = url;
        });
    }

    private render(): void {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        this.gl.uniform2f(this.gl.getUniformLocation(this.program, 'uResolution'), this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.gl.getUniformLocation(this.program, 'uTime'), this.time);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'uTexture1'), 0);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[1]);
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'uTexture2'), 1);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    private startAnimation(): void {
        const animate = () => {
            this.time += 0.01;
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }
}

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
new App(canvas);