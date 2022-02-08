import * as THREE from 'three';
import Renderer from './Renderer';
import gsap from 'gsap';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Camera from './Camera';
import Resources from './Utils/Resources';
import Sources from './Sources';
import World from './World/World';
import Debug from './Utils/Debug';

let instance = null;

export default class Experience {
    constructor(_canvas) {
        if (instance)
            return instance;

        instance = this;

        //Global access
        window.experience = this;

        this.canvas = _canvas;
        this.objects = [];
        this.currentIntersect = null;

        this.debug = new Debug()
        this.resources = new Resources(Sources);
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();
        this.sizes = new Sizes();
        this.camera = new Camera();
        this.mouse = new THREE.Vector2();
        this.time = new Time();
        this.renderer = new Renderer()
        this.world = new World();
        
        
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
        //this.world.update();
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
                //if (this.currentIntersect.object.name == "SM_Button_1_1") {
                    this.moveToSelectedObject(this.currentIntersect.object, 1, 1);
                // } else if (this.currentIntersect.object.name == "SM_Button_1_2") {
                //     moveToSelectedObject(this.currentIntersect.object, -1, 1);
                // } else if (this.currentIntersect.object.name == "SM_Button_2_1") {
                //     moveToSelectedObject(this.currentIntersect.object, -1, 1);
                // } else if (this.currentIntersect.object.name == "SM_Button_2_2") {
                //     moveToSelectedObject(this.currentIntersect.object, -1, 1);
                // } else if (this.currentIntersect.object.name == "SM_Button_3_1") {
                //     moveToSelectedObject(this.currentIntersect.object, -1, 1);
                // } else if (this.currentIntersect.object.name == "SM_Button_3_2") {
                //     moveToSelectedObject(this.currentIntersect.object, -1, 1);
                // }
            }
        })
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }

    moveToSelectedObject(object, x, y) {
        var aabb = new THREE.Box3().setFromObject(object);
        var center = aabb.getCenter(new THREE.Vector3());
        var size = aabb.getSize(new THREE.Vector3());
        gsap.to(this.camera.instance.position, {
            duration: 1,
            x: center.x,
            y: center.y,
            z: center.z + size.z, // maybe adding even more offset depending on your model
            onUpdate: function () {
                this.camera.instance.fov = 50
                this.camera.instance.updateProjectionMatrix();
            }
        });
    }
}