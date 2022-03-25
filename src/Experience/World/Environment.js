import * as THREE from 'three'
import Experience from '../Experience.js'
import { addDirectionalLight, addPointLight } from '../Utils/three-helper.js';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setAmbientLight();
        this.setSunLight()
        //this.setEnvironmentMap()
    }

    setAmbientLight() {
        this.ambientlight = new THREE.AmbientLight('white',10);
        this.scene.add(this.ambientlight);

        // this.heim = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
        // this.scene.add(this.heim);
    }

    setSunLight() {
        //Add point light in top
        this.pointLight = addPointLight(0xffffff, 1, 1000, { x: 0, y: 8, z: 0 }, {}, false);
        this.scene.add(this.pointLight);

        //Add directional light
        this.sunLight = addDirectionalLight(0xffffff, 1.887, { x: 8, y: 8, z: 8 }, {}, false);
        this.scene.add(this.sunLight);

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(-5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(-5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(-5)
                .max(5)
                .step(0.001)

                this.debugFolder
                .add(this.pointLight, 'intensity')
                .name('pointLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .add(this.pointLight.position, 'x')
                .name('pointLightX')
                .min(-5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.pointLight.position, 'y')
                .name('pointLightY')
                .min(-5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.pointLight.position, 'z')
                .name('pointLightZ')
                .min(-5)
                .max(5)
                .step(0.001)

            // this.debugFolder.add(this.sunLight.shadow.mapSize, 'x')
            // .name('mapSize1').min(-5)
            // .max(5)
            // .step(0.001);

            // this.debugFolder.add(this.sunLight.shadow.mapSize, 'y')
            // .name('mapSize2').min(-5)
            // .max(5)
            // .step(0.001);

            this.debugFolder.add(this.sunLight.shadow, 'normalBias')
                .name('normalBias1')
                .min(-5)
                .max(5)
                .step(0.001);

        }
    }

    setEnvironmentMap() {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}