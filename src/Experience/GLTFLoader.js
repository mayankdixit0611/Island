import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'
import Experience from './Experience';

export default class GLTFModelLoader{
    constructor(){
        this.experience = new Experience();
        this.gltfLoader = new GLTFLoader();
        this.scene = this.experience.scene;
        this.modelPath = this.experience.modelPath;

        this.loadModel();
    }

    loadModel(){
        this.gltfLoader.load(
            this.modelPath,
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(0.00025, 0.00025, 0.00025)
                model.position.set(0, 0, 0);          
        
                model.traverse(function (child) {
                    if (child.name == "SM_LowerBody_1" || child.name == "SM_LowerBody_2" || child.name == "SM_LowerBody_3") {
                        child.material.metalness = 0.4
                    } else if (child.name == "SM_Glass_1" || child.name == "SM_Glass_2" || child.name == "SM_DoorPanel_1" || child.name == "SM_DoorPanel_2") {
                        console.log(child)
                    }
                    if (child.name == "SM_Water") {
                        child.receiveShadow = true;
                        child.material.opacity = 0.7;
                    } else {
                        child.castShadow = true;
                    }
                });
                this.scene.add(model);
            }
        )
    }
}