import * as THREE from 'three'
import {
    MeshStandardMaterial
} from 'three';
import Experience from '../Experience.js'
import gsap from "gsap"
import { Water } from '../Water.js';

export default class Ocean {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.objects = this.experience.objects;
        this.camera = this.experience.camera;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('ocean');
        }

        // Resource
        this.resource = this.resources.items.oceanModel;

        this.setModel();
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.scale.set(this.experience.scale, this.experience.scale, this.experience.scale)
        this.model.position.set(0, 0, 0);
        this.scene.add(this.model)

    
        document.getElementById('loader').style.display = 'none';
    }
}