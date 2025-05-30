export class Axis {
	private axesBuffer: WebGLBuffer | null = null
	private ticksBuffer: WebGLBuffer | null = null
	private arrowBuffer: WebGLBuffer | null = null

	private ticksVertexCount = 0
	private arrowVertexCount = 0

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly program: WebGLProgram,
	) {
		this.initBuffers()
	}

	render() {
		const gl = this.gl
		const positionLocation = gl.getAttribLocation(this.program, 'position')
		const colorLocation = gl.getUniformLocation(this.program, 'u_color')

		this.renderAxes(gl, colorLocation, positionLocation)
		this.renderOrdinate(gl, colorLocation)
		this.renderTicks(gl, colorLocation, positionLocation)
		this.renderArrows(gl, colorLocation, positionLocation)
	}

	private renderAxes(gl: WebGLRenderingContext, colorLocation: WebGLUniformLocation, positionLocation: number) {
		gl.uniform4f(colorLocation, 1, 0, 0, 1)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.axesBuffer)
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(positionLocation)
		gl.drawArrays(gl.LINES, 0, 2)
	}

	private renderOrdinate(gl: WebGLRenderingContext, colorLocation: WebGLUniformLocation) {
		gl.uniform4f(colorLocation, 1, 0, 0, 1)
		gl.drawArrays(gl.LINES, 2, 2)
	}

	private renderTicks(gl: WebGLRenderingContext, colorLocation: WebGLUniformLocation, positionLocation: number) {
		gl.uniform4f(colorLocation, 1, 1, 0, 1)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.ticksBuffer)
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(positionLocation)
		gl.drawArrays(gl.LINES, 0, this.ticksVertexCount)
	}

	private renderArrows(gl: WebGLRenderingContext, colorLocation: WebGLUniformLocation, positionLocation: number) {
		gl.uniform4f(colorLocation, 1, 1, 0, 1)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.arrowBuffer)
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(positionLocation)
		gl.drawArrays(gl.TRIANGLES, 0, this.arrowVertexCount)
	}

	private initBuffers() {
		const gl = this.gl

		const axesVertices = new Float32Array([
			-10, 0, 5, 0,
			0, -10, 0, 10,
		])
		this.axesBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.axesBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, axesVertices, gl.STATIC_DRAW)

		const tickSize = 0.2
		const xTicks: number[] = []
		for (let x = -10; x <= 5; x += 1) {
			xTicks.push(x, -tickSize, x, tickSize)
		}
		const yTicks: number[] = []
		for (let y = -10; y <= 10; y += 1) {
			yTicks.push(-tickSize, y, tickSize, y)
		}
		const ticksVertices = new Float32Array([...xTicks, ...yTicks])
		this.ticksVertexCount = ticksVertices.length / 2
		this.ticksBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.ticksBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, ticksVertices, gl.STATIC_DRAW)

		const arrowX = [
			5, 0,
			4.8, 0.1,
			4.8, -0.1,
		]
		const arrowY = [
			0, 10,
			0.1, 9.8,
			-0.1, 9.8,
		]
		const arrowVertices = new Float32Array([...arrowX, ...arrowY])
		this.arrowVertexCount = arrowVertices.length / 2
		this.arrowBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.arrowBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, arrowVertices, gl.STATIC_DRAW)
	}
}