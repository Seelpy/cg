import {Renderable} from "../base/Renderable";
import {Polygon} from "../base/Polygon";
import {Color} from "../base/Types";

export class KroshEars implements Renderable {
    private leftEar: Polygon;
    private rightEar: Polygon;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
        private readonly offsetX: number = 0,
        private readonly offsetY: number = 0,
        private readonly scale: number = 1,
        private readonly color: Color = { r: 0.0, g: 0.8, b: 0.8, a: 1.0 },
    ) {
        const rightEarPoints = [
            3.0, 4.0,
            3.0, 4.5,
            3.2, 5,
            3.6, 6,
            4, 7,
            4.5, 8,
            5, 8.5,
            6, 9,
            7, 9,
            7.5, 8.5,
        ].map((value, index) =>
            index % 2 === 0 ? value * scale + offsetX : value * scale + offsetY
        );

        const leftEarPoints = rightEarPoints.map((x, index) =>
            index % 2 === 0 ? -x : x
        );

        this.leftEar = new Polygon(gl, program, leftEarPoints, color);
        this.rightEar = new Polygon(gl, program, rightEarPoints, color);
    }

    render() {
        this.leftEar.render();
        this.rightEar.render();
    }
}