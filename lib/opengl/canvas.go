package opengl

import (
	"fmt"
	"github.com/go-gl/gl/v4.1-core/gl"
	"github.com/go-gl/glfw/v3.3/glfw"
	"log"
	"strings"

	"1/model"
)

const (
	vertexShaderSource = `
		#version 410
		in vec3 vp;
		uniform vec2 pos;
		void main() {
			gl_Position = vec4(vp.x + pos.x, vp.y + pos.y, vp.z, 1.0);
		}
	` + "\x00"

	fragmentShaderSource = `
		#version 410
		uniform vec3 color;
		out vec4 frag_colour;
		void main() {
			frag_colour = vec4(color, 1.0);
		}
	` + "\x00"
)

func InitGlfw(width, height int) *glfw.Window {
	if err := glfw.Init(); err != nil {
		panic(err)
	}
	glfw.WindowHint(glfw.Resizable, glfw.False)
	glfw.WindowHint(glfw.ContextVersionMajor, 4)
	glfw.WindowHint(glfw.ContextVersionMinor, 1)
	glfw.WindowHint(glfw.OpenGLProfile, glfw.OpenGLCoreProfile)
	glfw.WindowHint(glfw.OpenGLForwardCompatible, glfw.True)

	window, err := glfw.CreateWindow(width, height, "Jumping Letters", nil, nil)
	if err != nil {
		panic(err)
	}
	window.MakeContextCurrent()

	return window
}

func InitOpenGL() uint32 {
	if err := gl.Init(); err != nil {
		panic(err)
	}
	version := gl.GoStr(gl.GetString(gl.VERSION))
	log.Println("OpenGL version", version)

	vertexShader, err := compileShader(vertexShaderSource, gl.VERTEX_SHADER)
	if err != nil {
		panic(err)
	}

	fragmentShader, err := compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
	if err != nil {
		panic(err)
	}

	prog := gl.CreateProgram()
	gl.AttachShader(prog, vertexShader)
	gl.AttachShader(prog, fragmentShader)
	gl.LinkProgram(prog)
	return prog
}

func compileShader(source string, shaderType uint32) (uint32, error) {
	shader := gl.CreateShader(shaderType)

	csources, free := gl.Strs(source)
	gl.ShaderSource(shader, 1, csources, nil)
	free()
	gl.CompileShader(shader)

	var status int32
	gl.GetShaderiv(shader, gl.COMPILE_STATUS, &status)
	if status == gl.FALSE {
		var logLength int32
		gl.GetShaderiv(shader, gl.INFO_LOG_LENGTH, &logLength)

		log := strings.Repeat("\x00", int(logLength+1))
		gl.GetShaderInfoLog(shader, logLength, nil, gl.Str(log))

		return 0, fmt.Errorf("failed to compile %v: %v", source, log)
	}

	return shader, nil
}

func NewOpenGLCanvas(window *glfw.Window, program uint32) model.Canvas {
	return &openGLCanvas{
		window:  window,
		program: program,
		vaos:    make(map[model.Figure]uint32),
	}
}

type openGLCanvas struct {
	window  *glfw.Window
	program uint32
	vaos    map[model.Figure]uint32
}

func (c *openGLCanvas) Draw(figures []model.Figure) {
	gl.Clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.UseProgram(c.program)

	posAttrib := gl.GetUniformLocation(c.program, gl.Str("pos\x00"))
	colorAttrib := gl.GetUniformLocation(c.program, gl.Str("color\x00"))

	for _, figure := range figures {
		color := figure.Color()
		position := [2]float32{float32(figure.Position().X), float32(figure.Position().Y)}
		gl.Uniform2fv(posAttrib, 1, &position[0])
		gl.Uniform3fv(colorAttrib, 1, &color[0])
		vao := c.makeVao(figure.Contour())
		gl.BindVertexArray(vao)
		gl.DrawArrays(gl.LINE_LOOP, 0, int32(len(figure.Contour())))
	}

	glfw.PollEvents()
	c.window.SwapBuffers()
}

func (c *openGLCanvas) updateBuffers(figures []model.Figure) {
	for _, figure := range figures {
		if _, ok := c.vaos[figure]; !ok {
			c.vaos[figure] = c.makeVao(figure.Contour())
		}
	}
}

func (c *openGLCanvas) makeVao(points model.Contour) uint32 {
	var vbo uint32
	gl.GenBuffers(1, &vbo)
	gl.BindBuffer(gl.ARRAY_BUFFER, vbo)

	buffer := make([]float32, len(points)*3)
	for i, point := range points {
		buffer[i*3] = float32(point.X)
		buffer[i*3+1] = float32(point.Y)
		buffer[i*3+2] = 0 // Z-координата равна нулю для плоской отрисовки.
	}
	gl.BufferData(gl.ARRAY_BUFFER, len(buffer)*4, gl.Ptr(buffer), gl.STATIC_DRAW)

	var vao uint32
	gl.GenVertexArrays(1, &vao)
	gl.BindVertexArray(vao)
	gl.EnableVertexAttribArray(0)
	gl.BindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.VertexAttribPointer(0, 3, gl.FLOAT, false, 0, nil)

	return vao
}
