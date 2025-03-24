import {Renderable} from '../base/Renderable';
import {KroshBody} from "./Body";
import {KroshEyes} from "./Eyes";
import {KroshPupils} from "./Pupils";
import {KroshMouth} from "./Mouth";
import {KroshLegs} from "./Legs";
import {KroshEars} from "./Ears";
import {KroshArms} from "./Arms";

export class Krosh implements Renderable {
    private body: KroshBody;
    private eyes: KroshEyes;
    private pupils: KroshPupils;
    private mouth: KroshMouth;
    private legs: KroshLegs;
    private ears: KroshEars;
    private arms: KroshArms;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: WebGLProgram,
    ) {
        this.body = new KroshBody(gl, program);
        this.eyes = new KroshEyes(gl, program);
        this.pupils = new KroshPupils(gl, program);
        this.mouth = new KroshMouth(gl, program);
        this.legs = new KroshLegs(gl, program);
        this.ears = new KroshEars(gl, program);
        this.arms = new KroshArms(gl, program);
    }

    render() {
        this.body.render();
        this.eyes.render();
        this.pupils.render();
        this.mouth.render();
        this.legs.render();
        this.ears.render();
        this.arms.render();
    }
}