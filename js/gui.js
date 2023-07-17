import * as dat from 'dat.gui';


// init dat.gui 
const gui = new dat.GUI({ width:400});


let ConfigOptions =
{ 
	Mass:100 , 
	Raduis:15,
	Fire:25,
	WindVeloctiy:0 , 
	AirTemprature:25, 
    WindDegree:0
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
gui.add(Constants 	, 'Gravity' ).min(0);
gui.add(Constants   , 'PressureAtSeaLevel').min(1);
gui.add(Constants   , 'MassOfEarth').min(1).step(1000);
gui.add(Constants   , 'RadiusOfEarth').min(1);



gui.add(ConfigOptions , 'Mass' ).min(1).max(2000) ;
gui.add(ConfigOptions , 'Raduis').min(2);
gui.add(ConfigOptions , 'Fire').min(-100).max(100).step(5) ;
gui.add(ConfigOptions , 'AirTemprature' ).min(-100).max(100).step(5);
gui.add(ConfigOptions , 'WindVeloctiy' );
gui.add(ConfigOptions ,  'WindDegree' ).min(0).max(360).step(5); 

export default gui;

export {ConfigOptions , Constants } ;