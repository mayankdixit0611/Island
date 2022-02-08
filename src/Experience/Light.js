import Experience from "./Experience";
import * as THREE from 'three';

export default class Light {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.setAmbientLight()
        this.setSunLight();
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight(0xe0b47a, 3)
        this.sunLight.castShadow = true
        //this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(0, 4, 3);
        this.scene.add(this.sunLight)
        // const directionalLightHelper = new THREE.DirectionalLightHelper(this.sunLight, 0.2);
        // this.scene.add(directionalLightHelper);
    }

    setAmbientLight() {
        this.ambientlight = new THREE.AmbientLight(0xffffff);
        this.scene.add(this.ambientlight);
    }
}