import { mat4 } from "gl-matrix";

class Octahedron {
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
     * Рендерит октаэдр с заданным вращением
     * @param rotation Угол вращения в радианах
     */
    render(rotation: number) {
        const { gl } = this;

        // Настройка окружения рендеринга
        this.setupRenderEnvironment();

        // Создание матрицы проекции
        const projectionMatrix = this.createProjectionMatrix();

        // Создание и настройка матрицы модели-вида
        const modelViewMatrix = this.createModelViewMatrix(rotation);

        // Настройка атрибутов вершин
        this.setupVertexAttributes();

        // Установка uniform-переменных шейдера
        this.setShaderUniforms(projectionMatrix, modelViewMatrix);

        // Отрисовка октаэдра
        this.drawOctahedron();
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

    private createModelViewMatrix(rotation: number): mat4 {
        const modelViewMatrix = mat4.create();

        // Перемещаем октаэдр назад, чтобы он был виден
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);

        // Вращение по всем трем осям с разными скоростями
        mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 0, 1]);    // Z-ось
        mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.7, [0, 1, 0]); // Y-ось
        mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.3, [1, 0, 0]); // X-ось

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

    private drawOctahedron() {
        const { gl } = this;

        const vertexCount = 24; // 8 граней × 3 вершины (поскольку октаэдр состоит из 8 треугольников)
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

        // Вершины октаэдра (6 вершин × 3 координаты)
        const positions = [
            // Верхняя вершина
            0.0, 1.0, 0.0,
            // Нижняя вершина
            0.0, -1.0, 0.0,
            // Передняя вершина
            0.0, 0.0, 1.0,
            // Задняя вершина
            0.0, 0.0, -1.0,
            // Правая вершина
            1.0, 0.0, 0.0,
            // Левая вершина
            -1.0, 0.0, 0.0
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        return buffer;
    }

    private initColorBuffer(): WebGLBuffer {
        const { gl } = this;
        const buffer = gl.createBuffer()!;

        // Цвета для каждой вершины (можно сделать разными для каждой грани)
        const vertexColors = [
            [1.0, 0.0, 0.0, 1.0], // Красный - верх
            [0.0, 1.0, 0.0, 1.0], // Зеленый - низ
            [0.0, 0.0, 1.0, 1.0], // Синий - перед
            [1.0, 1.0, 0.0, 1.0], // Желтый - зад
            [1.0, 0.0, 1.0, 1.0], // Пурпурный - право
            [0.0, 1.0, 1.0, 1.0]  // Голубой - лево
        ];

        // Повторяем цвета для всех вершин в каждом треугольнике
        const colors = vertexColors.flatMap(color =>
            Array(4).fill(color).flat() // Каждая вершина участвует в 4 треугольниках
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        return buffer;
    }

    private initIndexBuffer(): WebGLBuffer {
        const { gl } = this;
        const buffer = gl.createBuffer()!;

        // Индексы для построения треугольников (8 граней × 3 вершины)
        const indices = [
            // Верхняя часть (4 треугольника)
            0, 2, 4,    // верх-перед-право
            0, 4, 3,    // верх-право-зад
            0, 3, 5,    // верх-зад-лево
            0, 5, 2,    // верх-лево-перед

            // Нижняя часть (4 треугольника)
            1, 4, 2,    // низ-право-перед
            1, 3, 4,    // низ-зад-право
            1, 5, 3,    // низ-лево-зад
            1, 2, 5     // низ-перед-лево
        ];

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        return buffer;
    }
}

export { Octahedron };