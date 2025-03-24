export const vertexShaderSource = `
  attribute vec2 position;
  uniform mat4 u_matrix;

  void main() {
    gl_Position = u_matrix * vec4(position, 0.0, 1.0);
  }
`

// TODO: unitform чем отличаеться от других переменных
// TODO: mediump - что означает
// TODO: роль семантики матрицы

export const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 u_color;
  
  void main() {
    gl_FragColor = u_color;
  }
`

export const compileShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
    const shader = gl.createShader(type)
    if (!shader) {
        throw new Error('Не удалось создать шейдер')
    }
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const err = gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        throw new Error('Ошибка компиляции шейдера: ' + err)
    }
    return shader
}