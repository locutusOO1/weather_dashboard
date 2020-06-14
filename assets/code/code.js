$(document).ready(function() {
    // global variables
    var txtIn = "";
    var cityWeather = "http://api.openweathermap.org/data/2.5/weather?q=";
    // html elements
    var cityMain = $('#city-main');
    var cityTemp = $('#city-temp');
    var cityHumidity = $('#city-humidity');
    var cityWind = $('#city-wind');
    var cityUV = $('#city-uv');

    // get city weather api call
    function getWeather() {
        var cityWeather = "http://api.openweathermap.org/data/2.5/weather?q=" + txtIn + "&units=imperial&APPID=" + weatherKey;
        console.log(cityWeather);
        // get main weather
        console.log("weather: "+cityWeather);
        $.getJSON(cityWeather)
            .done(function(response) {
                console.log(response);
                
                console.log(response.name);
                cityMain.text(response.name);

                console.log(response.main.temp);
                cityTemp.text(response.main.temp);

                console.log(response.main.humidity);
                cityHumidity.text(response.main.humidity+"%");

                console.log(response.wind.speed);
                cityWind.text(response.wind.speed+"MPH");

                console.log(response.coord.lat);
                console.log(response.coord.lon);
                // get uv
                var cityUV = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&units=imperial&APPID=" + weatherKey;
                console.log("UV: "+cityUV);
                $.getJSON(cityUV)
                    .done(function(json) {
                        console.log("uv response:");
                        console.log(json);
                        cityUV.text(json.value);
                    })
                    .fail(function(error) {
                        console.log("uv error:");
                        console.log(error);
                });
                // get forecast
                var cityFore = "http://api.openweathermap.org/data/2.5/forecast?q=" + txtIn + "&units=imperial&APPID=" + weatherKey;
                console.log("forcast: "+cityFore);
                $.getJSON(cityFore,function(response){
                    console.log("forcast response:");
                    console.log(response);
                });
            })
            .fail(function(error) {
                console.log(error)
        });
    }

    // search button action listener
    $('#searchBtn').on("click",function(event) {
        event.preventDefault();
        txtIn = $('#citySearch').val();
        $('#citySearch').val('');
        if (txtIn.length > 0) {
            getWeather();
        }

    });
});