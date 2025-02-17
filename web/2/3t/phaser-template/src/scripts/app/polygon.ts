import Vector2 from './vector2'

export default class Polygon {
    private list: Vector2[]

    public constructor(list: Vector2[]) {
        this.list = list
    }

    public List(): Vector2[] {
        return this.list
    }
}