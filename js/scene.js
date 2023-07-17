import * as THREE from 'three';


import Skybox from './sceneSubjects/Skybox'; // importing Skybox
import Ballon from './sceneSubjects/Ballon'; // importing Ballon
import { ConfigOptions , Constants } from './gui'; // importing Configuration

export const scene = new THREE.Scene();

const skybox = new Skybox(scene,2000,0.0000);
const CabinWidth = 3 ;
const HeightOfBallon = 0 ; 
const ballon = new Ballon(scene , CabinWidth , HeightOfBallon , 'white' ) ;


export function objectsAnimations(camera , timeElapsed) // cnt for debug
{
    skybox.AnimateSkyBox();
    ballon.AnimateBallon(ConfigOptions , timeElapsed , Constants ) ; // cnt for debug
    camera.position.x = ballon.FullBallon.position.x ;
    camera.position.y = ballon.FullBallon.position.y ;
    camera.position.z = ballon.FullBallon.position.z + 50;

}