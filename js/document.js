import * as THREE from 'three';
import { RectAreaLight } from 'three';

import './style.css';

// init scene
const scene = new THREE.Scene();

// init clock 
const clock = new THREE.Clock();

const sizes = {
    width:window.innerWidth,
    height:window.innerHeight
};

// init light
const ambientLight = new THREE.AmbientLight('white' , 0.75 ) ; // color , intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff , 0.7 ) ;
directionalLight.position.set(1, 1 , -1) ;
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight , .3 ) ;
scene.add(directionalLightHelper) ;


const hemLight = new THREE.HemisphereLight('white' , 0x111111); // upper white , down near to black
// scene.add(hemLight );

const pointLight = new THREE.PointLight(0xffffff, 0.9 , 3 ) ; // color , intenity , distance where the light will start vanish
pointLight.position.set( 0 , -1 , 0) ; 
// scene.add(pointLight);

let rectLight = new THREE.RectAreaLight(0x4c00ff , 2 ,  3 ,3 ) ; // color , intensity , width , height  // it sournd the object from all direction in specific square
rectLight.lookAt(new THREE.Vector3(0 , 0 , 0 )) ;
scene.add(rectLight) ;


let spotLight = new THREE.SpotLight(0xffffff , 0.9 , 5 , Math.PI * .1  , 0.1 , 0. ) ; // color , intensity , distance , radius , the sharpness ,  decay
spotLight.target.position.set(3,-1,0) ;

let spotLightHelper = new THREE.SpotLightHelper(spotLight , .3 );

// scene.add(spotLightHelper) ;
// scene.add(spotLight.target) ;
// scene.add(spotLight);


// cursor 
let cursor = {
    x:0,
    y:0
};
window.addEventListener( 'mousemove' , (event) =>{
    cursor.x = event.clientX  / sizes.width - 0.5 ;
    cursor.y = -(event.clientY / sizes.height - 0.5); 
});

// selecting element
const canvas = document.querySelector('.webgl');

// init render
const renderer = new THREE.WebGLRenderer({
    canvas:canvas 
});

// set the size of render
renderer.setSize(sizes.width , sizes.height) ;



// init axeshelper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// init texture
const loadingManager = new THREE.LoadingManager() ;
const textureLoader = new THREE.TextureLoader(loadingManager);

// loading texturess
const doorTexture = textureLoader.load('door.jpg');

// doorTexture.repeat.x = 2 ;
// doorTexture.repeat.y = 2; 
// doorTexture.wrapS = THREE.MirroredRepeatWrapping ;
// doorTexture.wrapT = THREE.MirroredRepeatWrapping ;
// doorTexture.offset.x = 0.4 ;
// doorTexture.offset.y = 0.4 ;
doorTexture.rotation= Math.PI /4 ;
doorTexture.center.x = 0.5 ;
doorTexture.center.y = 0.5 ;
doorTexture.magFilter = THREE.NearestFilter ; // to make the texture smoother when zooming
/// material.map = doorTexture ; // to set the texture on the object 

// init mesh
const geometry = new THREE.BoxGeometry(1,1,1 , 1, 1,1);

const material = new THREE. MeshStandardMaterial({ color: 'white'});
// material.wireframe = true ; 
// material.color = 'red';
// material.transparent = true ; 
// material.opacity = 0.09 ; 


const mesh = new THREE.Mesh( geometry , material);
// scene.add(mesh);

let planeMaterial = new THREE.MeshStandardMaterial({color:0x111111}) ;
const plane = new THREE.Mesh( new THREE.PlaneGeometry(10 , 10 , 1 , 1 ), planeMaterial ) ;
plane.rotation.x = -Math.PI / 2 ;
plane.position.y = -2.8 ;
scene.add(plane);

const plane3 = new THREE.Mesh( new THREE.PlaneGeometry(10 , 10 , 1 , 1 ), planeMaterial ) ;
plane3.rotation.x = Math.PI / 2 ;
plane3.position.y = -2.8 ;
scene.add(plane3);

