import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);





camera.position.z = 5;
const geometry = new THREE.BoxGeometry( 2, 2,2 );
const material = new THREE.MeshBasicMaterial( { color: 0xfffff0 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
function animate()
{
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