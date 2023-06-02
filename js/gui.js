import * as dat from 'dat.gui';


// init dat.gui 
const gui = new dat.GUI({ width:600});


let ConfigOptions =
{ 
	Mass:100 , 
	Raduis:15,
	Fire:1,
	WindVeloctiy:0 , 
	AirTemprature:20
};

gui.add(ConfigOptions , 'Mass' ).min(2).max(200).step(5) ;
gui.add(ConfigOptions , 'Raduis').min(2) ;
gui.add(ConfigOptions , 'Fire').min(2).max(100).step(5) ;
gui.add(ConfigOptions , 'WindVeloctiy' ) ;
gui.add(ConfigOptions , 'AirTemprature' ).min(2) ;


export default gui;
export {ConfigOptions} ;