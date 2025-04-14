import {mat4, vec3} from "gl-matrix";
import {Maze} from "./Maze.ts";
import {Player} from "./Player.ts";
import {loadTexture} from "./WebGLUtils.ts";

class MazeRenderer {
    private maze: Maze;

    private cubeVertexBuffer: WebGLBuffer | null = null;
    private cubeIndexBuffer: WebGLBuffer | null = null;
    private cubeIndexCount: number = 0;

    private readonly uMatrixLocation: WebGLUniformLocation;
    private readonly uColorLocation: WebGLUniformLocation;
    private readonly uTextureLocation: WebGLUniformLocation;

    private readonly gl: WebGLRenderingContext;
    private readonly program: WebGLProgram;
    private readonly canvas: HTMLCanvasElement;

    private wallTexture: WebGLTexture;
    private isTextureLoaded = false;

    constructor(maze: Maze, canvas: HTMLCanvasElement, gl: WebGLRenderingContext, program: WebGLProgram) {
        this.maze = maze;
        this.gl = gl;
        this.program = program;
        this.canvas = canvas;

        const matrixLoc = gl.getUniformLocation(this.program, 'u_matrix');
        const colorLoc = gl.getUniformLocation(this.program, 'u_color');
        const textureLoc = gl.getUniformLocation(this.program, 'u_texture');

        if (!matrixLoc || !colorLoc || !textureLoc) {
            throw new Error('Не удалось получить uniform-переменные');
        }

        this.uMatrixLocation = matrixLoc;
        this.uColorLocation = colorLoc;
        this.uTextureLocation = textureLoc;

        // Загрузка текстуры
        this.wallTexture = loadTexture(this.gl, 'f490c22e-48a8-4a33-a651-485460c3b82d.jpeg', () => {
            this.isTextureLoaded = true;
        });

        this.initCubeBuffers();
    }

    private initCubeBuffers() {
        const gl = this.gl;


        // Вершины куба с текстурными координатами
        const vertices = new Float32Array([
            // Позиции (x,y,z) + текстурные координаты (u,v)
            // Задняя грань
            0,0,0, 0,0,
            1,0,0, 1,0,
            1,1,0, 1,1,
            0,1,0, 0,1,

            // Передняя грань
            0,0,1, 0,0,
            1,0,1, 1,1,
            1,1,1, 0,1,
            0,1,1, 1,0
        ]);

        const indices = new Uint16Array([
            // Передняя грань (корректная)
            4,5,6, 4,6,7,

            // Задняя грань (корректная)
            0,2,1, 0,3,2,

            // Левая грань (исправлено направление)
            0,4,7, 0,7,3,

            // Правая грань (корректная)
            1,6,5, 1,2,6,

            // Верхняя грань (исправлено направление)
            3,7,6, 3,6,2,

            // Нижняя грань (исправлено направление)
            0,5,4, 0,1,5
        ]);


        this.cubeIndexCount = indices.length;

        // Создаем и заполняем буфер вершин
        this.cubeVertexBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Создаем и заполняем индексный буфер
        this.cubeIndexBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // Настройка атрибутов
        const positionLocation = gl.getAttribLocation(this.program, 'a_position');
        const texcoordLocation = gl.getAttribLocation(this.program, 'a_texcoord');

        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(texcoordLocation);

        // Шаг в байтах между вершинами (5 значений * 4 байта)
        const stride = 5 * Float32Array.BYTES_PER_ELEMENT;

        // Настройка атрибута позиций
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        gl.vertexAttribPointer(
            positionLocation,
            3,
            gl.FLOAT,
            false,
            stride,
            0
        );

        // Настройка атрибута текстурных координат
        gl.vertexAttribPointer(
            texcoordLocation,
            2,
            gl.FLOAT,
            false,
            stride,
            3 * Float32Array.BYTES_PER_ELEMENT
        );
    }

    public Render(player: Player) {
        if (!this.isTextureLoaded) return;

        const gl = this.gl;
        const projectionMatrix = this.calcProjectionMatrix();
        const viewMatrix = this.calcViewMatrix(player);

        gl.useProgram(this.program);

        // Привязка текстуры
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.wallTexture);
        gl.uniform1i(this.uTextureLocation, 0);

        // Привязка индексного буфера
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeIndexBuffer);

        for (let z = 0; z < this.maze.size; z++) {
            for (let x = 0; x < this.maze.size; x++) {
                if (this.maze.grid[z]![x] === 1) {
                    const dx = x - player.position[0];
                    const dz = z - player.position[2];
                    const distance = Math.sqrt(dx*dx + dz*dz);
                    const maxDistance = this.maze.size * Math.sqrt(2);
                    const normalizedDistance = Math.min(distance / maxDistance, 1);
                    const darkenFactor = 1.0 - Math.pow(normalizedDistance, 0.3);

                    const color = [1.0, 1.0, 1.0, darkenFactor];
                    const mvpMatrix = this.calcFinalMatrix(x, z, projectionMatrix, viewMatrix);

                    gl.uniformMatrix4fv(this.uMatrixLocation, false, mvpMatrix);
                    gl.uniform4fv(this.uColorLocation, color);

                    gl.drawElements(
                        gl.TRIANGLES,
                        this.cubeIndexCount,
                        gl.UNSIGNED_SHORT,
                        0
                    );
                }
            }
        }
    }

    private calcProjectionMatrix() {
        const projectionMatrix = mat4.create();
        const fov = (60 * Math.PI) / 180;
        const aspect = this.canvas.width / this.canvas.height;
        const near = 0.1;
        const far = 100;
        mat4.perspective(projectionMatrix, fov, aspect, near, far);
        return projectionMatrix;
    }

    private calcViewMatrix(player: Player) {
        const viewMatrix = mat4.create();
        const eye = vec3.fromValues(
            player.position[0],
            player.position[1],
            player.position[2]
        );
        const center = vec3.fromValues(
            eye[0] + Math.cos(player.direction),
            eye[1],
            eye[2] + Math.sin(player.direction)
        );
        const up = vec3.fromValues(0, 1, 0);
        mat4.lookAt(viewMatrix, eye, center, up);
        return viewMatrix;
    }

    private calcFinalMatrix(x: number, z: number, projection: mat4, view: mat4) {
        const model = mat4.create();
        mat4.translate(model, model, [x, 0, z]);
        const mvp = mat4.create();
        mat4.multiply(mvp, projection, view);
        mat4.multiply(mvp, mvp, model);
        return mvp;
    }
}

export { MazeRenderer };
