import * as THREE from 'three';


//Ambient Light
export const addAmbientLight = (color, intensity) => {
    return new THREE.AmbientLight(color, intensity);
}

//Point Light
export const addPointLight = (color, intensity, distance, position = {}, rotation = {}, castShadow = false) => {
    const pointLight = new THREE.PointLight(color, intensity);
    if (Object.keys(position).length !== 0)
        pointLight.position.set(position.x, position.y, position.z);
    if (Object.keys(rotation).length !== 0)
        pointLight.position.set(rotation.x, rotation.y, rotation.z);
    if (castShadow)
        pointLight.castShadow = castShadow;
    if(distance)
        pointLight.distance = distance;

    return pointLight;
}

export const addDirectionalLight = (color, intensity, position = {}, rotation = {}, castShadow = false) => {
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    if (Object.keys(position).length !== 0)
        directionalLight.position.set(position.x, position.y, position.z);
    if (Object.keys(rotation).length !== 0)
        directionalLight.position.set(rotation.x, rotation.y, rotation.z);
    if (castShadow)
        directionalLight.castShadow = castShadow;

    return directionalLight;
}


export const setRoughNess = (mesh, value) => {
    mesh.material.roughness = value;
}

export const setColor = (mesh, value) => {
    mesh.material.color.setHex(value);
}

export const setMetalNess = (mesh, value) => {
    mesh.material.metalness = value;
}