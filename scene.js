import vertShaderSrc from './shaders/transform.vert.js';
import fragShaderSrc from './shaders/transform.frag.js';
import {createIdentityMat4, createTranslationMat4} from './lib/utils.js';

class Scene{
    constructor(gpu){
        this.program = gpu.createProgram(vertShaderSrc, fragShaderSrc);

        this.shape = gpu.createShape(
            [
                [
                //triangulo vermelho
                0.0, 0.5, 0.0, 1.0, //topo
                -0.225, 0.15, 0.0, 1.0, //esquerda
                0.0, -0.3, 0.0, 1.0, //base
                
                 //triangulo amarelo
                0.0, 0.5, 0.0, 1.0, //topo
                0.225, 0.15, 0.0, 1.0, //direita
                0.0, -0.3, 0.0, 1.0, //base
                    
                //triangulo laranja de cima
                0.0, -0.3, 0.0, 1.0, //topo
                0.0, -0.5, 0.0, 1.0, //esquerda
                0.12, -0.42, 0.0, 1.0, //direita

                //triangulo laranja de baixo 
                0.06, -0.46, 0.0, 1.0, //topo
                0.06, -0.68, 0.0, 1.0, //esquerda
                0.18, -0.6, 0.0, 1.0, //direita
                
            ],
            [
                //vermelho
                1.0, 0.0, 0.0, 1.0,   
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,

                //amarelo
                1.0, 0.85, 0.0, 1.0,
                1.0, 0.85, 0.0, 1.0,
                1.0, 0.85, 0.0, 1.0,
                
                //laranja
                1.0, 0.45, 0.0, 1.0,
                1.0, 0.45, 0.0, 1.0,
                1.0, 0.45, 0.0, 1.0,

                //laranja
                1.0, 0.45, 0.0, 1.0,
                1.0, 0.45, 0.0, 1.0,
                1.0, 0.45, 0.0, 1.0,
            ]
        ],
            12
        );

        this.translateY = 0.0; //posição vertical de inicio
        this.phase = 0.0; //argumento da função seno -> fase da oscilação
        this.speed = 0.02;
        this.range = 0.2;
        this.uniform = gpu.createUniform(this.program, createIdentityMat4());

    }

    updateTransform() {
        this.phase += this.speed; 
        
        //função seno para não precisar botar um if de quando for -1 desce e +1 sobe
        this.translateY = this.range * Math.sin(this.phase);
        
        const model = createTranslationMat4(0, this.translateY, 0);

        this.uniform.data.set(model);
    }

    
    draw(gpu){
        this.updateTransform();
        gpu.writeBuffer(this.uniform.buffer, this.uniform.data);
        gpu.draw(this.program, this.shape, [this.uniform.bindGroup]);
    }

}export default Scene;