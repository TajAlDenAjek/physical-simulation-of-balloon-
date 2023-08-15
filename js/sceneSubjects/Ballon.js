import * as THREE from 'three';
import { Material } from 'three';
// for model
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js' ;
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js' ;

// for pritning text on screen
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import {TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js' ;
import Physics from './physics';

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

var time = 0;
// importing textures
const woodTexture = textureLoader.load('../assets/wood.jpg');

// init physics
const physics = new Physics() ;

class Ballon {
    constructor(scene, skyBoxSize, HeightOfBallon, Color) {
        this.scene = scene;
        this.skyBoxSize = skyBoxSize; 
        this.Width = 3 ; 
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
        const skyBoxSize = this.skyBoxSize/2 ;
        if(Axis.y != undefined ){
            return Axis.y >= 0 && Axis.y < skyBoxSize*2 ; 
        }
        if(Axis.x != undefined ){
            return Axis.x > -skyBoxSize  && Axis.x < skyBoxSize  ; 
        }
        if(Axis.z != undefined ){
            return Axis.z > -skyBoxSize  && Axis.z < skyBoxSize ; 
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
    AnimateBallon(ConfigOptions, timeElapsed, Constants) 
    {
        let {x,y,z} = this.FullBallon.position ;
        // Logic of Strong Wind & Burning of Ballon
        let WindDegree = (ConfigOptions.WindDegree  ) * (Math.PI / 180.0) ; 
        if(ConfigOptions.WindVelocity > 20 ) {
            ConfigOptions.Fire = 1; 
            this.FullBallon.rotation.y = -Math.PI/2 ;
        }
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
        let gravityForce = physics.GravityForce(ConfigOptions.Mass, this.FullBallon.position.y + 1, Constants , ConfigOptions.Raduis , ConfigOptions.Fire );
        let buoyancyForce = physics.BuoyancyForce(ConfigOptions.Fire, ConfigOptions.AirTemprature, ConfigOptions.Raduis, this.FullBallon.position.y + 1, Constants);
        let accelration = physics.Accelration(buoyancyForce, gravityForce, ConfigOptions.Mass);

        if((this.FullBallon.position.y == 0 && (buoyancyForce < gravityForce ) ) ){
            accelration =0;
        }

        let velocity = physics.Velocity(this.lastVelocity, accelration, timeElapsed, this.lastTime);
        // change On Y
        let change = velocity * (timeElapsed - this.lastTime ) ;
        

        
        // Moving on XZ 
        let ChangeOnXZ = ConfigOptions.WindVelocity;
        let ChangeOnX = Math.cos(WindDegree)*ChangeOnXZ;
        let ChangeOnZ = Math.sin(WindDegree)*ChangeOnXZ ;
        if(this.FullBallon.position.y > 0  ){
            if(this.checkInside({x: x + ChangeOnX + this.Width/ 2  }) && this.checkInside({z: z + ChangeOnZ + this.Width /2})){
                this.FullBallon.position.x += Math.cos(WindDegree)*ChangeOnXZ ;
                this.FullBallon.position.z += Math.sin(WindDegree)*ChangeOnXZ;
            }
            // animation of wind on ballon
            let degree = Math.PI/8 * ChangeOnXZ/20 ;
            if(ChangeOnX > 0 )
            {
                this.FullBallon.rotation.y = degree ;
            }
            else if(ChangeOnX < 0 ){
                
                this.FullBallon.rotation.y = -degree ;
            }
            if(ChangeOnZ > 0 ){
                this.FullBallon.rotation.x =-1*( Math.PI /2 - degree );
            }
            else if(ChangeOnZ < 0 ) {
                this.FullBallon.rotation.x =-1*( Math.PI/ 2 + degree ) ; 
            }
            if(Math.abs(ChangeOnX) <= 0.5 && Math.abs(ChangeOnZ) <= 0.5 ) {
                this.FullBallon.rotation.x= - Math.PI / 2 ;
                this.FullBallon.rotation.y= 0 ;
            }
        }
        // calculating and printing variables
        let p_hot = physics.AirDensity(this.FullBallon.position.y , ConfigOptions.Fire , Constants);
        let p_cold = physics.AirDensity(this.FullBallon.position.y , ConfigOptions.AirTemprature , Constants);
        let volumeOfAirInBallon = physics.VolumeOfAirInBallon(ConfigOptions.Raduis ) ; 
        let airPressure = physics.AirPressureForce(this.FullBallon.position.y , Constants) ;
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
            windDegree: WindDegree,
            skyBoxSize: this.skyBoxSize
        }
        this.Print_Values(Values);

        //  Logic of Takeoff and Landing of Ballon
        if( this.FullBallon.position.y + change <= 0 ) {
            this.FullBallon.position.y = 0 ;
        }
        else if( buoyancyForce > gravityForce ){
            if(this.checkInside({y: y + change } ) ) 
                this.FullBallon.position.y += Math.abs(change) ;
        }
        else if( buoyancyForce < gravityForce && this.FullBallon.position.y + change >=0 ){
            if(this.checkInside({y: y + change } ) )
                this.FullBallon.position.y += -Math.abs(change) ;
        }

        this.lastTime = timeElapsed;
        this.lastVelocity = velocity;
    }

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

export default Ballon;