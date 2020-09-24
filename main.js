$(document).ready(function() {

    $('#submitBtn').on('click', function(event) {
        event.preventDefault();
    
        let currentWeatherDiv = $('#current-weather');
        let forecast1 = $('.forecast1');
        let forecast2 = $('.forecast2');
        let forecast3 = $('.forecast3');
        let forecast4 = $('.forecast4');
        let forecast5 = $('.forecast5');
        // All items for calling from open weather and printing results in the main section except UV

        let locationQuery = $('#my-location').val();

        let queryUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + locationQuery + '&appid=6d2aa3e12929722f96b5f0c1ddfc3d7e';
        let queryUrlForecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' + locationQuery + '&appid=6d2aa3e12929722f96b5f0c1ddfc3d7e';

        currentWeatherDiv.empty();
        forecast1.empty();
        forecast2.empty();
        forecast3.empty();
        forecast4.empty();
        forecast5.empty();

        //Current weather for your city
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
            currentWeatherDiv.append('<p class="lead">Temperature: ' + celsius + '</p>');
            currentWeatherDiv.append('<p class="lead">Feels Like: ' + feelsLikeCelsius + '</p>');
            currentWeatherDiv.append('<p class="lead">Humidity: ' + cityHumidity + '%</p>');
            currentWeatherDiv.append('<p class="lead">Wind Speed: ' + cityWindSpeed + '</p>');
            
            $('#sidebar').append('<button id="sideBarBtn" class="btn btn-outline-success">' + cityName + '</button>');

            let sideBarBtn = $('#sideBarBtn');

            sideBarBtn.on('click', function(event) {
                event.preventDefault();

                currentWeatherDiv.empty();

                currentWeatherDiv.append('<h1 class="display-3">' + cityName + '</h1>');
                currentWeatherDiv.append('<p class="lead">Temperature: ' + celsius + '</p>');
                currentWeatherDiv.append('<p class="lead">Feels Like: ' + feelsLikeCelsius + '</p>');
                currentWeatherDiv.append('<p class="lead">Humidity: ' + cityHumidity + '%</p>');
                currentWeatherDiv.append('<p class="lead">Wind Speed: ' + cityWindSpeed + '</p>');

            })

            let lat = response.coord.lat;
            let lon = response.coord.lon

            let queryUV = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=6d2aa3e12929722f96b5f0c1ddfc3d7e';
            //Try an ajax within an ajax for callig uv data using weather city longitude and latitude
            $.ajax({
                url: queryUV,
                method: 'GET'
            }).then(function(response) {
                
                console.log(response);

                currentWeatherDiv.append('<div><p class="lead UVindex">UV Index: ' + response.value + '</p></div>');

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

        });

        //Weather forecast for your city
        $.ajax({
            url: queryUrlForecast,
            method: 'GET'
        }).then(function(response) {
            //
            console.log(queryUrlForecast);
            console.log(response.city.name);
            console.log(response.list);
            console.log(response.list[0].main.temp -273.25);
            console.log(response.list[8].main.temp -273.25);
            console.log(response.list[16].main.temp -273.25);
            console.log(response.list[24].main.temp -273.25);
            console.log(response.list[32].main.temp -273.25);
            
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

            $('.forecast1').append('<h3>' + today + '</h3>');
            $('.forecast1').append('<p class="lead">' + todayTemp.toFixed(2) + '</p>');

            $('.forecast2').append('<h3>' + tomorrow + '</h3>');
            $('.forecast2').append('<p class="lead">' + tomorrowTemp.toFixed(2) + '</p>');

            $('.forecast3').append('<h3>' + theDayAfter + '</h3>');
            $('.forecast3').append('<p class="lead">' + theDayAfterTemp.toFixed(2) + '</p>');

            $('.forecast4').append('<h3>' + theDayAfterThat + '</h3>');
            $('.forecast4').append('<p class="lead">' + theDayAfterNextTemp.toFixed(2) + '</p>');

            $('.forecast5').append('<h3>' + theNextDayAfterThat + '</h3>');
            $('.forecast5').append('<p class="lead">' + theNextDayAfterThatTemp.toFixed(2) + '</p>');

            

        });

        

    });

})

    

