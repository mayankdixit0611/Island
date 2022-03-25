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

        const intersects = this.raycaster.intersectObjects(this.objects, false);
        if(intersects.length){
            if(this.experience.currentIntersect !== intersects[0].object){
                if(this.experience.currentIntersect){
                    this.experience.currentIntersect.material.color.setHex(this.experience.currentIntersect.currentHex);
                }
                this.experience.currentIntersect = intersects[0].object;
                this.experience.currentIntersect.currentHex = this.experience.currentIntersect.material.color.getHex();
                this.experience.currentIntersect.currentMaterialMap = this.experience.currentIntersect.material.map;
                this.experience.currentIntersect.material.map = null;
                this.experience.currentIntersect.material.needsUpdate = true;
                this.experience.currentIntersect.material.color.setHex(0xd91e18);
                this.showTooltip();
            }
        }else{
            if (this.experience.currentIntersect) {
                this.experience.currentIntersect.material.color.setHex(this.experience.currentIntersect.currentHex);
                this.experience.currentIntersect.material.map = (this.experience.currentIntersect.currentMaterialMap);
                this.experience.currentIntersect.material.needsUpdate =true;
              }
        
              this.experience.currentIntersect = null;
              this.hideTooltip();
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
    
    showTooltip() {
        if (!this.experience.currentIntersect) return this.hideTooltip();

        const t = document.getElementById("tooltip");
        const datum = this.experience.currentIntersect.userData;

        t.style.left = this.experience.tooltip.x + 5 + "px";
        t.style.top = this.experience.tooltip.y + 5 + "px";

        t.innerHTML = this.setTooltipData(datum);
    }

    hideTooltip() {
        const t = document.getElementById("tooltip");

        t.style.left = "-350px";
        t.innerHTML = "";
    }

    setTooltipData(land) {
        const fieldsNotShown = [];
        let html = '';

        Object.keys(land).filter(k => {
            return fieldsNotShown.indexOf(k) === -1;
        }).forEach(k => {
            html += `
                <div class="tooltip-row">
                  <label>${k}:</label> 
                  <div>${land[k]}</div>
                </div>
              `
        });

        return html;
    }
}