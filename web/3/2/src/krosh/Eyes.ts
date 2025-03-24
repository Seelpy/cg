import {Renderable} from "../base/Renderable";
import {Circle} from "../base/Circle";

export class KroshEyes implements Renderable {
    private leftEye: Circle;
    private rightEye: Circle;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
    ) {
        this.leftEye = new Circle(gl, program, 1.0, 100, {r: 1, g: 1, b: 1, a: 1.0}, -2.0, 2.0);
        this.rightEye = new Circle(gl, program, 1.0, 100, {r: 1, g: 1, b: 1, a: 1.0}, 2.0, 2.0);
    }

    render() {
        this.leftEye.render();
        this.rightEye.render();
    }
}