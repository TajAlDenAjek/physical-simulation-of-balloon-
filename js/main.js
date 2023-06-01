import * as THREE from 'three';

import Ballon from './Ballon'; // importing Ballon
import {MapControls} from 'three/examples/jsm/controls/MapControls' // import the camera controller
import * as dat from 'dat.gui'



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// creating ballon and drawing it.
const ballon = new Ballon(scene , 3 , 3  , 3, 3 ,  3 , 3 , 3 , 'white');
ballon.Draw() ;

camera.position.z = 5;

// init dat.gui 
const gui = new dat.GUI({ width:600});


let ConfigOptions ={ 
	Mass:1 , 
	Raduis:3,
	Fire:0,
	WindVeloctiy:0
};

gui.add(ConfigOptions , 'Mass' ).min(1).max(200).step(5) ;
gui.add(ConfigOptions , 'Raduis') ;
gui.add(ConfigOptions ,  'Fire').min(0).max(100).step(5) ;
gui.add(ConfigOptions , 'WindVeloctiy' ) ;


// init MapControls
const controls = new MapControls(camera , renderer.domElement) ;



let cnt = 0 ;

function animate()
{
	// update controls
	controls.update() ;
	
	
 	requestAnimationFrame( animate );
 	renderer.render( scene, camera );
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}


import WebGL from 'three/addons/capabilities/WebGL.js';

if ( WebGL.isWebGLAvailable() ) {

	// initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}