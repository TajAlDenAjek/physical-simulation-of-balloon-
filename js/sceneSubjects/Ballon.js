import * as THREE from 'three' ; 

const loadingManager = new THREE.LoadingManager() ;
const textureLoader = new THREE.TextureLoader(loadingManager);

// importing textures 
const woodTexture = textureLoader.load('../assets/wood.jpg');


class Ballon
{
    constructor( scene , Width , MassOfBallon , HeightOfBallon , RadiusOfBallon , TempratureInsideBallon , PercentageOfFire , WindVelocity ,Color)
    {
        this.scene = scene ;
        this.Width = Width ;  
        this.MassOfBallon =  MassOfBallon ; 
        this.HeightOfBallon = HeightOfBallon ; // HeightOfBallon = HeightFromSea + distance from center of ballon to center of earth
        this.RadiusOfBallon = RadiusOfBallon ;
        this.TempratureInsideBallon = TempratureInsideBallon;
        this.PercentageOfFire = PercentageOfFire ;
        this.WindVelocity = WindVelocity  ;
        this.Color = Color ;
        const FullBallon = new THREE.Group();
        this.FullBallon = FullBallon ;
        this.Draw() ; 
    }
    DrawCabin()
    {
        const geometry = new THREE.BoxGeometry(this.Width , this.Width  , this.Width , this.Width  , this.Width , this.Width , this.Width) ; 
        const material = new THREE.MeshBasicMaterial({ color: this.Color , map: woodTexture }); 
        const box = new THREE.Mesh(geometry , material ) ;
        this.FullBallon.add(box) ;
    }
    DrawBallon()
    {
        const points = [];
        for ( let i = 0; i < 18; i++ )
        {
            points.push( new THREE.Vector2(  Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
        }
        const geometry = new THREE.LatheGeometry( points  );
        const material = new THREE.MeshBasicMaterial({ color: this.Color , map: woodTexture }); 
        const ballon = new THREE.Mesh(geometry , material ) ;
        ballon.rotation.x = Math.PI ;
        ballon.position.y = 30 ;
        this.FullBallon.add(ballon) ;
    }
    Draw()
    {
        this.DrawCabin();
        this.DrawBallon();
        this.scene.add(this.FullBallon) ;
    }
    // AnimateBallon(cnt)
    // {
        
    // }
}


export default Ballon ;