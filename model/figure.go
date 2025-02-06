package model

type Contour []Point

func NewFigure(contour Contour, position Point, color RGB) Figure {
	return &figure{
		contour:  contour,
		position: position,
		color:    color,
	}
}

type Figure interface {
	Contour() Contour
	Position() Point
	Color() RGB
	SetPosition(position Point)
}

type figure struct {
	contour  Contour
	position Point
	color    RGB
}

func (f *figure) Contour() Contour {
	return f.contour
}

func (f *figure) Position() Point {
	return f.position
}

func (f *figure) Color() RGB {
	return f.color
}

func (f *figure) SetPosition(position Point) {
	f.position = position
}
