import {vertexShaderSource, fragmentShaderSource, compileShader} from './Shaders.ts'

export const createShaderProgram = (gl: WebGLRenderingContext): WebGLProgram => {
	const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
	const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

	const program = gl.createProgram()
	if (!program) {
		throw new Error('Не удалось создать программу')
	}
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const err = gl.getProgramInfoLog(program)
		throw new Error('Ошибка линковки программы: ' + err)
	}
	return program
}

export const computeOrthoMatrix = (canvasWidth: number, canvasHeight: number): Float32Array<ArrayBuffer> => {
	const worldLeft = -5
	const worldRight = 5
	const worldBottom = -10
	const worldTop = 10
	const worldWidth = worldRight - worldLeft
	const worldHeight = worldTop - worldBottom
	const worldAspect = worldWidth / worldHeight
	const canvasAspect = canvasWidth / canvasHeight

	let left = worldLeft
	let right = worldRight
	let bottom = worldBottom
	let top = worldTop

	if (canvasAspect > worldAspect) {
		const newWorldWidth = worldHeight * canvasAspect
		const delta = (newWorldWidth - worldWidth) / 2
		left = worldLeft - delta
		right = worldRight + delta
	}
	else {
		const newWorldHeight = worldWidth / canvasAspect
		const delta = (newWorldHeight - worldHeight) / 2
		bottom = worldBottom - delta
		top = worldTop + delta
	}

	const tx = (right + left) / (left - right)
	const ty = (top + bottom) / (bottom - top)
	const sx = 2 / (right - left)
	const sy = 2 / (top - bottom)

	return new Float32Array([
		sx, 0, 0, 0,
		0, sy, 0, 0,
		0, 0, 1, 0,
		tx, ty, 0, 1,
	])
}
