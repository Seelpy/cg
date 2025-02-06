package main

import (
	"1/lib/opengl"
	"1/model"
	"github.com/go-gl/glfw/v3.3/glfw"
	"runtime"
)

func main() {
	runtime.LockOSThread()

	window := opengl.InitGlfw(800, 600)
	defer glfw.Terminate()
	program := opengl.InitOpenGL()

	canvas := opengl.NewOpenGLCanvas(window, program)

	engine := model.NewEngine([]model.Animation{
		model.MakeLetterAnimation(model.LetterM, model.Point{-0.5, 0}, model.RGB{1, 0, 0}, 0.01, 0.7, -0.8),
		model.MakeLetterAnimation(model.LetterV, model.Point{0, 0}, model.RGB{0, 1, 0}, 0.005, 0.7, -0.8),
		model.MakeLetterAnimation(model.LetterG, model.Point{0.5, 0}, model.RGB{0, 0, 1}, 0.008, 0.7, -0.8),
	}, canvas)

	for !window.ShouldClose() {
		engine.Draw()
	}
}
