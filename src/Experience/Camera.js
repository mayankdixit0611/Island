import * as THREE from 'three';
import Experience from './Experience';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();
        this.setControls();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(25, this.sizes.width / this.sizes.height, 0.25, 16);
        this.instance.position.set(100000, 80000, 3);
        this.scene.add(this.instance);
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25;

        //set zoom level
        this.controls.minDistance = 3;
        this.controls.maxDistance = 8;
        
        //this.controls.target.set(4.5, 0, 4.5);
        //this.controls.enablePan = false;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.screenSpacePanning = false;

        this.controls.enableRotate = false;
        this.controls.enablePan = true;
        this.controls.mouseButtons = {LEFT: THREE.MOUSE.PAN}
        this.controls.touches = {
            ONE: THREE.TOUCH.DOLLY_PAN
        }
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}