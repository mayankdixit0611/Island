import * as THREE from 'three'
import { gsap } from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Loaders
 */
export default class LoadingBar {
    constructor(scene) {
        this.loadingBar = document.querySelector(".loading-bar");
        this.loadingText = document.querySelector(".loading-text");
        
        this.scene = scene;
        //Overlay
        this.overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: { value: 0.4 }
            },
            vertexShader: `
        void main(){
            gl_Position = vec4(position, 1.0);  //projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
            fragmentShader: `
        uniform float uAlpha;
        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
        })
        const loadingManager = new THREE.LoadingManager(
            () => {
                console.log('loaded')
                this.loadingText.innerHTML = `Loading...100%.`;
                gsap.delayedCall(0.5, () => {
                    gsap.to(this.overlayMaterial.uniforms.uAlpha, { duration: 2, value: 0 });
                    this.loadingBar.style.transform = ''
                    this.loadingText.style.display = 'none'
                })

            },
            (itemUrl, itemLoaded, itemTotal) => {
                console.log('progress', itemUrl, itemLoaded, itemTotal)
                const progressRatio = itemLoaded / itemTotal;
                const percentage = parseInt((itemLoaded/itemTotal) * 100);
                this.loadingText.innerHTML = `Loading...${percentage}%`;
                this.loadingBar.style.transform = `scaleX(${progressRatio})`

            }

        );
        this.loadingManager = loadingManager
        this.gtfLoader = new GLTFLoader(loadingManager)
    }

    addToScene(){        
        const overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial);
        this.scene.add(overlay);
    }
}
