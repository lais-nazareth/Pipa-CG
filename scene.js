import vertShaderSrc from './shaders/simple.vert.js';
import fragShaderSrc from './shaders/simple.frag.js';

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
        )
    }

    draw(gpu){
        gpu.draw(this.program, this.shape)
    }
}export default Scene;