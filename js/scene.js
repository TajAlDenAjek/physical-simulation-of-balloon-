import * as THREE from 'three';


import Skybox from './sceneSubjects/Skybox'; // importing Skybox
import Ballon from './sceneSubjects/Ballon'; // importing Ballon
import { ConfigOptions } from './gui'; // importing Configuration

export const scene = new THREE.Scene();

const skybox = new Skybox(scene,800,0.0005);
const ballon = new Ballon(scene , 3 , 3  , 3, 3 ,  3 , 3 , 3 , 'white');


export function objectsAnimations()
{
    skybox.AnimateSkyBox();
}

