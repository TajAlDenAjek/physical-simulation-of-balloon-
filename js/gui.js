import * as dat from 'dat.gui';


// init dat.gui 
const gui = new dat.GUI({ width:400});


let ConfigOptions =
{ 
	Mass:100 , 
	Raduis:15,
	Fire:25,
	WindVeloctiy:0 , 
	AirTemprature:25
};
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
};
gui.add(Constants 	, 'Gravity' ).min(0).step(5);
gui.add(Constants   , 'PressureAtSeaLevel').min(1);
gui.add(Constants   , 'MassOfEarth').min(1).step(1000);
gui.add(Constants   , 'RadiusOfEarth').min(1);



gui.add(ConfigOptions , 'Mass' ).min(2).max(200).step(5);
gui.add(ConfigOptions , 'Raduis').min(2);
gui.add(ConfigOptions , 'Fire').min(2).max(100).step(5) ;//  what will happen if temprature too high
gui.add(ConfigOptions , 'AirTemprature' ).min(2).max(60).step(5);
gui.add(ConfigOptions , 'WindVeloctiy' );


export default gui;
export {ConfigOptions , Constants } ;