const plane2 = new THREE.Mesh( new THREE.PlaneGeometry(10 , 10 , 1 , 1 ), planeMaterial ) ;
plane2.rotation.x = Math.PI / 2 ;
plane2.position.y = 2.8 ;
scene.add(plane2);

const plane4 = new THREE.Mesh( new THREE.PlaneGeometry(10 , 10 , 1 , 1 ), planeMaterial ) ;
plane4.rotation.x = -Math.PI / 2 ;
plane4.position.y = 2.8 ;
scene.add(plane4);

// init camera
const Near = 0.1 , Far = 100 ;
const camera = new THREE.PerspectiveCamera( 35 , sizes.width / sizes.height , Near , Far );
scene.add(camera);
camera.position.z = 5;

let dis = 0.01 ;

const update = ()=>{
    // mesh.position.x+= dis; 
    // mesh.rotation.y += 0.1 ; 
    // mesh.rotation.x +=0.1;
    // if(mesh.position.x > 2 ){
    //     dis*=-1;
    // }
    // if(mesh.position.x < -2 ){
    //     dis*=-1;
    // }

}



const Loop = ()=>{
    
    update();

    const elapsed = clock.getElapsedTime();
    
    
    // console.log(cursor);

    camera.position.x = Math.sin(cursor.x * Math.PI * 2 ) * 10;
    camera.position.y = cursor.y * 10;
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 10 ;
    camera.lookAt(new THREE.Vector3(0 , 0 ,0 ) ) ;

    renderer.render(scene , camera);
    window.requestAnimationFrame(Loop);
}

Loop();









/*
    mesh.position.distanceTo( camera.position ) ; give the distance from mesh to camera
    ** object3.position.distanceTo( new THREE.Vector(1 ,1 , 1) ) ;

    mesh.position.normlize(); // making the size of the vector as 1

    mesh.position.length() ; // the length of the object3d 

    mesh.position.set( x , y , z) ;

    mesh.scale.x =  3 ; // etc y ,z ...
    mesh.scale.set(x,y,z) ; 

    
    let pi = Math.PI 
    mesh.rotation.y = pi * 0.25 ;
    mesh.rotation.set(pi , pi , 2*pi);

    camera.lookAt(new Three.Vector(0,0,0));
    camera.lookAt(mesh.position);
    
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);
    
    ----------------------------------

    Objects:

    const group = new THREE.Group();
    group.add(cube1) ; 
    group.add(mesh); //etc.. 
    
    scene.add(group);

    ----------------------------------
    LathGeomtery # good for ballon
    

    making cutom geometry

    let geo = new THREE.Geometry();
    let v1 = new THREE.Vector3(0,0,0);
    geo.vertices.push(v1);
    let v2 = new THREE.Vector3(0,1,0);
    geo.vertices.push(v2);
    let v3 = new THREE.Vector3(0,0,1);
    geo.vertices.push(v3);

    let face = new THREE.Face3(0 , 1, 2 ) ;
    geo.faces.push(face);

    then .. create material .. create mesh .. add it to scene 

    npm i dat.gui
    import * as dat from 'dat.gui'
    const gui = new dat.GUI({closed:true , widt:400});
    gui.hide();// to show press h 
    

    gui.add( mesh.position , 'y' , -3 , 3 , 0.1) ; // min , max , change value
    gui.add( mesh.position , 'y' ).min(-3).max(3).step(0.1).name('moving on y'); // another way 

    gui.add(mesh , 'visible' )

    let Object = {
        color: 0xff0000,
        spin : ()=>{
            gsap.to(mesh.rotation , {duration: , y :mesh.rotation.y + 10});
        }
    };
    gui.addColor( Object , 'color' ).onChange(()=>{
        material.color.set(Object.color);
    });

    gui.add(Object , 'spin' );


    rewatch material if you needed shadow or something ... lesson 12


    light:
    the material that work with light : meshstandardmaterial

    // controls;
    import { OrbitControls } from  'three/examples/jsm/controls/OrbitControls';
    const controls = new OrbitControls( camera, renderer.domElement );
    in loop:
        controls.update();
*/











