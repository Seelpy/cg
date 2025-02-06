package model

import (
	"math"
)

type Animation interface {
	Next() Figure
}

func NewAnimation(figure Figure, speed float64, maxY float64, minY float64) Animation {
	return &animation{
		figure:   figure,
		speed:    speed,
		maxY:     maxY,
		minY:     minY,
		time:     0,
		duration: 1,
	}
}

type animation struct {
	figure   Figure
	speed    float64
	maxY     float64
	minY     float64
	time     float64
	duration float64 // Длительность одного полного прыжка (в секундах)
}

func (a *animation) Next() Figure {
	t := math.Mod(a.time/a.duration, 1.0)

	newY := a.minY + (a.maxY-a.minY)*(-4*(t-0.5)*(t-0.5)+1)

	a.time += a.speed

	position := a.figure.Position()
	position.Y = newY
	a.figure.SetPosition(position)

	return a.figure
}
