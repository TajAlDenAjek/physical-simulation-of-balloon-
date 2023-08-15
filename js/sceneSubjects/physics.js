class Physics{
    constructor(){

    }
    AirPressureForce(HeightOfBallon, Constants) {
        let ScaleHeight = -1 * (Constants.Gravity  * HeightOfBallon * Constants.MolarMass_KgMol ) / (Constants.AverageTempratureAtSeaLevel * Constants.GasConstant_JoulMolK);
        let airPressure = Constants.PressureAtSeaLevel * Math.pow(Math.E , ScaleHeight ) ;
        return airPressure ;
    }
    
    AirDensity(HeightOfBallon, temprature, Constants) {
        // source wikipedia https://en.wikipedia.org//wiki/Density_of_air
        let p = (Math.abs(this.AirPressureForce(HeightOfBallon , Constants) ) * Constants.MolarMass_KgMol ) / (Constants.GasConstant_JoulMolK * Math.abs(temprature));
        return p ;
    }
    VolumeOfAirInBallon(RadiusOfBallon){
        let volumeOfAirInBallon = 4 / 3 * Math.PI * Math.pow(RadiusOfBallon, 3);
        return volumeOfAirInBallon ;
    }                
    BuoyancyForce(TempratureInsideBallon, TempratureOutsideBallon, RadiusOfBallon , HeightOfBallon ,Constants) {
        let p_hot = this.AirDensity(HeightOfBallon, TempratureInsideBallon, Constants);
        let p_cold = this.AirDensity(HeightOfBallon, TempratureOutsideBallon, Constants);
        let volumeOfAirInBallon = this.VolumeOfAirInBallon(RadiusOfBallon) ; 
        let buoyancyForce = volumeOfAirInBallon * Constants.Gravity * Math.abs((p_cold - p_hot)); 
        return buoyancyForce;
    }
    
    GravityForce(MassOfBallon, HeightOfBallon, Constants, RadiusOfBallon , TempratureInsideBallon  ) {
        // source (from physical study)
        let volumeOfAirInBallon = this.VolumeOfAirInBallon(RadiusOfBallon) ;
        let TotalMass = MassOfBallon + this.AirDensity(HeightOfBallon , TempratureInsideBallon , Constants) * volumeOfAirInBallon;
        let G = ((Math.pow(HeightOfBallon - Constants.RadiusOfEarth, 2)) * Constants.Gravity) / Constants.MassOfEarth;
        let F = (G * Constants.MassOfEarth * TotalMass ) / Math.pow(HeightOfBallon + Constants.RadiusOfEarth, 2);
        return F;
    }
    Accelration(BuoyancyForce, GravityForce, MassOfBallon) { 
        let accelration = (BuoyancyForce - GravityForce) / MassOfBallon;
        return accelration;
    }
    Velocity(lastVelocity, accelration, timeElapsed, lastTime) {
        let velocity =  (lastVelocity + (accelration * (timeElapsed - lastTime)));
        return Math.abs(velocity) ;
    }
}
export default Physics; 