import * as THREE from 'three';
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience();
        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.raycaster = this.experience.raycaster;
        this.mouse = this.experience.mouse;
        this.camera = this.experience.camera;
        this.objects = this.experience.objects;

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    tick()
    {
        
        
        this.raycaster.setFromCamera(this.mouse, this.camera.instance);

        const intersects = this.raycaster.intersectObjects(this.objects);
        if(intersects.length){
            this.experience.currentIntersect = intersects[0];
        }else{
            this.experience.currentIntersect = null;
        }
        
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start


        this.trigger('tick')

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })

    }
}