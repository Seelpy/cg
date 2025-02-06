package utils

import (
	"1/model"
	"github.com/fogleman/delaunay"
)

func IsPointInConvexPolygon(point model.Point, polygon []model.Point) bool {
	n := len(polygon)

	// Проверяем, совпадает ли точка с одной из вершин
	for _, vertex := range polygon {
		if point.X == vertex.X && point.Y == vertex.Y {
			return true // Точка совпадает с вершиной
		}
	}

	// Проверяем, находится ли точка "слева" от всех сторон многоугольника
	for i := 0; i < n; i++ {
		j := (i + 1) % n
		cross := (polygon[j].X-polygon[i].X)*(point.Y-polygon[i].Y) - (polygon[j].Y-polygon[i].Y)*(point.X-polygon[i].X)
		if cross < 0 {
			return false // Точка вне многоугольника
		}
	}

	return true // Точка внутри или на границе
}

// DoSegmentsIntersect проверяет пересечение двух отрезков.
func DoSegmentsIntersect(a1, a2, b1, b2 model.Point) bool {
	orientation := func(p, q, r model.Point) int {
		val := (q.Y-p.Y)*(r.X-q.X) - (q.X-p.X)*(r.Y-q.Y)
		if val == 0 {
			return 0 // Коллинеарны
		}
		if val > 0 {
			return 1 // По часовой стрелке
		}
		return 2 // Против часовой стрелки
	}

	o1 := orientation(a1, a2, b1)
	o2 := orientation(a1, a2, b2)
	o3 := orientation(b1, b2, a1)
	o4 := orientation(b1, b2, a2)

	if o1 != o2 && o3 != o4 {
		return true
	}

	return false
}

// IsTriangleInsidePolygon проверяет, находится ли весь треугольник внутри выпуклого многоугольника.
func IsTriangleInsidePolygon(triangle [3]model.Point, polygon []model.Point) bool {
	for _, vertex := range triangle {
		if !IsPointInConvexPolygon(vertex, polygon) {
			return false
		}
	}

	n := len(polygon)
	for i := 0; i < n; i++ {
		j := (i + 1) % n

		for k := 0; k < 3; k++ {
			l := (k + 1) % 3
			if DoSegmentsIntersect(triangle[k], triangle[l], polygon[i], polygon[j]) {
				return false
			}
		}
	}

	return true
}

// TriangulateAndFilter выполняет триангуляцию множества точек и возвращает только те точки,
// которые принадлежат треугольникам, находящимся внутри выпуклого многоугольника.
func TriangulateAndFilter(points []model.Point) []model.Point {

	delaunayPoints := make([]delaunay.Point, len(points))
	for i, point := range points {
		delaunayPoints[i] = delaunay.Point{
			X: point.X,
			Y: point.Y,
		}
	}

	triangulation, err := delaunay.Triangulate(delaunayPoints)
	if err != nil {
		return nil
	}

	var result []model.Point

	for i := 0; i < len(triangulation.Triangles)-3; i++ {
		tA := points[triangulation.Triangles[i]]
		tB := points[triangulation.Triangles[i+1]]
		tC := points[triangulation.Triangles[i+2]]

		if IsTriangleInsidePolygon([3]model.Point{tA, tB, tC}, points) {
			result = append(result, tA, tB, tC)
		}
	}

	return result
}
