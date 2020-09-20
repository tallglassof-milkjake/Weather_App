$(document).ready(function() {
    $('#submitBtn').on('click', function(event) {
        event.preventDefault();
    
        let locationQuery = $('#my-location').val();

        let queryUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + locationQuery +'&appid=6d2aa3e12929722f96b5f0c1ddfc3d7e';
    
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(response) {
            console.log(queryUrl);
            console.log(response.name);
            console.log(response.main);
    
            response.main.temp = response.main.temp - 273.15;
            let celsius = response.main.temp.toFixed(2);
            response.main.feels_like = response.main.feels_like - 273.25;
            let feelsLikeCelsius = response.main.feels_like.toFixed(2);

            let currentWeatherDiv = $('#current-weather');
            
            currentWeatherDiv.append('<h1 class="display-3">' + response.name + '</h1>');
            currentWeatherDiv.append('<p class="lead">Temperature: ' + celsius + '</p>');
            currentWeatherDiv.append('<p class="lead">Feels Like: ' + feelsLikeCelsius + '</p>');
            currentWeatherDiv.append('<p class="lead">Humidity: ' + response.main.humidity + '%</p>')
            currentWeatherDiv.append('<p class="lead">Wind Speed: ' + response.wind.speed + '</p>')
            //currentWeatherDiv.append('<p class="lead">UV Index: ' + response.wind.speed + '</p>')
        });
    
        
    
    });
    
})

    

