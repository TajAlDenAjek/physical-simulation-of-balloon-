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

gui.add(ConfigOptions , 'Mass' ).min(2).max(200).step(5) ;
gui.add(ConfigOptions , 'Raduis').min(2) ;
gui.add(ConfigOptions , 'Fire').min(2).max(100).step(5) ;
gui.add(ConfigOptions , 'WindVeloctiy' ) ;
gui.add(ConfigOptions , 'AirTemprature' ).min(2).max(60).step(5) ;


export default gui;
export {ConfigOptions} ;