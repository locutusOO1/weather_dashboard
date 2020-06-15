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
        $.getJSON(cityWeather)
            .done(function(response) {
                // populate current weather
                var curDate = new Date(response.dt*1000).toLocaleDateString('en-US');
                cityMain.text(response.name + " (" + curDate + ") ");
                mainIcon.attr("src","http://openweathermap.org/img/w/"+response.weather[0].icon+".png")
                mainIcon.removeClass("hide");
                cityTemp.text(response.main.temp+" "+String.fromCharCode(176)+"F");
                cityHumidity.text(response.main.humidity+"%");
                cityWind.text(response.wind.speed+" MPH");
                // get uv
                var cityUVI = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&units=imperial&APPID=" + weatherKey;
                $.getJSON(cityUVI)
                    .done(function(json) {
                        // populate uv
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
                $.getJSON(cityFore,function(days) {
                    foreRow.empty();
                    foreSect.removeClass("hide");
                    for (var i = 0; i < days.list.length; i++) {
                        if (days.list[i].dt_txt.indexOf(" 15:00:00") > 0) {
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