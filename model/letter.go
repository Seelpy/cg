package model

type Letter string

const (
	LetterM Letter = "M"
	LetterV Letter = "V"
	LetterG Letter = "G"
)

func MakeLetterAnimation(letter Letter, position Point, rgb RGB, speed float64, maxX float64, minX float64) Animation {
	switch letter {
	case LetterG:
		return NewAnimation(NewFigure(LetterGContour, position, rgb), speed, maxX, minX)
	case LetterM:
		return NewAnimation(NewFigure(LetterMContour, position, rgb), speed, maxX, minX)
	case LetterV:
		return NewAnimation(NewFigure(LetterVContour, position, rgb), speed, maxX, minX)
	default:
		return NewAnimation(NewFigure(Contour{}, position, rgb), speed, maxX, minX)
	}
}

var LetterMContour = Contour{
	// Внешний контур
	{
		-0.15, -0.15, // Левый нижний угол
	},
	{
		-0.15, 0.15, // Левый верхний угол
	},
	{
		0, 0.10, // Центральная вершина
	},
	{
		0.15, 0.15, // Правый верхний угол
	},
	{
		0.15, -0.15, // Правый нижний угол
	},

	// Внутренний контур (пустота внутри буквы)
	{
		0.1, -0.15, // Левый нижний внутренний угол
	},
	{
		0.1, 0.1, // Левый верхний внутренний угол
	},
	{
		0, 0.05, // Левый верхний внутренний угол
	},
	{
		-0.1, 0.1, // Правый верхний внутренний угол
	},
	{
		-0.1, -0.15, // Правый нижний внутренний угол
	},
}
var LetterVContour = Contour{
	// Внешний контур
	{
		-0.15, -0.15, // Левый нижний угол
	},
	{
		0, 0.15, // Верхняя вершина
	},
	{
		0.15, -0.15, // Правый нижний угол
	},

	// Внутренний контур (пустота внутри буквы)
	{
		-0.1, -0.1, // Левый внутренний нижний угол
	},
	{
		0, 0.1, // Верхняя внутренняя вершина
	},
	{
		0.1, -0.1, // Правый внутренний нижний угол
	},
}

var LetterGContour = Contour{
	// Внешний контур
	{
		0.15, 0.15, // Верхний правый угол
	},
	{
		-0.15, 0.15, // Верхний левый угол
	},
	{
		-0.15, -0.15, // Нижний левый угол
	},
	{
		0.15, -0.15, // Нижний правый угол
	},
	{
		0.15, 0.05, // Поворот вправо (вход в "G")
	},

	// Внутренний контур (пустота внутри буквы)
	{
		0.1, 0.1, // Верхняя правая внутренняя точка
	},
	{
		-0.1, 0.1, // Верхняя левая внутренняя точка
	},
	{
		-0.1, -0.1, // Нижняя левая внутренняя точка
	},
	{
		0.1, -0.1, // Нижняя правая внутренняя точка
	},
}
