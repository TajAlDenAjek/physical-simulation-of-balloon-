import * as THREE from 'three';


import Skybox from './sceneSubjects/Skybox'; // importing Skybox
import Ballon from './sceneSubjects/Ballon'; // importing Ballon
import { ConfigOptions , Constants } from './gui'; // importing Configuration

export const scene = new THREE.Scene();

const skyBoxSize = 5000;
const skybox = new Skybox(scene,skyBoxSize,0.0000);
const CabinWidth = 3 ;
const HeightOfBallon = 0 ; 
const ballon = new Ballon(scene , skyBoxSize , HeightOfBallon , 'white' ) ;



export function objectsAnimations(camera , cursor, wheel , timeElapsed) // cnt for debug
{
    camera.position.x = ballon.FullBallon.position.x +  Math.sin(cursor.x ) * 80 ;
	camera.position.z = ballon.FullBallon.position.z +  Math.cos(cursor.x ) * 80 - wheel  ;
    camera.position.y = ballon.FullBallon.position.y +  Math.sin(cursor.y ) * 80 ;
    

	camera.lookAt(new THREE.Vector3(ballon.FullBallon.position.x , ballon.FullBallon.position.y , ballon.FullBallon.position.z )) ;

    skybox.AnimateSkyBox();
    let changeOnX = ballon.FullBallon.position.x ;
    let changeOnY = ballon.FullBallon.position.y ;
    let changeOnZ = ballon.FullBallon.position.z ;
    ballon.AnimateBallon(ConfigOptions , timeElapsed , Constants ) ; // cnt for debug
    changeOnX-= ballon.FullBallon.position.x ; 
    changeOnY-= ballon.FullBallon.position.y ; 
    changeOnZ-= ballon.FullBallon.position.z ; 
    changeOnX*= -1 ; 
    changeOnY*= -1 ; 
    changeOnZ*= -1 ; 
    camera.position.x += changeOnX ;
    camera.position.y += changeOnY ;
    camera.position.z += changeOnZ ;
    
 
}