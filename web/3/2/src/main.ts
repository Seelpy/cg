import './index.css'
import {createShaderProgram, computeOrthoMatrix, getWorldSize} from './Utils.ts'
import {Krosh} from "./krosh/Krosh";

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram
	private orthoMatrix: Float32Array<any>
	private krosh: Krosh

	constructor() {
		this.canvas = document.createElement('canvas')
		document.body.appendChild(this.canvas)
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		const gl = this.canvas.getContext('webgl')
		if (!gl) {
			throw new Error('WebGL не поддерживается')
		}
		this.gl = gl
		this.program = createShaderProgram(gl)
		gl.useProgram(this.program)
		this.orthoMatrix = computeOrthoMatrix(this.canvas.width, this.canvas.height)

		const {width, height} = getWorldSize()

		this.krosh = new Krosh(gl, this.program)
		window.addEventListener('resize', this.resizeCanvas)
	}

	render = () => {
		requestAnimationFrame(this.render)
		const gl = this.gl

		const matrixLocation = gl.getUniformLocation(this.program, 'u_matrix')
		gl.uniformMatrix4fv(matrixLocation, false, this.orthoMatrix)

		this.krosh.render()
	}

	private computeSkyColor(sunHeight: number) {
		const minColor = {r: 0.05, g: 0.05, b: 0.2}

		if (sunHeight > 0) {
			return {
				r: minColor.r + (0.53 - minColor.r) * sunHeight,
				g: minColor.g + (0.81 - minColor.g) * sunHeight,
				b: minColor.b + (0.98 - minColor.b) * sunHeight,
			}
		}

		return minColor
	}

	private resizeCanvas = () => {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.gl.viewport(0, 0, window.innerWidth, window.innerHeight)
		this.orthoMatrix = computeOrthoMatrix(window.innerWidth, window.innerHeight)
	}
}

const app = new App()
app.render()