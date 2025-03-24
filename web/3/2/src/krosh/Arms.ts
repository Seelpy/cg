import { Renderable } from "../base/Renderable";
import { Polygon } from "../base/Polygon";
import { Color } from "../base/Types";

export class KroshArms implements Renderable {
    private leftArmStart: Polygon;
    private leftArmTendons: Polygon;
    private leftArmBase: Polygon;

    private rightArmStart: Polygon;
    private rightArmTendons: Polygon;
    private rightArmBase: Polygon;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
        private readonly offsetX: number = 0,
        private readonly offsetY: number = 0,
        private readonly scale: number = 1,
        private readonly color: Color = { r: 0.0, g: 0.8, b: 0.9, a: 1.0 },
    ) {
        const armStartPoints = [
            4.0, 2.0,
            4.5, 1.5,
            5.0, 1.0,
            4.5, 0.5,
            4.0, 0.0,
            3.5, 0.5,
            3.0, 1.0,
            3.5, 1.5,
        ].map((value, index) =>
            index % 2 === 0 ? value * scale + offsetX : value * scale + offsetY
        );

        const tendonPoints = [
            5.0, 1.0,
            5.5, 0.5,
            6.0, 0.0,
            5.5, -0.5,
            5.0, -1.0,
            4.5, -0.5,
            4.0, 0.0,
            4.5, 0.5,
        ].map((value, index) =>
            index % 2 === 0 ? value * scale + offsetX : value * scale + offsetY
        );

        const armBasePoints = [
            6.0, 0.0,
            6.5, -0.5,
            7.0, -1.0,
            6.5, -1.5,
            6.0, -2.0,
            5.5, -1.5,
            5.0, -1.0,
            5.5, -0.5,
        ].map((value, index) =>
            index % 2 === 0 ? value * scale + offsetX : value * scale + offsetY
        );

        this.rightArmStart = new Polygon(gl, program, armStartPoints, color);
        this.rightArmTendons = new Polygon(gl, program, tendonPoints, color);
        this.rightArmBase = new Polygon(gl, program, armBasePoints, color);

        const leftArmStartPoints = armStartPoints.map((x, index) =>
            index % 2 === 0 ? -x : x
        );
        const leftArmTendonPoints = tendonPoints.map((x, index) =>
            index % 2 === 0 ? -x : x
        );
        const leftArmBasePoints = armBasePoints.map((x, index) =>
            index % 2 === 0 ? -x : x
        );

        this.leftArmStart = new Polygon(gl, program, leftArmStartPoints, color);
        this.leftArmTendons = new Polygon(gl, program, leftArmTendonPoints, color);
        this.leftArmBase = new Polygon(gl, program, leftArmBasePoints, color);
    }

    render() {
        this.rightArmStart.render();
        this.rightArmTendons.render();
        this.rightArmBase.render();

        this.leftArmStart.render();
        this.leftArmTendons.render();
        this.leftArmBase.render();
    }
}