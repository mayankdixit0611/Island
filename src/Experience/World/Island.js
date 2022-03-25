import * as THREE from 'three';
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
        this.sun = null;
        this.water = null;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('island');
        }

        // Resource
        this.resource = this.resources.items.islandModel;

        this.setModel();
        //this.createWater();
        //this.setAnimation()
    }

    createWater() {
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
        this.model.scale.set(this.experience.scale, this.experience.scale, this.experience.scale)
        this.model.position.set(0, 0, 0);
        this.scene.add(this.model)

        let counter=1;
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                            

                child.receiveShadow = true;
                child.castShadow = true;
                //this.objects.push(child);
                this.experience.lands.forEach((data, index) => {
                    if (data['VLAND ID'].trim() === child.name.trim()) {
                       child.userData = data;                       
                       this.objects.push(child);
                       //console.log(child);
                       counter++
                    }
                });
                
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