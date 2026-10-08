import vertShaderSrc from './shaders/transform.vert.js';
import fragShaderSrc from './shaders/transform.frag.js';
import {
    createIdentityMat4,
    createTranslationMat4,
    createRotationZMat4,
    multiplyMat4,
} from './lib/utils.js';

class Scene {
    constructor(gpu) {
        this.program = gpu.createProgram(vertShaderSrc, fragShaderSrc);

        this.pipa = gpu.createShape(
            [
                [
                    // Triângulo vermelho
                    0.0, 0.5, 0.0, 1.0,
                    -0.225, 0.15, 0.0, 1.0,
                    0.0, -0.3, 0.0, 1.0,

                    // Triângulo amarelo
                    0.0, 0.5, 0.0, 1.0,
                    0.225, 0.15, 0.0, 1.0,
                    0.0, -0.3, 0.0, 1.0,
                ],
                [
                    // Vermelho
                    1.0, 0.0, 0.0, 1.0,
                    1.0, 0.0, 0.0, 1.0,
                    1.0, 0.0, 0.0, 1.0,

                    // Amarelo
                    1.0, 0.85, 0.0, 1.0,
                    1.0, 0.85, 0.0, 1.0,
                    1.0, 0.85, 0.0, 1.0,
                ],
            ],
            6
        );

        this.caudaCima = gpu.createShape(
            [
                [
                    // Triângulo laranja de cima
                    0.0, -0.3, 0.0, 1.0,
                    0.0, -0.5, 0.0, 1.0,
                    0.12, -0.42, 0.0, 1.0,
                ],
                [
                    1.0, 0.45, 0.0, 1.0,
                    1.0, 0.45, 0.0, 1.0,
                    1.0, 0.45, 0.0, 1.0,
                ],
            ],
            3
        );

        this.caudaBaixo = gpu.createShape(
            [
                [
                    // Triângulo laranja de baixo
                    0.06, -0.46, 0.0, 1.0,
                    0.06, -0.66, 0.0, 1.0,
                    0.18, -0.58, 0.0, 1.0,
                    
                ],
                [
                    1.0, 0.45, 0.0, 1.0,
                    1.0, 0.45, 0.0, 1.0,
                    1.0, 0.45, 0.0, 1.0,
                ],
            ],
            3
        );

        this.parts = [
            {
                shape: this.pipa,
                uniform: gpu.createUniform(
                    this.program,
                    createIdentityMat4()
                ),
                pivot: { x: 0.0, y: -0.3 },
                phase: 0,
                speed: 0.02,
                range: 0.2,
                rotationPhase: 0,
                maxAngle: 40,
                rotationSpeed: 0.02,
                rotationDirection: 1,
            },
            {
                shape: this.caudaCima,
                uniform: gpu.createUniform(
                    this.program,
                    createIdentityMat4()
                ),
                pivot: { x: 0.0, y: -0.3 },
                phase: 0,
                speed: 0.02,
                range: 0.2,
                rotationPhase: 0,
                maxAngle: 40,
                rotationSpeed: 0.04,
                rotationDirection: -1,
            },
            {
                shape: this.caudaBaixo,
                uniform: gpu.createUniform(
                    this.program,
                    createIdentityMat4()
                ),
                pivot: { x: 0.06, y: -0.46 },
                phase: 0,
                speed: 0.02,
                range: 0.2,
                rotationPhase: 0,
                maxAngle: 40,
                rotationSpeed: 0.04,
                rotationDirection: 1,
            },
        ];
    }

    rotationAroundPivot(angle, pivot, translateY = 0) {
        const toOrigin = createTranslationMat4(
            -pivot.x,
            -pivot.y,
            0
        );

        const rotation = createRotationZMat4(angle);

        const back = createTranslationMat4(
            pivot.x,
            pivot.y + translateY,
            0
        );

        return multiplyMat4(
            back,
            multiplyMat4(rotation, toOrigin)
        );
    }

    getRotationAngle(part) {
        part.rotationPhase += part.rotationSpeed;
        const movement = (1 - Math.cos(part.rotationPhase)) / 2;
        const maxAngle = part.maxAngle * Math.PI / 180;

        return part.rotationDirection * maxAngle * movement;
    }

    updateTransforms() {
        const pipa = this.parts[0];
        const caudaCima = this.parts[1];
        const caudaBaixo = this.parts[2];

        // A pipa controla o deslocamento vertical do conjunto.
        pipa.phase += pipa.speed;
        const translateY = pipa.range * Math.sin(pipa.phase);

        const pipaAngle = this.getRotationAngle(pipa);

        const pipaModel = this.rotationAroundPivot(
            pipaAngle,
            pipa.pivot,
            translateY
        );

        // A cauda de cima gira em torno do ponto onde se conecta à pipa.
        const caudaCimaAngle = this.getRotationAngle(caudaCima);

        const caudaCimaLocal = this.rotationAroundPivot(
            caudaCimaAngle,
            caudaCima.pivot
        );

        const caudaCimaModel = multiplyMat4(pipaModel, caudaCimaLocal);

        // A cauda de baixo gira em torno do ponto onde se conecta à de cima.
        const caudaBaixoAngle = this.getRotationAngle(caudaBaixo);

        const caudaBaixoLocal = this.rotationAroundPivot(
            caudaBaixoAngle,
            caudaBaixo.pivot
        );

        const caudaBaixoModel = multiplyMat4(
            caudaCimaModel,
            caudaBaixoLocal
        );

        pipa.uniform.data.set(pipaModel);
        caudaCima.uniform.data.set(caudaCimaModel);
        caudaBaixo.uniform.data.set(caudaBaixoModel);
    }


    draw(gpu) {
    this.updateTransforms();

    for (const part of this.parts) {
        gpu.writeBuffer(part.uniform.buffer, part.uniform.data);
        gpu.draw(
            this.program,
            part.shape,
            [part.uniform.bindGroup]
        );
    }
}
}

export default Scene;

