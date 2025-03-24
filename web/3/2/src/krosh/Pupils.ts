import {Renderable} from "../base/Renderable";
import {Circle} from "../base/Circle";

export class KroshPupils implements Renderable {
    private leftPupil: Circle;
    private rightPupil: Circle;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
    ) {
        this.leftPupil = new Circle(gl, program, 0.5, 16, {r: 0.3, g: 0.3, b: 0.3, a: 1.0}, -2.0, 2.0);
        this.rightPupil = new Circle(gl, program, 0.5, 16, {r: 0.3, g: 0.3, b: 0.3, a: 1.0}, 2.0, 2.0);
    }

    render() {
        this.leftPupil.render();
        this.rightPupil.render();
    }
}
