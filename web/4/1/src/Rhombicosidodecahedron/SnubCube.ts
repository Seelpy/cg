import { mat4 } from "gl-matrix";

class SnubCube {
    // WebGL буферы
    private positionBuffer: WebGLBuffer | null;
    private colorBuffer: WebGLBuffer | null;
    private indexBuffer: WebGLBuffer | null;

    // Шейдерные атрибуты и uniform-переменные
    private vertexPosition: number;
    private vertexColor: number;
    private projectionMatrix: WebGLUniformLocation | null;
    private modelViewMatrix: WebGLUniformLocation | null;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly shaderProgram: WebGLProgram,
    ) {
        // Инициализация буферов
        const { position, color, indices } = this.initBuffers();
        this.positionBuffer = position;
        this.colorBuffer = color;
        this.indexBuffer = indices;

        // Получение ссылок на атрибуты шейдера
        this.vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        this.vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor');

        // Получение ссылок на uniform-переменные шейдера
        this.projectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
        this.modelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    }

    /**
     * Рендерит курносый куб с заданным вращением
     * @param cubeRotation Угол вращения в радианах
     */
    render(cubeRotation: number) {
        const { gl } = this;

        // Настройка окружения рендеринга
        this.setupRenderEnvironment();

        // Создание матрицы проекции
        const projectionMatrix = this.createProjectionMatrix();

        // Создание и настройка матрицы модели-вида
        const modelViewMatrix = this.createModelViewMatrix(cubeRotation);

        // Настройка атрибутов вершин
        this.setupVertexAttributes();

        // Установка uniform-переменных шейдера
        this.setShaderUniforms(projectionMatrix, modelViewMatrix);

        // Отрисовка куба
        this.drawCube();
    }

    // ========== Приватные методы ==========

    private setupRenderEnvironment() {
        const { gl } = this;

        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Черный фон
        gl.clearDepth(1.0);                 // Очистка буфера глубины
        gl.enable(gl.DEPTH_TEST);          // Включение теста глубины
        gl.depthFunc(gl.LEQUAL);           // Ближние объекты перекрывают дальние

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    private createProjectionMatrix(): mat4 {
        const { gl } = this;

        const fieldOfView = (45 * Math.PI) / 180; // 45 градусов в радианах
        const aspect = gl.canvas.width / gl.canvas.height;
        const zNear = 0.1;
        const zFar = 100.0;

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        return projectionMatrix;
    }

    private createModelViewMatrix(cubeRotation: number): mat4 {
        const modelViewMatrix = mat4.create();

        // Перемещаем куб назад, чтобы он был виден
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);

        // Вращение по всем трем осям с разными скоростями
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);    // Z-ось
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]); // Y-ось
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.3, [1, 0, 0]); // X-ось

        return modelViewMatrix;
    }

    private setupVertexAttributes() {
        this.setPositionAttribute();
        this.setColorAttribute();

        // Привязываем индексный буфер
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // Активируем шейдерную программу
        this.gl.useProgram(this.shaderProgram);
    }

    private setShaderUniforms(projectionMatrix: mat4, modelViewMatrix: mat4) {
        const { gl, projectionMatrix: projLoc, modelViewMatrix: modelLoc } = this;

        if (projLoc && modelLoc) {
            gl.uniformMatrix4fv(projLoc, false, projectionMatrix);
            gl.uniformMatrix4fv(modelLoc, false, modelViewMatrix);
        }
    }

    private drawCube() {
        const { gl } = this;

        const vertexCount = 36; // 6 граней × 2 треугольника × 3 вершины
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;

        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    private setPositionAttribute() {
        const { gl, vertexPosition, positionBuffer } = this;

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(
            vertexPosition,
            3,          // 3 компонента на вершину (x, y, z)
            gl.FLOAT,   // Тип данных
            false,      // Нормализация не требуется
            0,          // Шаг
            0          // Смещение
        );
        gl.enableVertexAttribArray(vertexPosition);
    }

    private setColorAttribute() {
        const { gl, vertexColor, colorBuffer } = this;

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(
            vertexColor,
            4,          // 4 компонента на цвет (r, g, b, a)
            gl.FLOAT,   // Тип данных
            false,      // Нормализация не требуется
            0,          // Шаг
            0           // Смещение
        );
        gl.enableVertexAttribArray(vertexColor);
    }

    private initBuffers() {
        return {
            position: this.initPositionBuffer(),
            color: this.initColorBuffer(),
            indices: this.initIndexBuffer(),
        };
    }

    private initPositionBuffer(): WebGLBuffer {
        const { gl } = this;
        const buffer = gl.createBuffer()!;

        // Вершины куба (8 вершин × 3 координаты)
        const positions = [
            // Передняя грань
            -1.0, -1.0,  1.0,   1.0, -1.0,  1.0,   1.0,  1.0,  1.0,  -1.0,  1.0,  1.0,
            // Задняя грань
            -1.0, -1.0, -1.0,  -1.0,  1.0, -1.0,   1.0,  1.0, -1.0,   1.0, -1.0, -1.0,
            // Верхняя грань
            -1.0,  1.0, -1.0,  -1.0,  1.0,  1.0,   1.0,  1.0,  1.0,   1.0,  1.0, -1.0,
            // Нижняя грань
            -1.0, -1.0, -1.0,   1.0, -1.0, -1.0,   1.0, -1.0,  1.0,  -1.0, -1.0,  1.0,
            // Правая грань
            1.0, -1.0, -1.0,   1.0,  1.0, -1.0,   1.0,  1.0,  1.0,   1.0, -1.0,  1.0,
            // Левая грань
            -1.0, -1.0, -1.0,  -1.0, -1.0,  1.0,  -1.0,  1.0,  1.0,  -1.0,  1.0, -1.0
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        return buffer;
    }

    private initColorBuffer(): WebGLBuffer {
        const { gl } = this;
        const buffer = gl.createBuffer()!;

        // Цвета для каждой грани
        const faceColors = [
            [1.0, 1.0, 1.0, 1.0], // Белый - передняя
            [1.0, 0.0, 0.0, 1.0], // Красный - задняя
            [0.0, 1.0, 0.0, 1.0], // Зеленый - верхняя
            [0.0, 0.0, 1.0, 1.0], // Синий - нижняя
            [1.0, 1.0, 0.0, 1.0], // Желтый - правая
            [1.0, 0.0, 1.0, 1.0]  // Пурпурный - левая
        ];

        // Создаем массив цветов для всех вершин (6 граней × 4 вершины × 4 компонента)
        const colors = faceColors.flatMap(color =>
            Array(4).fill(color).flat()
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        return buffer;
    }

    private initIndexBuffer(): WebGLBuffer {
        const { gl } = this;
        const buffer = gl.createBuffer()!;

        // Индексы для построения треугольников (6 граней × 2 треугольника × 3 вершины)
        const indices = [
            // Передняя грань (2 треугольника)
            0, 1, 2,   0, 2, 3,
            // Задняя грань
            4, 5, 6,   4, 6, 7,
            // Верхняя грань
            8, 9, 10,  8, 10, 11,
            // Нижняя грань
            12, 13, 14,  12, 14, 15,
            // Правая грань
            16, 17, 18,  16, 18, 19,
            // Левая грань
            20, 21, 22,  20, 22, 23
        ];

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        return buffer;
    }
}

export { SnubCube };