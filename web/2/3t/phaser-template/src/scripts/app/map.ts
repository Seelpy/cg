import Vector2 from './vector2'
import Bullet from './bullet'
import Cannon from './cannon'
import Polygon from './polygon'

export default class Map {
    private polygons: Polygon[]
    private cannon: Cannon

    public constructor(polygons: Polygon[], cannon: Cannon) {
        this.cannon = cannon
        this.polygons = polygons
    }

    public Cannon(): Cannon {
        return this.cannon
    }

    public Polygons(): Polygon[] {
        return this.polygons
    }
}