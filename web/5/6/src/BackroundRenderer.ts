import {Maze} from "./Maze.ts";

class BackroundRenderer {
    private readonly gl: WebGLRenderingContext
    private readonly program: WebGLProgram

    private readonly canvas: HTMLCanvasElement

    constructor(maze: Maze, canvas: HTMLCanvasElement, gl: WebGLRenderingContext, program: WebGLProgram) {
        this.gl = gl
        this.program = program
        this.canvas = canvas

        const matrixLoc = gl.getUniformLocation(this.program, 'u_matrix')
        const colorLoc = gl.getUniformLocation(this.program, 'u_color')
        if (!matrixLoc || !colorLoc) throw new Error('Не удалось получить uniform-переменные')
    }

    public Render() {
        this.gl.enable(this.gl.DEPTH_TEST);

        // Включаем scissor test для верхней половины
        this.gl.enable(this.gl.SCISSOR_TEST);
        this.gl.scissor(0, this.gl.canvas.height / 2, this.gl.canvas.width, this.gl.canvas.height / 2);
        this.gl.clearColor(0.3, 0.3, 0.3, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Меняем scissor test для нижней половины
        this.gl.scissor(0, 0, this.gl.canvas.width, this.gl.canvas.height / 2);
        this.gl.clearColor(0.1, 0.1, 0.3, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Выключаем scissor test
        this.gl.disable(this.gl.SCISSOR_TEST);
    }
}

export {
    BackroundRenderer
}