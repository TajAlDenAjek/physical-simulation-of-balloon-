import * as THREE from 'three';


import Skybox from './sceneSubjects/Skybox'; // importing Skybox
import Ballon from './sceneSubjects/Ballon'; // importing Ballon
import { ConfigOptions , Constants } from './gui'; // importing Configuration

export const scene = new THREE.Scene();

const skybox = new Skybox(scene,800,0.0000);
// const ballon = new Ballon(scene , 3 , 3  , 3, 3 ,  3 , 3 , 3 , 'white');
const ballon = new Ballon(scene , 3 , ConfigOptions.Mass , 0 , ConfigOptions.Raduis , ConfigOptions.Fire , ConfigOptions.Fire , ConfigOptions.WindVeloctiy , 'white') ;

export function objectsAnimations(timeElapsed) // cnt for debug
{
    skybox.AnimateSkyBox();
    
    ballon.AnimateBallon(ConfigOptions , timeElapsed , Constants ) ; // cnt for debug
}