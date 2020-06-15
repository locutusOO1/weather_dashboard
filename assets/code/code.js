$(document).ready(function() {
    // global variables
    var txtIn = "";
    var cityWeather = "http://api.openweathermap.org/data/2.5/weather?q=";
    // current day html elements
    var cityMain = $('#city-main');
    var mainIcon = $('#main-icon');
    var cityTemp = $('#city-temp');
    var cityHumidity = $('#city-humidity');
    var cityWind = $('#city-wind');
    var cityUV = $('#city-uv');
    // forcast html elements
    var foreSect = $('#fore-section');
    var foreRow = $('#forecast-row');
    // search array
    var searchArr = [];


    // get city weather api call
    function getWeather() {
        var cityWeather = "http://api.openweathermap.org/data/2.5/weather?q=" + txtIn + "&units=imperial&APPID=" + weatherKey;
        // console.log(cityWeather);
        // get main weather
        // console.log("weather: "+cityWeather);
        $.getJSON(cityWeather)
            .done(function(response) {
                // console.log(response);
                var curDate = new Date(response.dt*1000).toLocaleDateString('en-US');
                // console.log(response.name);
                cityMain.text(response.name + " (" + curDate + ") ");
                mainIcon.attr("src","http://openweathermap.org/img/w/"+response.weather[0].icon+".png")
                mainIcon.removeClass("hide");

                // console.log(response.main.temp);
                cityTemp.text(response.main.temp+" "+String.fromCharCode(176)+"F");

                // console.log(response.main.humidity);
                cityHumidity.text(response.main.humidity+"%");

                // console.log(response.wind.speed);
                cityWind.text(response.wind.speed+" MPH");

                // console.log(response.coord.lat);
                // console.log(response.coord.lon);
                // get uv
                var cityUVI = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&units=imperial&APPID=" + weatherKey;
                // console.log("UV: "+cityUVI);
                $.getJSON(cityUVI)
                    .done(function(json) {
                        // console.log("uv response:");
                        // console.log(json);
                        cityUV.text(json.value);
                        if (json.value < 3) {
                            cityUV.css("background-color","green");
                        } else if (json.value < 6) {
                            cityUV.css("background-color","yellow");
                        } else if (json.value < 8) {
                            cityUV.css("background-color","orange");
                        } else if (json.value < 11) {
                            cityUV.css("background-color","red");
                        } else {
                            cityUV.css("background-color","violet");
                        }
                    })
                    .fail(function(error) {
                        console.log("uv error:");
                        console.log(error);
                });
                // get forecast
                var cityFore = "http://api.openweathermap.org/data/2.5/forecast?q=" + txtIn + "&units=imperial&APPID=" + weatherKey;
                // console.log("forcast: "+cityFore);
                $.getJSON(cityFore,function(days){
                    // console.log("forcast response:");
                    // console.log(days);
                    // forecastIdx = 0;
                    foreRow.empty();
                    foreSect.removeClass("hide");
                    for (var i = 0; i < days.list.length; i++) {
                        if (days.list[i].dt_txt.indexOf(" 15:00:00") > 0) {
                            // console.log(days.list[i].dt_txt);
                            // console.log(days.list[i].dt);
                            // console.log(days.list[i].main.temp);
                            // console.log(days.list[i].main.humidity);
                            // console.log(days.list[i].weather[0].icon);
                            var curDate = new Date(days.list[i].dt*1000).toLocaleDateString('en-US');
                            var newCard = $('<div class="card day1 fore-day"><div class="card-body"><h6>'+ curDate +'</h6><img src="http://openweathermap.org/img/w/'+ days.list[i].weather[0].icon +'.png" alt="Weather Icon"><p>Temp: '+ days.list[i].main.temp +' '+String.fromCharCode(176)+'F</p><p>Humidity: '+ days.list[i].main.humidity +'%</p></div></div>');
                            foreRow.append(newCard);

                        }
                    }
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