import * as THREE from 'three';
import Renderer from './Renderer';
import gsap from 'gsap';
import Sizes from './Utils/Sizes';
import GLTFModelLoader from './GLTFLoader';
import Time from './Utils/Time';
import Camera from './Camera';
import Light from './Light';

let instance = null;

export default class Experience {
    constructor(_canvas, _modelPath) {
        if (instance)
            return instance;

        instance = this;

        //Global access
        window.experience = this;

        this.canvas = _canvas;
        this.modelPath = _modelPath;
        this.scene = new THREE.Scene();
        this.mouse = new THREE.Vector2();
        this.sizes = new Sizes();
        this.camera = new Camera();
        this.renderer = new Renderer()
        this.gltfLoader = new GLTFModelLoader();
        this.time = new Time();
        this.light = new Light();

        this.currentIntersect = null;

        this.mouseMoveEvent();
        this.clickEvent();
        
        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        //Time click event
        this.time.on('tick', () => {
            this.update();
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update();
        this.renderer.update()
    }

    mouseMoveEvent() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX / this.sizes.width * 2 - 1
            this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1
        })
    }

    clickEvent() {
        window.addEventListener('click', () => {
            if (this.currentIntersect) {
                if (this.currentIntersect.object.name == "SM_Button_1_1") {
                    moveToSelectedObject(this.currentIntersect.object, 1, 1);
                } else if (this.currentIntersect.object.name == "SM_Button_1_2") {
                    moveToSelectedObject(this.currentIntersect.object, -1, 1);
                } else if (this.currentIntersect.object.name == "SM_Button_2_1") {
                    moveToSelectedObject(this.currentIntersect.object, -1, 1);
                } else if (this.currentIntersect.object.name == "SM_Button_2_2") {
                    moveToSelectedObject(this.currentIntersect.object, -1, 1);
                } else if (this.currentIntersect.object.name == "SM_Button_3_1") {
                    moveToSelectedObject(this.currentIntersect.object, -1, 1);
                } else if (this.currentIntersect.object.name == "SM_Button_3_2") {
                    moveToSelectedObject(this.currentIntersect.object, -1, 1);
                }
            }
        })
    }
}