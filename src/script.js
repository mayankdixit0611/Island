import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap';


/**
 * Base
 */
// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.canvas-three')

// Scene
const scene = new THREE.Scene()

const objects = [];

let gltfObjects;



/**
 * Models
 */
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
//gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
//Add light
var light = new THREE.AmbientLight(0xffffff);
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xe0b47a, 3);
directionalLight.position.set(0, 4, 3)
//directionalLight.castShadow = true;
scene.add(directionalLight);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
//scene.add(directionalLightHelper);

// var directionalLight2 = new THREE.PointLight(0xbfceff, 0.5);
// directionalLight2.position.set(6, 4, 4);
// scene.add(directionalLight2);

// var directionalLight3 = new THREE.PointLight(0xe0b47a, 0.5);
// directionalLight3.position.set(-6, 4, -4);
// scene.add(directionalLight3);

// var directionalLight4 = new THREE.PointLight(0xbfceff, 0.5);
// directionalLight4.position.set(6, 4, -4);
// scene.add(directionalLight4);


gltfLoader.load(
    '/models/Island/island.gltf',
    (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.00025, 0.00025, 0.00025)
        model.position.set(0, 0, 0);

        gltfObjects = gltf.scene;



        model.traverse(function (child) {
            objects.push(child);
            //child.receiveShadow =true;
            //console.log(child.name);
            if (child.name == "SM_LowerBody_1" || child.name == "SM_LowerBody_2" || child.name == "SM_LowerBody_3") {
                child.material.metalness = 0.4
            } else if (child.name == "SM_Glass_1" || child.name == "SM_Glass_2" || child.name == "SM_DoorPanel_1" || child.name == "SM_DoorPanel_2") {
                console.log(child)
            }
            if (child.name == "SM_Water") {
                child.receiveShadow = true;
                child.material.opacity = 0.7;
            } else {
                child.castShadow = true;
            }
        });
        scene.add(model)
    }
)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
let currentIntersect = null
const rayOrigin = new THREE.Vector3(-3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)
})

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', () => {
    if (currentIntersect) {
        if (currentIntersect.object.name == "SM_Button_1_1") {
            moveToSelectedObject(currentIntersect.object, 1, 1);
        } else if (currentIntersect.object.name == "SM_Button_1_2") {
            moveToSelectedObject(currentIntersect.object, -1, 1);
        } else if (currentIntersect.object.name == "SM_Button_2_1") {
            moveToSelectedObject(currentIntersect.object, -1, 1);
        } else if (currentIntersect.object.name == "SM_Button_2_2") {
            moveToSelectedObject(currentIntersect.object, -1, 1);
        } else if (currentIntersect.object.name == "SM_Button_3_1") {
            moveToSelectedObject(currentIntersect.object, -1, 1);
        } else if (currentIntersect.object.name == "SM_Button_3_2") {
            moveToSelectedObject(currentIntersect.object, -1, 1);
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.25, 16)
camera.position.set(100000, 80000, 3);
scene.add(camera)

// gui.add( camera.position , 'z', 10000, 10000000 ).step(100)
// gui.add( camera.position , 'x', 10000, 10000000 ).step(1000)
// gui.add( camera.position , 'y', 10000, 10000000 ).step(1000)

// Controls
const controls = new OrbitControls(camera, canvas)

//set zoom level
controls.minDistance = 3;
controls.maxDistance = 8;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xffffff);
renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    // Cast a ray from the mouse and handle events
    raycaster.setFromCamera(mouse, camera)


    const intersects = raycaster.intersectObjects(objects)

    if (intersects.length) {
        currentIntersect = intersects[0]
    } else {
        currentIntersect = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


function moveToSelectedObject(object, x, y) {
    var aabb = new THREE.Box3().setFromObject(object);
    var center = aabb.getCenter(new THREE.Vector3());
    var size = aabb.getSize(new THREE.Vector3());
    gsap.to(camera.position, {
        duration: 1,
        x: center.x + x,
        y: center.y + y,
        z: center.z + size.z, // maybe adding even more offset depending on your model
        onUpdate: function () {
            camera.fov = 50
            camera.updateProjectionMatrix();
        }
    });
}