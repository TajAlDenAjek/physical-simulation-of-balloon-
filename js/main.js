import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

import * as fullScene from './scene.js';
import gui from './gui.js';
import {MapControls} from 'three/examples/jsm/controls/MapControls' // import the camera controller

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