import * as THREE from 'three';


import Skybox from './sceneSubjects/Skybox'; // importing Skybox
import Ballon from './sceneSubjects/Ballon'; // importing Ballon


export const scene = new THREE.Scene();

const skybox = new Skybox(scene,50,0.005);
const ballon = new Ballon(scene , 3 , 3  , 3, 3 ,  3 , 3 , 3 , 'white');


export function objectsAnimations()
{
    skybox.AnimateSkyBox();
}

