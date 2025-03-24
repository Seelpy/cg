import { Polygon } from "./Polygon";
import { Color } from "./Types";
import { Renderable } from "./Renderable";

export class PearShapedLeg implements Renderable {
    private leg: Polygon;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
        private readonly offsetX: number = 0,
        private readonly offsetY: number = 0,
        private readonly scale: number = 1,
        private readonly color: Color = { r: 0.0, g: 0.8, b: 0.0, a: 1.0 },
    ) {
        const points = [
            0.0 * scale + offsetX, -2.0 * scale + offsetY,
            -1.0 * scale + offsetX, -1.0 * scale + offsetY,
            -1.5 * scale + offsetX, 0.0 * scale + offsetY,
            -1.0 * scale + offsetX, 1.0 * scale + offsetY,
            0.0 * scale + offsetX, 1.5 * scale + offsetY,
            1.0 * scale + offsetX, 1.0 * scale + offsetY,
            1.5 * scale + offsetX, 0.0 * scale + offsetY,
            1.0 * scale + offsetX, -1.0 * scale + offsetY,
            0.0 * scale + offsetX, -2.0 * scale + offsetY,
        ];

        this.leg = new Polygon(gl, program, points, color);
    }

    render() {
        this.leg.render();
    }
}