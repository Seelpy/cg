import Vector2 from './vector2';
import Polygon from './polygon';
import Cannon from './cannon';
import Map from './map';

class MapGenerator {
    private mapWidth: number;
    private mapHeight: number;
    private minPolygonSize: number;
    private maxPolygonSize: number;
    private polygonCount: number;
    private cannonPlacementRetryCount: number;

    constructor(mapWidth: number, mapHeight: number, polygonCount: number = 5, minPolygonSize: number = 20, maxPolygonSize: number = 100, cannonPlacementRetryCount: number = 10) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.minPolygonSize = minPolygonSize;
        this.maxPolygonSize = maxPolygonSize;
        this.polygonCount = polygonCount
        this.cannonPlacementRetryCount = cannonPlacementRetryCount
    }

    public GenerateMap(): Map {
        let polygons: Polygon[] = [];

        for (let i = 0; i < this.polygonCount; i++) {
            let polygon: Polygon | null = null;
            let attempts = 0;

            // Попытки сгенерировать непересекающийся полигон
            while (polygon === null && attempts < 100) {
                attempts++;
                const newPolygon = this.GenerateRandomPolygon();

                if (!this.IsIntersecting(newPolygon, polygons)) {
                    polygon = newPolygon;
                }
            }

            if (polygon) {
                polygons.push(polygon);
            }
        }

        let cannon: Cannon | null = null
        let attempts = 0

        while (cannon === null && attempts < this.cannonPlacementRetryCount) {
            attempts++
            const position = this.GenerateRandomPosition()
            const tempCannon = new Cannon(position)
            if (!this.IsPointInsidePolygons(position, polygons)) {
                cannon = tempCannon
            }
        }

        if (!cannon) {
            cannon = new Cannon({ x: 50, y: this.mapHeight / 2 })
            console.warn(`Не удалось разместить пушку после ${this.cannonPlacementRetryCount} попыток. Установлено значение по умолчанию ${cannon.Position()}`)
        }

        return new Map(polygons, cannon);
    }

    private GenerateRandomPolygon(): Polygon {
        const pointCount = Math.floor(Math.random() * 5) + 3; //  3-7 углов
        const polygonPoints: Vector2[] = [];

        for (let i = 0; i < pointCount; i++) {
            polygonPoints.push({
                x: Math.random() * (this.maxPolygonSize - this.minPolygonSize) + this.minPolygonSize,
                y: Math.random() * (this.maxPolygonSize - this.minPolygonSize) + this.minPolygonSize,
            });
        }

        // Смещение полигона в пределах карты
        const offsetX = Math.random() * (this.mapWidth - this.maxPolygonSize);
        const offsetY = Math.random() * (this.mapHeight - this.maxPolygonSize);

        return new Polygon(polygonPoints.map(p => ({ x: p.x + offsetX, y: p.y + offsetY })));
    }

    private GenerateRandomPosition(): Vector2 {
        return {
            x: Math.random() * this.mapWidth,
            y: Math.random() * this.mapHeight
        }
    }

    private IsIntersecting(newPolygon: Polygon, existingPolygons: Polygon[]): boolean {
        for (const existingPolygon of existingPolygons) {
            if (this.ArePolygonsIntersecting(newPolygon, existingPolygon)) {
                return true;
            }
        }
        return false;
    }

    // Проверка пересечения двух полигонов (SAT - Separating Axis Theorem)
    private ArePolygonsIntersecting(polygonA: Polygon, polygonB: Polygon): boolean {
        const a = polygonA.List();
        const b = polygonB.List();

        const axes = this.GetAxes(a).concat(this.GetAxes(b));

        for (const axis of axes) {
            const projectionA = this.ProjectPolygon(a, axis);
            const projectionB = this.ProjectPolygon(b, axis);

            if (!this.IsOverlap(projectionA, projectionB)) {
                return false; // Нашли разделяющую ось, полигоны не пересекаются
            }
        }

        return true; // Не нашли разделяющую ось, полигоны пересекаются
    }

    private GetAxes(polygon: Vector2[]): Vector2[] {
        const axes: Vector2[] = [];
        for (let i = 0; i < polygon.length; i++) {
            const p1 = polygon[i];
            const p2 = polygon[(i + 1) % polygon.length];

            const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
            const normal = { x: -edge.y, y: edge.x }; // Нормаль к ребру

            axes.push(this.Normalize(normal));
        }
        return axes;
    }

    private Normalize(vector: Vector2): Vector2 {
        const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        return { x: vector.x / length, y: vector.y / length };
    }

    private ProjectPolygon(polygon: Vector2[], axis: Vector2): { min: number; max: number } {
        let min = Infinity;
        let max = -Infinity;

        for (const point of polygon) {
            const projection = point.x * axis.x + point.y * axis.y;
            if (projection < min) {
                min = projection;
            }
            if (projection > max) {
                max = projection;
            }
        }

        return { min, max };
    }

    private IsOverlap(projectionA: { min: number; max: number }, projectionB: { min: number; max: number }): boolean {
        return projectionA.max > projectionB.min && projectionB.max > projectionA.min;
    }

    private IsPointInsidePolygons(point: Vector2, polygons: Polygon[]): boolean {
        for (const polygon of polygons) {
            if (this.IsPointInsidePolygon(point, polygon)) {
                return true // Точка внутри хотя бы одного полигона
            }
        }

        return false // Точка не находится ни в одном из полигонов
    }

    private IsPointInsidePolygon(point: Vector2, polygon: Polygon): boolean {
        const vertices = polygon.List()
        let inside = false
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const xi = vertices[i].x, yi = vertices[i].y
            const xj = vertices[j].x, yj = vertices[j].y

            const intersect = ((yi > point.y) != (yj > point.y))
                && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)
            if (intersect) inside = !inside
        }

        return inside
    }
}

export default MapGenerator;
