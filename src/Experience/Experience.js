import * as THREE from 'three';
import Renderer from './Renderer';
import gsap from 'gsap';
import Sizes from './Utils/Sizes';
import Cursor from './Utils/Cursor';
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
        this.cursor = new Cursor();
        this.camera = new Camera();
        this.mouse = new THREE.Vector2();
        this.time = new Time();
        this.renderer = new Renderer()
        this.world = new World();              

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })
        // Cursor movement event
        this.cursor.on('cursor_movement', () => {
            this.mouseMoveEvent();
        })
        // Click event
        this.cursor.on('click', () => {
            this.clickEvent();
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
        this.world.update();
        this.renderer.update()
    }

    mouseMoveEvent() {
        this.mouse.x = this.cursor.x / this.sizes.width * 2 - 1
        this.mouse.y = - (this.cursor.y / this.sizes.height) * 2 + 1
    }

    clickEvent() {
        this.world.click();
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
}