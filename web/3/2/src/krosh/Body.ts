import {Renderable} from "../base/Renderable";
import {Circle} from "../base/Circle";

export class KroshBody implements Renderable {
    private body: Circle;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
    ) {
        this.body = new Circle(gl, program, 5.0, 32, {r: 0.0, g: 0.8, b: 0.8, a: 1.0});
    }

    render() {
        this.body.render();
    }
}