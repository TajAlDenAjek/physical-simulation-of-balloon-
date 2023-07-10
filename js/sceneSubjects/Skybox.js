import * as THREE from 'three';

const loadingManager = new THREE.LoadingManager() ;
const textureLoader = new THREE.TextureLoader(loadingManager);

// importing textures 
const front = textureLoader.load('../assets/skybox_front.jpg');
const back = textureLoader.load('../assets/skybox_back.jpg');
const down = textureLoader.load('../assets/skybox_down.jpg');
const up = textureLoader.load('../assets/skybox_up.jpg');
const left = textureLoader.load('../assets/skybox_left.jpg');
const right = textureLoader.load('../assets/skybox_right.jpg');
const sides=[front,back,up,down,right,left];

class Skybox 
{
    constructor(scene,size,RotationalSpeed)
    {
        this.scene=scene;
        this.size=size;
        this.RotationalSpeed=RotationalSpeed;
        const skybox={};
        this.skybox=skybox;
        this.Draw();
    }
    DrawSkyBox()
    {
        let materialArray =[];
        sides.map(image=>{
            let texture = image;
            const side=new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
            materialArray.push(side);
        });
        const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        this.skybox = new THREE.Mesh(geometry,materialArray);  
        this.skybox.position.y += this.size / 2 - 2  ; // to make the ballon on the same level as ground (skybox) (2 is the half size of ballon)
    }
    Draw()
    {
        this.DrawSkyBox();
        this.scene.add(this.skybox) ;
    }
    AnimateSkyBox()
    {
        this.skybox.rotation.y += this.RotationalSpeed;
        
    }
}


export default Skybox;