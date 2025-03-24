import {Renderable} from "../base/Renderable";
import {PearShapedLeg} from "../base/PearShapedLeg";

export class KroshLegs implements Renderable {
    private leftLeg: PearShapedLeg;
    private rightLeg: PearShapedLeg;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
        private readonly offsetX: number = 0,
        private readonly offsetY: number = 0,
        private readonly scale: number = 1,
    ) {
        this.leftLeg = new PearShapedLeg(gl, program, offsetX - 2.0 * scale, offsetY - 5.0 * scale, scale, {r: 0.0, g: 0.77, b: 0.77, a: 1.});
        this.rightLeg = new PearShapedLeg(gl, program, offsetX + 2.0 * scale, offsetY - 5.0 * scale, scale, {r: 0.0, g: 0.77, b: 0.77, a: 1.0});
    }

    render() {
        this.leftLeg.render();
        this.rightLeg.render();
    }
}