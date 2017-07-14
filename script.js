let forecastData;
let geoLocData ;
let units = '?units=si';

const displayError = (error) => {
    let errors = ['Unknown error', 'Permission denied by user', 'Position not available', 'Timeout error'];
    let message = errors[error.code];
    console.warn('Error in getting your location: ' + message, error.message);
}


const getLocation = () => {
    if (navigator.geolocation) { //if the geolocation works, go fetch the local weather
        navigator.geolocation.getCurrentPosition(function displayLocation(position) {
            
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
            
    const baseURL = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/'; //proxy + api url
    const apiKey = process.env.API_KEY;
    const weatherApiURL = baseURL + apiKey + '/' + lat + ',' + long + units; //full api url  
            
    //convert the temperature by making a new API call
            
    if (units == '?units=si') {
        $('.celsius').css('color', '#1ba5b7');
        $('.farenheit').css('color', 'whitesmoke');
    } else {
        $('.celsius').css('color', 'whitesmoke');
        $('.farenheit').css('color', '#1ba5b7');
    }
        
    $('.celsius').on('click', function () {
    units = "?units=si";
    getLocation();
});

    $('.farenheit').on('click', function () {
    units = "?units=us";
    getLocation();
});
     
            
//using google API because dark sky API doesn't indicate cities
    const googleMapURL = 'https://maps.googleapis.com/maps/api/geocode/json?&latlng=' + lat + ',' + long;
    
            
//grabbing JSON and what I want to display on the DOM
    $.getJSON(weatherApiURL, function(foreData) {
        $.getJSON(googleMapURL, function(mapData) {
            geoLocData = mapData;
            console.log(mapData);
            forecastData = foreData;
            console.log(forecastData);
            render(forecastData, geoLocData);
            skycon(forecastData);
        })
    }); // END OF JSON!!!!
  }, displayError) //callback if something goes wrong with the geolocation


        // time to display the JSON data to the DOM
function render(forecastData, geoLocData) {
    let city = geoLocData.results[1].address_components["0"].long_name;
    let temp = Math.round(forecastData.currently.temperature);
    let currentSummary = forecastData.currently.summary;
    let dailySummary= forecastData.daily.summary;

    document.getElementById('city').innerHTML = city;
    document.getElementById('temp').innerHTML = temp + '°';
    document.getElementById('current').innerHTML = currentSummary;
    document.getElementById('daily').innerHTML = dailySummary;
  }  
        // adding pretty skycons
function skycon(data) {
    let skycons = new Skycons({"color": "whitesmoke"});
    skycons.set("icon", data.currently.icon);
    skycons.play();
        }       
    } //end of condition
    
} //end of getLocation()

getLocation(); //ACTIVATION!!!!!

