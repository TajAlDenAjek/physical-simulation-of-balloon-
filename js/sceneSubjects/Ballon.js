import * as THREE from 'three';
import { Material } from 'three';
// for model
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js' ;
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js' ;

// for pritning text on screen
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import {TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js' ;

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

var time = 0;
// importing textures
const woodTexture = textureLoader.load('../assets/wood.jpg');


// OK
function AirPressureForce(HeightOfBallon, Constants) {
    // (old)
    // let ScaleHeight = (Constants.GasConstant * Constants.AverageTempratureAtSeaLevel) / (Constants.Gravity * Constants.MolarMass);
    // let airPressureForce = Constants.PressureAtSeaLevel * Math.pow(Math.E , (-1* HeightOfBallon/ScaleHeight));
    // return airPressureForce;

    // (new) source wikipedia : https://en.wikipedia.org/wiki/Atmospheric_pressure
    let ScaleHeight = -1 * (Constants.Gravity  * HeightOfBallon * Constants.MolarMass_KgMol ) / (Constants.AverageTempratureAtSeaLevel * Constants.GasConstant_JoulMolK);
    let airPressure = Constants.PressureAtSeaLevel * Math.pow(Math.E , ScaleHeight ) ;
    return airPressure ;
}
// OK
function AirDensity(HeightOfBallon, temprature, Constants) {
    // let p = AirPressureForce(HeightOfBallon, Constants) * Constants.MolarMass / (Constants.GasConstant * Math.abs(temprature) );
    // return p;

    // source wikipedia https://en.wikipedia.org//wiki/Density_of_air
    let p = (Math.abs(AirPressureForce(HeightOfBallon , Constants) ) * Constants.MolarMass_KgMol ) / (Constants.GasConstant_JoulMolK * Math.abs(temprature));
    return p ;
}
// OK
function ToKelvin(Degree){
    return Degree * 274.15 ;
}
// OK
function VolumeOfAirInBallon(RadiusOfBallon){
    let volumeOfAirInBallon = 4 / 3 * Math.PI * Math.pow(RadiusOfBallon, 3);
    return volumeOfAirInBallon ;
}                
function BuoyancyForce(TempratureInsideBallon, TempratureOutsideBallon, RadiusOfBallon , HeightOfBallon ,Constants) {
    let p_hot = AirDensity(HeightOfBallon, TempratureInsideBallon, Constants);
    let p_cold = AirDensity(HeightOfBallon, TempratureOutsideBallon, Constants);
    let volumeOfAirInBallon = VolumeOfAirInBallon(RadiusOfBallon) ; 
    let buoyancyForce = volumeOfAirInBallon * Constants.Gravity * Math.abs((p_cold - p_hot)); 
    // new
    // let VolumeOfAirInBallon = 4 / 3 * Math.PI * Math.pow(RadiusOfBallon, 3);
    // let p_cold = 1.225 ;
    // let p_hot = p_cold * ((TempratureInsideBallon) / (TempratureOutsideBallon) ) ;
    // let buoyancyForce = Constants.Gravity * Math.abs(p_cold - p_hot) * VolumeOfAirInBallon ;
    return buoyancyForce;
}

// OK
function GravityForce(MassOfBallon, HeightOfBallon, Constants, RadiusOfBallon , TempratureInsideBallon  ) {
    // let F = MassOfBallon * 9.8 ; // all things down equivliant to this
    // source (from physical study)
    let volumeOfAirInBallon = VolumeOfAirInBallon(RadiusOfBallon) ;
    let TotalMass = MassOfBallon + AirDensity(HeightOfBallon , TempratureInsideBallon , Constants) * volumeOfAirInBallon;

    let G = ((Math.pow(HeightOfBallon - Constants.RadiusOfEarth, 2)) * Constants.Gravity) / Constants.MassOfEarth;
    let F = (G * Constants.MassOfEarth * TotalMass ) / Math.pow(HeightOfBallon + Constants.RadiusOfEarth, 2);
    return F;
}
function Accelration(BuoyancyForce, GravityForce, MassOfBallon) { 
    let accelration = (BuoyancyForce - GravityForce) / MassOfBallon;
    return accelration;
}
function Velocity(lastVelocity, accelration, timeElapsed, lastTime) {
    let velocity =  (lastVelocity + (accelration * (timeElapsed - lastTime)));
    if(Math.abs( velocity ) < 1 )
        return 0 ; 
    return velocity;
}

class Ballon {
    constructor(scene, Width , HeightOfBallon, Color) {
        this.scene = scene;
        this.Width = Width;
        this.HeightOfBallon = HeightOfBallon; // HeightOfBallon = HeightFromSea + distance from center of ballon to center of earth      
        this.Color = Color;
        const FullBallon = new THREE.Group();
        this.FullBallon = FullBallon;
        this.lastVelocity = 0;
        this.lastTime = 0;
        this.Draw();
    }
    Draw() {
        const mtlloader= new MTLLoader() ; // initlizing material loader
        const objloader = new OBJLoader() ; // initlizing OBJLoader
        mtlloader.load('../../assets/models/11809_Hot_air_balloon_l2.mtl', (mtl)=>{

            // loading material
            mtl.preload();
            objloader.setMaterials(mtl) ;

            // loading model
            objloader.load('../../assets/models/11809_Hot_air_balloon_l2.obj', (FullBallon)=>{
                this.FullBallon = FullBallon ;
                let size = 0.01 ;
                // resizing model
                FullBallon.scale.set(size,size,size);
                // rotating model
                FullBallon.rotation.x = -Math.PI / 2 ;
                // adding model to the scene
                this.scene.add(FullBallon) ;
            }) ;
        });
        
    }
    checkInside( Axis ){
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
    
    Print_Values(values){
        const textArea = document.getElementById('text');
        
        textArea.innerHTML= `buoyancyForce: ${values.buoyancyForce.toFixed(2)} 
        <br> Gravity Force: ${values.gravityForce.toFixed(2)} 
        <br> acceleration: ${values.accelration.toFixed(2)} 
        <br> Velocity: ${values.velocity.toFixed(2)} 
        <br> Height: ${values.height.toFixed(2)}
        <br> deltaX: ${values.deltaX} 
        <br> deltaY: ${values.deltaY}
        <br> deltaZ: ${values.deltaZ}
        <br> Cold Density ${values.p_cold.toFixed(2)}
        <br> Hot Density ${values.p_hot.toFixed(2)}
        <br> Ballon Volume: ${values.volume.toFixed(2)}
        <br> Air Pressure: ${values.airPressure.toFixed(2)}
        <br> Rotation X: ${values.rotation.x}
        <br> Rotation Y: ${values.rotation.y}
        <br> Rotation Z: ${values.rotation.z}
        <br> Wind Degree: ${values.windDegree}
        ` ;

    }
    /*
        average speed of ballon : 108 m/s 
        average weight: 100-200 (small) , 500-1000(big)
        radius: 3-5 meter
        temp inside to fly : 100-200 celisus , 370-470 kelvin
        temp air : 20-35 celisus , 300-350 kelvin
        Nylon metling temp: 240 celisus , 520 kelvin
        Polyester meling temp: 275 celisus , 550 kelvin
        safe wind speed : 0-19 km/h , 0-5 m/s
        it fly at 480 when air temp is 200
    */
    AnimateBallon(ConfigOptions, timeElapsed, Constants) 
    {
        let WindDegree = (ConfigOptions.WindDegree  ) * (Math.PI / 180.0) ; 

        if( ConfigOptions.fabricType === 'Polyester' ){
            if(ConfigOptions.Fire > 550 ){
                ConfigOptions.Fire = 1;
                this.FullBallon.rotation.y = -Math.PI/2 ;
            }
        }
        else{
            if(ConfigOptions.Fire > 520 ){
                ConfigOptions.Fire = 1;
                this.FullBallon.rotation.y = -Math.PI/2 ; 
            }
        }
        let gravityForce = GravityForce(ConfigOptions.Mass, this.FullBallon.position.y + 1, Constants , ConfigOptions.Raduis , ConfigOptions.Fire );
        let buoyancyForce = BuoyancyForce(ConfigOptions.Fire, ConfigOptions.AirTemprature, ConfigOptions.Raduis, this.FullBallon.position.y + 1, Constants);
        let accelration = Accelration(buoyancyForce, gravityForce, ConfigOptions.Mass);

        if((this.FullBallon.position.y == 0 && (buoyancyForce < gravityForce ) ) ){
            accelration =0;
        }
        
        let velocity = Velocity(this.lastVelocity, accelration, timeElapsed, this.lastTime);
        let x = this.FullBallon.position.x ;
        let y = this.FullBallon.position.y ;
        let z = this.FullBallon.position.z ;
        // let {x,y,z} = this.FullBallon.position ;
        let change = velocity * (timeElapsed - this.lastTime ) ;
        // change/= 100;

        
        // Moving on XZ 
        let ChangeOnXZ = ConfigOptions.WindVelocity;
        
        let ChangeOnX = Math.cos(WindDegree)*ChangeOnXZ;
        let ChangeOnZ = Math.sin(WindDegree)*ChangeOnXZ ;
        
        if(this.FullBallon.position.y > 0  ){
            if(this.checkInside({x: x + ChangeOnX + this.Width/ 2  }) && this.checkInside({z: z + ChangeOnZ + this.Width /2})){
                this.FullBallon.position.x += Math.cos(WindDegree)*ChangeOnXZ ;
                this.FullBallon.position.z += Math.sin(WindDegree)*ChangeOnXZ;
            }
            
            // if(ChangeOnX > 0 )
            // {
            //     this.FullBallon.rotation.y = Math.PI/4 ;
            // }
            // else if(ChangeOnX < 0 ){
                
            //     this.FullBallon.rotation.y = -Math.PI/4 ;
            // }
            // if(ChangeOnZ > 0 ){
            //     this.FullBallon.rotation.x = Math.PI /2 - Math.PI/4 ;
            // }
            // else if(ChangeOnZ < 0 ) {
            //     this.FullBallon.rotation.x = Math.PI/ 2 + Math.PI /4   ;
            // }
            
        }
        let p_hot = AirDensity(this.FullBallon.position.y , ConfigOptions.Fire , Constants);
        let p_cold = AirDensity(this.FullBallon.position.y , ConfigOptions.AirTemprature , Constants);
        let volumeOfAirInBallon = VolumeOfAirInBallon(ConfigOptions.Raduis ) ; 
        let airPressure = AirPressureForce(this.FullBallon.position.y , Constants) ;
        let Values = {
            buoyancyForce:buoyancyForce,
            gravityForce: gravityForce,
            accelration:accelration,
            velocity:velocity,
            height: this.FullBallon.position.y ,
            deltaY: change ,
            deltaX: ChangeOnX,
            deltaZ: ChangeOnZ,
            p_hot: p_hot,
            p_cold: p_cold,
            volume: volumeOfAirInBallon,
            airPressure: airPressure,
            rotation: this.FullBallon.rotation,
            windDegree: WindDegree
        }
        this.Print_Values(Values);
        
        // if(Math.abs(buoyancyForce - gravityForce) <= 75 ) {
        //     // do nothing
        // }
        if( buoyancyForce > gravityForce ){
            // if(this.checkInside({y: y + change } ) ) 
                this.FullBallon.position.y += Math.abs(change) ;
        }
        else if( buoyancyForce < gravityForce && this.FullBallon.position.y + change >=0 ){
            // if(this.checkInside({y: y + change } ) )
                this.FullBallon.position.y += -Math.abs(change) ;
        }
        else if( this.FullBallon.position.y + change <= 0 ) {
            this.FullBallon.position.y = 0 ;
        }

        // if(Math.abs(gravityForce - buoyancyForce) <= 75)
        // {
        //     velocity = 0;
        // }
        // else if ((this.FullBallon.position.y += change) > 0 && (this.FullBallon.position.y += change) < 800) {
        //     if(this.checkInside({y: y + change }))
        //         this.FullBallon.position.y += change ;
        // }
        // else if ((this.FullBallon.position.y += change) <= 0)
        // {
        //     this.FullBallon.position.y = 0;
        //     velocity = 0;
        // }
        // else if ((this.FullBallon.position.y += change) >= 800){
        //     this.FullBallon.position.y = 800;
        //     velocity = 0;
        // }
        // else{
        //     velocity = 0;
        // }

        this.lastTime = timeElapsed;
        this.lastVelocity = velocity;
    }

}


export default Ballon;