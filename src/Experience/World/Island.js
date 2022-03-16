import * as THREE from 'three'
import {
    MeshStandardMaterial
} from 'three';
import Experience from '../Experience.js'
import gsap from "gsap"
import { Water } from '../Water.js';

export default class Island {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.objects = this.experience.objects;
        this.camera = this.experience.camera;
        this.sun= null;
        this.water = null;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('island');
        }

        // Resource
        this.resource = this.resources.items.islandModel;

        this.setModel();
        this.createWater();
        //this.setAnimation()
    }

    createWater(){
        this.sun = new THREE.Vector3();
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

        const waterMaterial = '/images/waternormals.jpeg';
        this.water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load(
              waterMaterial,
              function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
              }
            ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x259CC8,
            distortionScale: 3.7
          });
      
          this.water.rotation.x = -Math.PI / 2;
      
          this.water.material.uniforms.size.value = 15;

          this.scene.add(this.water);
    }
    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(0.02, 0.02, 0.02)
        this.model.scale.set(0.00025, 0.00025, 0.00025)
        this.model.position.set(0, 0, 0);
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                console.log(child);
                this.objects.push(child);

                child.receiveShadow = true;
                child.castShadow = true;
            }
        });

        
        document.getElementById('loader').style.display = 'none';
    }

    update() {
        // this.animation.mixer.update(this.time.delta * 0.001)

    }

    click() {
        if (this.experience.currentIntersect) {
            // if(this.experience.currentIntersect.object.name !== 'SM_Water')
            //     this.moveToSelectedObject(this.experience.currentIntersect.object, 1, 1)
        }
    }

    mouseMove() {
        this.hideTooltip();
        if (this.experience.currentIntersect && this.experience.currentIntersect.object &&
            this.experience.currentIntersect.object instanceof THREE.Mesh) {
            if (this.experience.currentIntersect.object.name === 'Box213') {
                const mesh = this.experience.currentIntersect.object;
                console.log(mesh);
                if (mesh.material.color.getHex() === 16711680)
                    mesh.material.color.setHex(this.experience.currentHex);
                this.getLandFromCSVData(mesh);
                this.experience.currentHex = mesh.material.color.getHex()
                if (mesh.material.color.getHex() !== 16711680)
                    mesh.material.color.setHex(0xff0000)
            }
        }
    }

    getLandFromCSVData(meshLand) {
        this.experience.lands.forEach((data, index) => {
            if (data['VLAND ID'] === meshLand.name || meshLand.name === "Box213") {
                const html = this.setTooltipData(data);
                this.showTooltip(html);
            }
        });
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

    showTooltip(html) {
        const t = document.getElementById("tooltip");

        t.style.left = this.experience.tooltip.x + 5 + "px";
        t.style.top = this.experience.tooltip.y + 5 + "px";

        t.innerHTML = html;
    }

    hideTooltip() {
        const t = document.getElementById("tooltip");

        t.style.left = "-350px";
        t.innerHTML = "";
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
            onUpdate: () => {
                this.camera.instance.fov = 50
                this.camera.instance.updateProjectionMatrix();
            }
        });
    }
}