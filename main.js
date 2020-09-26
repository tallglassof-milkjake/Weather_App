$(document).ready(function() {

    //Setting variables for clearing html on search
    let currentWeatherDiv = $('#current-weather');
    let forecast1 = $('#forecast1');
    let forecast2 = $('#forecast2');
    let forecast3 = $('#forecast3');
    let forecast4 = $('#forecast4');
    let forecast5 = $('#forecast5');

    //Main search button in search bar
    
    $('#submitBtn').on('click', function (event) {
            event.preventDefault();

            // All items for calling from open weather and printing results in the main section except UV
            let locationQuery = $('#my-location').val();
            let queryUrlForecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' + locationQuery + '&appid=6d2aa3e12929722f96b5f0c1ddfc3d7e';
            let queryUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + locationQuery + '&appid=6d2aa3e12929722f96b5f0c1ddfc3d7e';
            
            //Empty previous searches
            currentWeatherDiv.empty();
            forecast1.empty();
            forecast2.empty();
            forecast3.empty();
            forecast4.empty();
            forecast5.empty();
            $('#my-location').empty();

            //Current weather for your city
            $.ajax({
                url: queryUrl,
                method: 'GET'
            }).then(function(response) {
                
                //Change celcius from kelvin and bring to 2 decimal places (I have found a more easier inline way to do this since writing this code)
                response.main.temp = response.main.temp - 273.15;
                let celsius = response.main.temp.toFixed(2);
                response.main.feels_like = response.main.feels_like - 273.25;
                let feelsLikeCelsius = response.main.feels_like.toFixed(2);

                console.log(response.weather[0].description);

                //Using variables to shorten calls to API
                let cityName = response.name;
                let cityHumidity = response.main.humidity;
                let cityWindSpeed = response.wind.speed;
                
                //Appending Current weather details to HTML
                currentWeatherDiv.append('<h1 class="display-3" id="weather-header">' + cityName + ' </h1>');
                $('#weather-header').append('<small class="">' + response.weather[0].description + '</small><br>');
                $('#weather-header').append('<img src="http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png">');
                currentWeatherDiv.append('<p class="lead"><b>Temperature:</b> ' + celsius + '&#8451</p>');
                currentWeatherDiv.append('<p class="lead"><b>Feels Like:</b> ' + feelsLikeCelsius + '&#8451</p>');
                currentWeatherDiv.append('<p class="lead"><b>Humidity:</b> ' + cityHumidity + '%</p>');
                currentWeatherDiv.append('<p class="lead"><b>Wind Speed:</b> ' + cityWindSpeed + '</p>');
                
                //Adding button to sidebar
                $('#sidebar').append('<button id="sideBarBtn" class="btn btn-outline-success">' + cityName + '</button><br>');

                localStorage.setItem('city', locationQuery);

                //Getting latitude and longitude for UV API
                let lat = response.coord.lat;
                let lon = response.coord.lon

                //Query for getting UV rating (needs to be within primary function to get latitude and longitude)
                let queryUV = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=6d2aa3e12929722f96b5f0c1ddfc3d7e';
                //Try an ajax within an ajax for callig uv data using weather city longitude and latitude
                $.ajax({
                    url: queryUV,
                    method: 'GET'
                }).then(function(response) {
                    
                    //Setting UV status into current weather div
                    currentWeatherDiv.append('<div><p class="lead"><b>UV Index:</b> ' + response.value + '</p></div><div class="UVstatus" id="UVindex"></div>');
                    //currentWeatherDiv.append('<div class="UVstatus" id="UVindex"></div>');

                    //Using an if else to set the colour of the background of the UV Index
                    if (response.value <= 2) {
                        $('#UVindex').css('backgroundColor', 'green')
                    } else if (response.value >= 3 && response.value <= 5) {
                        $('#UVindex').css('backgroundColor', 'yellow')
                    } else if (response.value >=6 && response.value <= 7) {
                        $('#UVindex').css('backgroundColor', 'orange')
                    } else if (response.value >=8 && response.value <= 10) {
                        $('#UVindex').css('backgroundColor', 'red')
                    } else if (response.value >=11) {
                        $('#UVindex').css('backgroundColor', 'pink')
                    }

                });

                $.ajax({
                    url: queryUrlForecast,
                    method: 'GET'
                }).then(function(response) {
                    
                    //Setting the day and date for the 5 day forecast
                    let today = moment().add(0, 'days').format('dddd Do');
                    let tomorrow = moment().add(1, 'days').format('dddd Do');
                    let theDayAfter = moment().add(2, 'days').format('dddd Do');
                    let theDayAfterThat = moment().add(3, 'days').format('dddd Do');
                    let theNextDayAfterThat = moment().add(4, 'days').format('dddd Do');
        
                    //Setting variables to consider kelvin into celsius for each 3pm weather object
                    let todayTemp = response.list[0].main.temp -273.25;
                    let tomorrowTemp = response.list[8].main.temp -273.25;
                    let theDayAfterTemp = response.list[16].main.temp -273.25;
                    let theDayAfterNextTemp = response.list[24].main.temp -273.25;
                    let theNextDayAfterThatTemp = response.list[32].main.temp -273.25;
                    
                    //Appending each card with forecast day/date, forecast icon, temperature and humidity
                    $('#forecast1').append('<h3>' + today + '</h3>');
                    $('#forecast1').append('<img src="http://openweathermap.org/img/wn/' + response.list[0].weather[0].icon + '@2x.png">');
                    $('#forecast1').append('<p class="lead"><b>Temp:</b> ' + todayTemp.toFixed(2) + '&#8451</p>');
                    $('#forecast1').append('<p class="lead"><b>Humidity:</b> ' + response.list[0].main.humidity + '%</p>');

        
                    $('#forecast2').append('<h3>' + tomorrow + '</h3>');
                    $('#forecast2').append('<img src="http://openweathermap.org/img/wn/' + response.list[8].weather[0].icon + '@2x.png">');
                    $('#forecast2').append('<p class="lead"><b>Temp:</b> ' + tomorrowTemp.toFixed(2) + '&#8451</p>');
                    $('#forecast2').append('<p class="lead"><b>Humidity:</b> ' + response.list[8].main.humidity + '%</p>');
        
                    $('#forecast3').append('<h3>' + theDayAfter + '</h3>');
                    $('#forecast3').append('<img src="http://openweathermap.org/img/wn/' + response.list[16].weather[0].icon + '@2x.png">');
                    $('#forecast3').append('<p class="lead"><b>Temp:</b> ' + theDayAfterTemp.toFixed(2) + '&#8451</p>');
                    $('#forecast3').append('<p class="lead"><b>Humidity:</b> ' + response.list[16].main.humidity + '%</p>');
        
                    $('#forecast4').append('<h3>' + theDayAfterThat + '</h3>');
                    $('#forecast4').append('<img src="http://openweathermap.org/img/wn/' + response.list[24].weather[0].icon + '@2x.png">');
                    $('#forecast4').append('<p class="lead"><b>Temp:</b> ' + theDayAfterNextTemp.toFixed(2) + '&#8451</p>');
                    $('#forecast4').append('<p class="lead"><b>Humidity:</b> ' + response.list[24].main.humidity + '%</p>');
        
                    $('#forecast5').append('<h3>' + theNextDayAfterThat + '</h3>');
                    $('#forecast5').append('<img src="http://openweathermap.org/img/wn/' + response.list[32].weather[0].icon + '@2x.png">');
                    $('#forecast5').append('<p class="lead"><b>Temp:</b> ' + theNextDayAfterThatTemp.toFixed(2) + '&#8451</p>');
                    $('#forecast5').append('<p class="lead"><b>Humidity:</b> ' + response.list[32].main.humidity + '%</p>');
        
                });

            });

            //For clicking on the buttons saved to sidebar
            $('#sideBarBtn').on('click', function (event) {
                event.preventDefault();
                console.log('ITS CLICKED');
        
                historyBTN = $('#sideBarBtn').text();
                let queryUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + historyBTN + '&appid=6d2aa3e12929722f96b5f0c1ddfc3d7e';
                let queryUrlForecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' + historyBTN + '&appid=6d2aa3e12929722f96b5f0c1ddfc3d7e';
        
                console.log(historyBTN);
        
                currentWeatherDiv.empty();
                forecast1.empty();
                forecast2.empty();
                forecast3.empty();
                forecast4.empty();
                forecast5.empty();
        
                $.ajax({
                    url: queryUrl,
                    method: 'GET'
                }).then(function(response) {
                    console.log(queryUrl);
                    console.log(response.name);
                    console.log(response);
            
                    response.main.temp = response.main.temp - 273.15;
                    let celsius = response.main.temp.toFixed(2);
                    response.main.feels_like = response.main.feels_like - 273.25;
                    let feelsLikeCelsius = response.main.feels_like.toFixed(2);
        
                    let cityName = response.name;
                    let cityHumidity = response.main.humidity;
                    let cityWindSpeed = response.wind.speed;
                    
                    currentWeatherDiv.append('<h1 class="display-3">' + cityName + '</h1>');
                    currentWeatherDiv.append('<p class="lead">Temperature: ' + celsius + '&#8451</p>');
                    currentWeatherDiv.append('<p class="lead">Feels Like: ' + feelsLikeCelsius + '&#8451</p>');
                    currentWeatherDiv.append('<p class="lead">Humidity: ' + cityHumidity + '%</p>');
                    currentWeatherDiv.append('<p class="lead">Wind Speed: ' + cityWindSpeed + '</p>');
                    
                    //$('#sidebar').append('<button id="sideBarBtn" class="btn btn-outline-success">' + cityName + '</button>');
        
                    //Getting latitude and longitude for UV API
                    let lat = response.coord.lat;
                    let lon = response.coord.lon
        
                    //Query for getting UV rating (needs to be within primary function to get latitude and longitude)
                    let queryUV = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=6d2aa3e12929722f96b5f0c1ddfc3d7e';
                    //Try an ajax within an ajax for callig uv data using weather city longitude and latitude
                    $.ajax({
                        url: queryUV,
                        method: 'GET'
                    }).then(function(response) {
                        
                        console.log(response);
        
                        currentWeatherDiv.append('<div><p class="lead UVindex"><b>UV Index: ' + response.value + '</b></p></div>');
        
                        if (response.value <= 2) {
                            $('.UVindex').css('backgroundColor', 'green')
                        } else if (response.value >= 3 && response.value <= 5) {
                            $('.UVindex').css('backgroundColor', 'yellow')
                        } else if (response.value >=6 && response.value <= 7) {
                            $('.UVindex').css('backgroundColor', 'orange')
                        } else if (response.value >=8 && response.value <= 10) {
                            $('.UVindex').css('backgroundColor', 'red')
                        } else if (response.value >=11) {
                            $('.UVindex').css('backgroundColor', 'pink')
                        }
                    });
        
                    $.ajax({
                        url: queryUrlForecast,
                        method: 'GET'
                    }).then(function(response) {
                        //
                        console.log(queryUrlForecast);
                        console.log(response.city.name);
                        console.log(response.list);
                        
                        let today = moment().add(0, 'days').format('dddd Do');
                        let tomorrow = moment().add(1, 'days').format('dddd Do');
                        let theDayAfter = moment().add(2, 'days').format('dddd Do');
                        let theDayAfterThat = moment().add(3, 'days').format('dddd Do');
                        let theNextDayAfterThat = moment().add(4, 'days').format('dddd Do');
                        //
                        console.log(today);
                        console.log(tomorrow);
                        console.log(theDayAfter);
                        console.log(theDayAfterThat);
                        console.log(theNextDayAfterThat);
            
                        let todayTemp = response.list[0].main.temp -273.25;
                        let tomorrowTemp = response.list[8].main.temp -273.25;
                        let theDayAfterTemp = response.list[16].main.temp -273.25;
                        let theDayAfterNextTemp = response.list[24].main.temp -273.25;
                        let theNextDayAfterThatTemp = response.list[32].main.temp -273.25;
            
                        $('#forecast1').append('<h3>' + today + '</h3>');
                        $('#forecast1').append('<img src="http://openweathermap.org/img/wn/' + response.list[0].weather[0].icon + '@2x.png">');
                        $('#forecast1').append('<p class="lead"><b>Temp:</b> ' + todayTemp.toFixed(2) + '&#8451</p>');
            
                        console.log(response.list[0].weather[0].icon);
            
                        $('#forecast2').append('<h3>' + tomorrow + '</h3>');
                        $('#forecast2').append('<img src="http://openweathermap.org/img/wn/' + response.list[8].weather[0].icon + '@2x.png">');
                        $('#forecast2').append('<p class="lead"><b>Temp:</b> ' + tomorrowTemp.toFixed(2) + '&#8451</p>');
            
                        $('#forecast3').append('<h3>' + theDayAfter + '</h3>');
                        $('#forecast3').append('<img src="http://openweathermap.org/img/wn/' + response.list[16].weather[0].icon + '@2x.png">');
                        $('#forecast3').append('<p class="lead"><b>Temp:</b> ' + theDayAfterTemp.toFixed(2) + '&#8451</p>');
            
                        $('#forecast4').append('<h3>' + theDayAfterThat + '</h3>');
                        $('#forecast4').append('<img src="http://openweathermap.org/img/wn/' + response.list[24].weather[0].icon + '@2x.png">');
                        $('#forecast4').append('<p class="lead"><b>Temp:</b> ' + theDayAfterNextTemp.toFixed(2) + '&#8451</p>');
            
                        $('#forecast5').append('<h3>' + theNextDayAfterThat + '</h3>');
                        $('#forecast5').append('<img src="http://openweathermap.org/img/wn/' + response.list[32].weather[0].icon + '@2x.png">');
                        $('#forecast5').append('<p class="lead"><b>Temp:</b> ' + theNextDayAfterThatTemp.toFixed(2) + '&#8451</p>');
            
                    });
    
                });
            
            });

        });

})
