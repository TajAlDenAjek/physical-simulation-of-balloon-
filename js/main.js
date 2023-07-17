import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

import * as fullScene from './scene.js';
import gui from './gui.js';
import {MapControls} from 'three/examples/jsm/controls/MapControls.js' // import the camera controller

const clock = new THREE.Clock(); // for calculating accelration and velocity

const scene=fullScene.scene;

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,10000);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// init MapControls
const controls = new MapControls(camera , renderer.domElement) ;



/*
	Left to do:
		3. Ballon Model
		4. Maybe changing the skybox 
		4.5. the gravity shouldn't be entered from gui ( it should be calculated from mass of Eearth)
		5. what if the speed of landing was too high ? (crash .. game over etc...)
		6. what will happen if temprature is too high (will the ballon handle such a big tempreature )
		check what will happen if:
			1. Mass is zero
			2. gravity is very small 
			3. radius of ballon too small or too big	
			4. air temprature is below zero (it is not flying !!) bug

*/	


// cursor 
let cursor = {
    x:0,
    y:0
};
let key = ' ' ;
let wheel = 0 ;
// updating the cursor axis
window.addEventListener( 'mousemove' , (event) =>{
    cursor.x = event.clientX  / sizes.width - 0.5 ;
    cursor.y = -(event.clientY / sizes.height - 0.5); 
});
window.addEventListener('keydown' , (event) =>{
		key = event.key ;
		console.log(key);
});
window.addEventListener( 'wheel' , (event)=>{
	    wheel = event.wheelDelta; 
		console.log(wheel) ;
});
function checkInside( Axis ){
	let skyboxsize = 800 ;
	if(Axis.y != undefined ){
		return Axis.y > 0 && Axis.y < skyboxsize * 2.3; 
	}
	if(Axis.x != undefined ){
		return Axis.x > -skyboxsize -200 && Axis.x < skyboxsize  + 200; 
	}
	if(Axis.z != undefined ){
		return Axis.z > -skyboxsize -200 && Axis.z < skyboxsize + 200; 
	}
}
function MoveCamera(){
    let Movespeed = 20 ;
	let x = camera.position.x ;
	let y = camera.position.y ;
	let z = camera.position.z ;
    if(key === 'w'|| key == 'ArrowUp'){
		if(checkInside({z: z - Movespeed}) )
        	camera.position.z -= Movespeed ;
    }
    if(key == 'a'|| key == 'ArrowLeft' ){
		if(checkInside({x: x - Movespeed}) )
        	camera.position.x -= Movespeed ;
    }
    if(key == 'd'|| key == 'ArrowRight'){
		if(checkInside({x: x + Movespeed}))
        	camera.position.x += Movespeed ;
    }
    if(key == 's' || key == 'ArrowDown'){
		if(checkInside({z: z + Movespeed}) )
        	camera.position.z += Movespeed ;
    }
    if(wheel != 0){
		if(checkInside({y: y + wheel / 120 * 5 }))
        	camera.position.y += wheel / 120 * 5 ;
    }
    wheel = 0 ;
    key = ' ';
}

function animate()
{
	// update controls
	
	// uncomment if you need to have more control on camera and comment updating cameara in scene.js
	// MoveCamera() ;

	controls.update() ;
	const timeElapsed = clock.getElapsedTime();
	fullScene.objectsAnimations(camera , timeElapsed); // pass cnt for debug
 	requestAnimationFrame( animate );
 	renderer.render(scene,camera);
}
if ( WebGL.isWebGLAvailable() )
{
	// initializations here
	animate();

} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}