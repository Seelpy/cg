import {mat4, vec3} from "gl-matrix";
import {Maze} from "./Maze.ts";
import {Player} from "./Player.ts";

class MazeRenderer {
    private maze: Maze

    private cubeVertexBuffer: WebGLBuffer | null = null
    private cubeIndexBuffer: WebGLBuffer | null = null
    private cubeIndexCount: number = 0

    private readonly uMatrixLocation: WebGLUniformLocation
    private readonly uColorLocation: WebGLUniformLocation

    private readonly gl: WebGLRenderingContext
    private readonly program: WebGLProgram

    private readonly canvas: HTMLCanvasElement

    constructor(maze: Maze, canvas: HTMLCanvasElement, gl: WebGLRenderingContext, program: WebGLProgram) {
        this.maze = maze
        this.gl = gl
        this.program = program
        this.canvas = canvas

        const matrixLoc = gl.getUniformLocation(this.program, 'u_matrix')
        const colorLoc = gl.getUniformLocation(this.program, 'u_color')
        if (!matrixLoc || !colorLoc) throw new Error('Не удалось получить uniform-переменные')
        this.uMatrixLocation = matrixLoc
        this.uColorLocation = colorLoc

        this.initCubeBuffers()
    }

    private calcProjectionMatrix() {
        const projectionMatrix = mat4.create()
        const fov = (60 * Math.PI) / 180
        const aspect = this.canvas.width / this.canvas.height
        const near = 0.1
        const far = 100
        mat4.perspective(projectionMatrix, fov, aspect, near, far)

        return projectionMatrix
    }

    private calcViewMatrix(player: Player) {
        const viewMatrix = mat4.create()
        const eye = vec3.fromValues(player.position[0], player.position[1], player.position[2])
        const center = vec3.fromValues(
            eye[0] + Math.cos(player.direction),
            eye[1],
            eye[2] + Math.sin(player.direction),
        )
        const up = vec3.fromValues(0, 1, 0)
        mat4.lookAt(viewMatrix, eye, center, up)

        return viewMatrix
    }

    private calcFinalMatrix(x: number, z: number, projectionMatrix: mat4, viewMatrix: mat4) {
        const modelMatrix = mat4.create()
        mat4.translate(modelMatrix, modelMatrix, [x, 0, z])
        const mvpMatrix = mat4.create()
        mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix)
        mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix)

        return mvpMatrix
    }

    // TODO: сделать одинаковое оформление
    public Render(player: Player) {
        let projectionMatrix = this.calcProjectionMatrix()
        let viewMatrix = this.calcViewMatrix(player)

        const maxDistance = this.maze.size * Math.sqrt(2); // Максимальное возможное расстояние

        for (let z = 0; z < this.maze.size; z++) {
            for (let x = 0; x < this.maze.size; x++) {
                if (this.maze.grid[z]![x] === 1) {
                    // Рассчитываем расстояние от игрока до стены
                    const dx = x - player.position[0];
                    const dz = z - player.position[2];
                    const distance = Math.sqrt(dx*dx + dz*dz);

                    const normalizedDistance = Math.min(distance / maxDistance, 1);

                    // Коэффициент затемнения (1 - рядом, 0.3 - далеко)
                    const darkenFactor = 1.0 - Math.pow(normalizedDistance, 0.3);

                    // Цвет с учетом затемнения (базовый цвет - голубоватый)
                    const color = [
                        0.5 * darkenFactor,  // R
                        0.7 * darkenFactor,  // G
                        0.9 * darkenFactor,   // B
                        1.0                // A
                    ];

                    const mvpMatrix = this.calcFinalMatrix(x, z, projectionMatrix, viewMatrix);
                    this.gl.uniformMatrix4fv(this.uMatrixLocation, false, mvpMatrix);
                    this.gl.uniform4fv(this.uColorLocation, color);
                    this.gl.drawElements(this.gl.TRIANGLES, this.cubeIndexCount, this.gl.UNSIGNED_SHORT, 0);
                }
            }
        }
    }

    private initCubeBuffers() {
        const gl = this.gl
        const vertices = new Float32Array([
            0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0,
            0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1,
        ])
        const indices = new Uint16Array([
            4, 5, 6, 4, 6, 7,  // Передняя грань
            0, 2, 1, 0, 3, 2,  // Задняя грань
            0, 7, 3, 0, 4, 7,  // Левая грань
            1, 2, 6, 1, 6, 5,  // Правая грань
            3, 6, 2, 3, 7, 6,  // Верхняя грань
            0, 1, 5, 0, 5, 4,  // Нижняя грань
        ])
        this.cubeIndexCount = indices.length

        this.cubeVertexBuffer = gl.createBuffer()!
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

        this.cubeIndexBuffer = gl.createBuffer()!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeIndexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

        const aPositionLocation = gl.getAttribLocation(this.program, 'a_position')
        if (aPositionLocation === -1) {
            throw new Error('Атрибут "a_position" не найден')
        }
        gl.enableVertexAttribArray(aPositionLocation)
        gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0)
    }
}

export {
    MazeRenderer
}