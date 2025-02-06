package model

type Canvas interface {
	Draw(figures []Figure)
}

func NewEngine(animations []Animation, canvas Canvas) Engine {
	return Engine{
		animations: animations,
		canvas:     canvas,
	}
}

type Engine struct {
	animations []Animation
	canvas     Canvas
}

func (e *Engine) Draw() {
	figures := make([]Figure, 0, len(e.animations))
	for _, animation := range e.animations {
		figures = append(figures, animation.Next())
	}
	e.canvas.Draw(figures)
}
