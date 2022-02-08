import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Island {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.objects = this.experience.objects;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('island');
        }

        // Resource
        this.resource = this.resources.items.islandModel;

        this.setModel();
        //this.setAnimation()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(0.02, 0.02, 0.02)
        this.model.scale.set(0.00025, 0.00025, 0.00025)
        this.model.position.set(0, 0, 0);
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                this.objects.push(child);
                if (child.name == "SM_Water") {
                    child.receiveShadow = true;
                    child.material.opacity = 0.7;
                } else
                    child.castShadow = true;
            }
        })
    }

    setAnimation() {
        this.animation = {}

        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        // Actions
        this.animation.actions = {}

        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) => {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        // Debug
        if (this.debug.active) {
            const debugObject = {
                playIdle: () => {
                    this.animation.play('idle')
                },
                playWalking: () => {
                    this.animation.play('walking')
                },
                playRunning: () => {
                    this.animation.play('running')
                }
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}