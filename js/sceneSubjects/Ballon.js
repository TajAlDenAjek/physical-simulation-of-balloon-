import * as THREE from 'three' ; 
import { Material } from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


const loadingManager = new THREE.LoadingManager() ;
const textureLoader = new THREE.TextureLoader(loadingManager);


// importing textures
const woodTexture = textureLoader.load('../assets/wood.jpg');


// physics constatns
let Constants = {
    PressureAtSeaLevel:101325 ,                                         // P0 , pasal
    e: Math.E ,                                 
    GasConstant: 287.1 ,                                                // R  , Kg . K 
    AverageTempratureAtSeaLevel: 293.35 ,                               // T0 kelvin 
    Gravity:9.8,                                                        // g , m/s^2
    MolarMass: 28.97,                                                   // M , g/mol 
    GravitationalConstant: 6.67 * Math.pow(10 , -11) ,                  // G 
    MassOfEarth:5.97 * Math.pow(10 , 24)  ,                             // m2 , kg
    RadiusOfEarth: 6371000 ,                                            // r , meter
    Dragcoefficient: 0.47
    
} ;
function GravityForce(MassOfBallon , HeightOfBallon ){
    let F = Constants.GravitationalConstant * Constants.MassOfEarth * MassOfBallon / Math.pow(Constants.RadiusOfEarth+ HeightOfBallon , 2) ; 
    return F; 
}
function AirPressureForce(HeightOfBallon){
    let ScaleHeight = ( Constants.GasConstant * Constants.AverageTempratureAtSeaLevel ) / (Constants.Gravity * Constants.MolarMass ) ; 
    let airPressureForce =  Constants.PressureAtSeaLevel * Math.pow( Math.E ,  -HeightOfBallon / ScaleHeight ) ; 
    
    return airPressureForce ;
}
function AirDensity(HeightOfBallon , temprature){
    let p = AirPressureForce(HeightOfBallon) * Constants.MolarMass / (Constants.GasConstant * temprature) ;
    return p;
}
function BuoyancyForce(TempratureInsideBallon , TempratureOutsideBallon , RadiusOfBallon , HeightOfBallon )
{

    let VolumeOfAirInBallon = 4/3 * Math.PI * Math.pow(RadiusOfBallon,3) ; 
    let airPressure = AirPressureForce(HeightOfBallon) ;
    let buoyancyForce = VolumeOfAirInBallon * airPressure / 2.87 * ( 1 / TempratureOutsideBallon - 1/TempratureInsideBallon ) ;
    return buoyancyForce ; 
    // let airPressure = AirPressureForce(HeightOfBallon) ; 
    // let p_hot = AirDensity(HeightOfBallon , TempratureInsideBallon);
    // let p_cold = AirDensity(HeightOfBallon , TempratureOutsideBallon) ;
    // let VolumeOfAirInBallon = 4/3 * Math.PI * Math.pow(RadiusOfBallon,3) ; 
    // let buoyancyForce = VolumeOfAirInBallon * Constants.Gravity * ( p_cold -  p_hot  ) ; /// changed p_hot - p_cold to this
    
    return buoyancyForce ; 
}
function WindForce(TempratureOutsideBallon , WindVelocity ){
    let F = 1/2 * AirDensity(TempratureOutsideBallon) * Math.pow( WindVelocity , 2 ) * Constants.Dragcoefficient * Math.PI * Math.pow( RadiusOfBallon , 2 ) ;
    return F ;
}
function Velocity(TempratureInsideBallon , TempratureOutsideBallon , RadiusOfBallon  , MassOfBallon , HeightOfBallon){
    let airPressure = AirPressureForce(HeightOfBallon) ; 
    let p_cold = airPressure * Constants.MolarMass / (Constants.GasConstant * TempratureOutsideBallon ) ;
    let VolumeOfAirInBallon = 4/3 * Math.PI * Math.pow(RadiusOfBallon,3) ; 
    let velocity = (TempratureInsideBallon - MassOfBallon ) / (VolumeOfAirInBallon * p_cold ) ;
    return velocity ; 
}
function Accelration(BuoyancyForce , GravityForce , MassOfBallon ){ // add wind speed 
    let accelration = (BuoyancyForce - GravityForce )/MassOfBallon ;
    return accelration ;
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
        this.PrintingValues();
    }
    AnimateBallon(ConfigOptions , cnt )
    {
        
        let buoyancyForce = BuoyancyForce(ConfigOptions.Fire , ConfigOptions.AirTemprature , ConfigOptions.Raduis , this.FullBallon.position.y +1 ) ; 
        let gravityForce = GravityForce(ConfigOptions.Mass , this.FullBallon.position.y +1) ;
        let velocity = Velocity(ConfigOptions.Fire , ConfigOptions.AirTemprature , ConfigOptions.Raduis , ConfigOptions.Mass , this.FullBallon.position.y +1);

        // debug
        if(this.CONFIG.buoyancyForce != ConfigOptions.buoyancyForce ){
            console.log("bounancy" , buoyancyForce) ;
            console.log("gravity", gravityForce) ;
            console.log("velocity", velocity);
            console.log("height" , this.FullBallon.position.y ) ;
        }
        
        if(buoyancyForce > gravityForce ){
            this.FullBallon.position.y +=  0.5;
        }
        else if( buoyancyForce < gravityForce ){
            if(this.FullBallon.position.y > 0 )
                this.FullBallon.position.y -= 0.5 ; 
        }
    }
    
}


export default Ballon ;