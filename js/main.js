import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

import * as fullScene from './scene.js';
import gui from './gui.js';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls.js' // import the camera controller

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
const controls = new TrackballControls(camera , renderer.domElement) ;
	
/*
	Left to do:
		1. Camera Control
		2. Making the Camera stick to the ballon ??
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


function animate()
{
	// update controls
	controls.update() ;
	const timeElapsed = clock.getElapsedTime();
	fullScene.objectsAnimations(timeElapsed); // pass cnt for debug
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