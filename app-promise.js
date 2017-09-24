const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
.options({
a: {
    demand:true,
    alias:'address',
    describe:'Address to fetch weather for',
    string:true
}
})
.help()
.alias('help','h')
.argv;
var encodedAddress = encodeURIComponent(argv.address); 
var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response)=>{
    if(response.data.status === 'ZERO_RESULTS'){
        throw new Error('unable to find address');
    }
var lat = response.data.results[0].geometry.location.lat;
var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/a32b45f11a93d1923e1ceeb7206a583d/${lat},${lng}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
}).then((response)=>{
var temperature = response.data.currently.temperature;
var apparentTemperature = response.data.currently.apparentTemperature;
console.log(`It's currently ${temperature}. It's feel like ${apparentTemperature}`);
}).catch((e)=>{

if(e.code === 'ENOTFOUND'){
    console.log("Unable to connect to servers");
}else{
console.log(e.message);
}
});