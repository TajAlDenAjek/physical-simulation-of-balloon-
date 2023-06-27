import * as THREE from 'three' ; 
import { Material } from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


const loadingManager = new THREE.LoadingManager() ;
const textureLoader = new THREE.TextureLoader(loadingManager);


// importing textures
const woodTexture = textureLoader.load('../assets/wood.jpg');

function GravityForce(MassOfBallon , HeightOfBallon , Constants ){
    // console.log(Constants.GravitationalConstant , Constants.MassOfEarth , Constants.RadiusOfEarth )  ;
    // console.log((Constants.GravitationalConstant * Constants.MassOfEarth * MassOfBallon ) , Math.pow(Constants.RadiusOfEarth + HeightOfBallon , 2) );
    let F = (Constants.GravitationalConstant * Constants.MassOfEarth * MassOfBallon ) / Math.pow(Constants.RadiusOfEarth + HeightOfBallon , 2) ; 
    // console.log(F) ;
    return F; 
}
function AirPressureForce(HeightOfBallon , Constants){
    
    let ScaleHeight = ( Constants.GasConstant * Constants.AverageTempratureAtSeaLevel ) / (Constants.Gravity * Constants.MolarMass ) ; 
    let airPressureForce =  Constants.PressureAtSeaLevel * Math.pow( Math.E ,  -HeightOfBallon / ScaleHeight ) ; 
    
    return airPressureForce ;
}
function AirDensity(HeightOfBallon , temprature , Constants){
    
    let p = AirPressureForce(HeightOfBallon, Constants ) * Constants.MolarMass / (Constants.GasConstant * temprature) ;
    return p;
}
function BuoyancyForce(TempratureInsideBallon , TempratureOutsideBallon , RadiusOfBallon , HeightOfBallon, Constants )
{

    // internet version
    // let VolumeOfAirInBallon = 4/3 * Math.PI * Math.pow(RadiusOfBallon,3) ; 
    // let airPressure = AirPressureForce(HeightOfBallon, Constants) ;
    // let buoyancyForce = VolumeOfAirInBallon * airPressure / 2.87 * ( 1 / TempratureOutsideBallon - 1/TempratureInsideBallon ) ; // update this one after checking if it's correct
    // return buoyancyForce ; 
    let airPressure = AirPressureForce(HeightOfBallon , Constants ) ;
    let p_hot = AirDensity(HeightOfBallon , TempratureInsideBallon , Constants);
    let p_cold = AirDensity(HeightOfBallon , TempratureOutsideBallon , Constants) ;
    let VolumeOfAirInBallon = 4/3 * Math.PI * Math.pow(RadiusOfBallon,3) ; 
    let buoyancyForce = VolumeOfAirInBallon * Constants.Gravity * ( p_cold -  p_hot  ) ; /// changed p_hot - p_cold to this
    return buoyancyForce ; 
}
function WindForce(TempratureOutsideBallon , WindVelocity , Constants ){
    let F = 1/2 * AirDensity(TempratureOutsideBallon) * Math.pow( WindVelocity , 2 ) * Constants.Dragcoefficient * Math.PI * Math.pow( RadiusOfBallon , 2 ) ;
    return F ;
}

function Accelration(BuoyancyForce , GravityForce , MassOfBallon ){ // add wind speed 
    let accelration = (BuoyancyForce - GravityForce )/MassOfBallon ;
    return accelration ;
}
function Velocity(lastVelocity , accelration , timeElapsed){
    return lastVelocity + accelration * timeElapsed ;
}
function ChangeInAxes(lastVelocity , currentVelocity , accelration ){
    return (currentVelocity * currentVelocity  - lastVelocity * lastVelocity ) / (2 * accelration );
}
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
        this.lastVelocity = 0 ; 
        this.lastTime = 0 ; 
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
    AnimateBallon(ConfigOptions , timeElapsed , Constants) // it may be wrong because elapsed time should be calculated from one second to another or from the begining of the program ?
    {       
        
        let buoyancyForce = BuoyancyForce(ConfigOptions.Fire , ConfigOptions.AirTemprature , ConfigOptions.Raduis , this.FullBallon.position.y +1 , Constants ) ; 
        let gravityForce = GravityForce( ConfigOptions.Mass , this.FullBallon.position.y + 1 , Constants ) ;
        let accelration = Accelration(buoyancyForce , gravityForce , ConfigOptions.Mass ) ; 
        let velocity = Velocity(this.lastVelocity , accelration , timeElapsed ) ;
        let change = ChangeInAxes(this.lastVelocity , velocity , accelration  ) ;
        // print variables on screen
        if(timeElapsed < 15 )
            console.log(buoyancyForce , gravityForce , change , timeElapsed , this.lastTime , accelration) ;
        if( timeElapsed - this.lastTime > 1) {
            if(buoyancyForce > gravityForce ){
                this.FullBallon.position.y +=  change ;
            }
            else if( buoyancyForce < gravityForce ){
                if(this.FullBallon.position.y > 0 )
                this.FullBallon.position.y -= change ; 
            }
            this.lastTime = timeElapsed ; 
            
        }
        this.lastVelocity = velocity ;
    }
    
}


export default Ballon ;