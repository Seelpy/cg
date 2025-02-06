package model

import (
	"math"
)

type Animation interface {
	Next() Figure
}

func NewAnimation(figure Figure, speed float64, maxY float64, minY float64) Animation {
	return &animation{
		figure:    figure,
		speed:     speed,
		maxY:      maxY,
		minY:      minY,
		time:      0,
		duration:  1,
		decayRate: 0.5,
	}
}

type animation struct {
	figure    Figure
	speed     float64
	maxY      float64
	minY      float64
	time      float64
	decayRate float64
	duration  float64 // Длительность одного полного прыжка (в секундах)
}

func (a *animation) Next() Figure {
	t := math.Mod(a.time/a.duration, 1.0)

	// Затухание основано на прошедшем времени
	decay := math.Exp(-a.decayRate * a.time / a.duration) // decayRate определяет, насколько быстро затухает прыжок

	// Вычисляем новую позицию Y, принимая во внимание затухание
	newY := a.minY + (a.maxY-a.minY)*(-4*(t-0.5)*(t-0.5)+1)*decay

	a.time += a.speed

	if a.time > 5 {
		a.time = 0
	}

	position := a.figure.Position()
	position.Y = newY
	a.figure.SetPosition(position)

	return a.figure
}
