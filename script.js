let forecastData;
let geoLocData ;
let unitsCel = '?units=si';
let unitsFar = '?units=us';

const displayError = (error) => {
    const errors = ['Unknown error', 'Permission denied by user', 'Position not available', 'Timeout error'];
    const message = errors[error.code];
    console.warn('Error in getting your location: ' + message, error.message);
}


const getLocation = () => {
    if (navigator.geolocation) { //if the geolocation works, go fetch the local weather
        navigator.geolocation.getCurrentPosition(function displayLocation(position) {
            
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let cel = true;
            
    const baseURL = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/'; //proxy + api url
    const apiKey = API_KEY_GOES_HERE;
    const weatherApiURL = baseURL + apiKey + '/' + lat + ',' + long + unitsCel; //full api url           
            
//using google API because dark sky API doesn't indicate cities
    const googleMapURL = 'https://maps.googleapis.com/maps/api/geocode/json?&latlng=' + lat + ',' + long;
    
            
//grabbing JSON and what I want to display on the DOM
    $.getJSON(weatherApiURL, function(foreData) {
        $.getJSON(googleMapURL, function(mapData) {
            geoLocData = mapData;
            console.log(mapData);
//            console.log(mapData.results[2].formatted_address);
            forecastData = foreData;
            console.log(forecastData);
//            console.log(forecastData.daily.summary); 
            render(forecastData, geoLocData);
            skycon(forecastData);
        })
        

}); // END OF JSON!!!!
    
    
        }, displayError) //callback if something goes wrong with the geolocation


        // time to display the JSON data to the DOM
function render(forecastData, geoLocData) {
    const city = geoLocData.results[1].formatted_address;
    const temp = Math.round(forecastData.currently.temperature);
    const currentSummary = forecastData.currently.summary;
    const dailySummary= forecastData.daily.summary;

    document.getElementById('city').innerHTML = city;
    document.getElementById('temp').innerHTML = temp + '°';
    document.getElementById('current').innerHTML = currentSummary;
    document.getElementById('daily').innerHTML = '<i class="fa fa-quote-left" aria-hidden="true" style="font-size:15px"></i> ' + dailySummary + ' <i class="fa fa-quote-right" aria-hidden="true" style="font-size:15px"></i>';
  }  
        // adding pretty skycons
function skycon(data) {
    let skycons = new Skycons({"color": "white"});
    skycons.set("icon", data.currently.icon);
    skycons.play();
        }       
    } //end of condition
    
} //end of getLocation()

getLocation(); //ACTIVATION!!!!!

