import * as dat from 'dat.gui';


// init dat.gui 
const gui = new dat.GUI({ width:400});


let ConfigOptions =
{ 
	Mass:100 , 
	Raduis:5,
	Fire:200 ,
	WindVelocity:0 , 
	AirTemprature:200, 
    WindDegree:0,
    fabricType:'Polyester'
};
let Constants = {
    PressureAtSeaLevel:101325 ,                                         // P0 , pasal
    e: Math.E ,                                 
    // GasConstant: 287.1 ,                                             // Joul / ( Kg . K ) (chatGPT)
    GasConstant_JoulMolK: 8.314462618,                                  // Joul / (mol . K)  (Wikipedia) https://en.wikipedia.org/wiki/Atmospheric_pressure
    GasConstant: 0.0821,                                                // L*atm/(mol * K)
    AverageTempratureAtSeaLevel: 288.16  ,                               // T0 kelvin 
    Gravity:9.80665 ,                                                        // g , m/s^2
    MolarMass_KgMol: 0.02896968 ,                                              // Kg/mol
    MolarMass: 28.97,                                                   // M , g/mol 
    GravitationalConstant: 6.67 * Math.pow(10 , -11) ,                  // G 
    MassOfEarth:5.97 * Math.pow(10 , 24)  ,                             // m2 , kg
    RadiusOfEarth: 6371000 ,                                            // r , meter
    Dragcoefficient: 0.47
};
const Environment = gui.addFolder('Environment') ; 
const Ballon = gui.addFolder('Ballon') ;
Environment.add(Constants 	, 'Gravity' ).min(0);
Environment.add(Constants   , 'PressureAtSeaLevel').min(1);
Environment.add(Constants   , 'MassOfEarth').min(1).step(1000);
Environment.add(Constants   , 'RadiusOfEarth').min(1);
Environment.add(ConfigOptions , 'AirTemprature' ).min(1).max(1000).step(1);
Environment.add(ConfigOptions , 'WindVelocity' );
Environment.add(ConfigOptions ,  'WindDegree' ).min(0).max(360); 


Ballon.add(ConfigOptions , 'Mass' ).min(1).max(2000) ;
Ballon.add(ConfigOptions , 'Raduis').min(2);
Ballon.add(ConfigOptions , 'Fire').min(1).max(1000).step(1) ;
Ballon.add(ConfigOptions , 'fabricType'  , ['Polyester' ,'Nylon']) ;

export default gui;

export {ConfigOptions , Constants } ;