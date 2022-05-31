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
        this.panningToVisibleAreaOnly();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(18, this.sizes.width / this.sizes.height, 0.25, 16);
        this.instance.position.set(100000, 80000, 3);
        this.scene.add(this.instance);
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.screenSpacePanning = false;

        this.controls.enableRotate = true;
        this.controls.enablePan = false;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN
        }
        this.controls.touches = {
            ONE: THREE.TOUCH.DOLLY_PAN
        }        
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }

    panningToVisibleAreaOnly(){
        const minPan = new THREE.Vector3(-2, -2, -2);
        const maxPan = new THREE.Vector3(2, 2, 2);

        const _v = new THREE.Vector3();

        this.controls.addEventListener("change", () => {
            _v.copy(this.controls.target);
            this.controls.target.clamp(minPan, maxPan);
            _v.sub(this.controls.target);
            this.instance.position.sub(_v);
        })
    }
}
