import * as dat from 'dat.gui';


// init dat.gui 
const gui = new dat.GUI({ width:600});


let ConfigOptions =
{ 
	Mass:1 , 
	Raduis:3,
	Fire:0,
	WindVeloctiy:0
};

gui.add(ConfigOptions , 'Mass' ).min(1).max(200).step(5) ;
gui.add(ConfigOptions , 'Raduis') ;
gui.add(ConfigOptions , 'Fire').min(0).max(100).step(5) ;
gui.add(ConfigOptions , 'WindVeloctiy' ) ;


export default gui;