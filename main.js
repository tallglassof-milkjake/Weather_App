$(document).ready(function() {
    $('#submitBtn').on('click', function(event) {
        event.preventDefault();
    
        // All items for calling from open weather and printing results in the main section

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

            let cityName = response.name;
            let cityHumidity = response.main.humidity;
            let cityWindSpeed = response.wind.speed;

            let currentWeatherDiv = $('#current-weather');

            currentWeatherDiv.append('<div class="card-body"></div>').attr({
                'id': 'weatherCard'
            });

            let weatherCard = $('#weatherCard');
            
            weatherCard.html('<h1 class="display-3">' + cityName + '</h1>');
            weatherCard.append('<p class="lead">Temperature: ' + celsius + '</p>');
            weatherCard.append('<p class="lead">Feels Like: ' + feelsLikeCelsius + '</p>');
            weatherCard.append('<p class="lead">Humidity: ' + cityHumidity + '%</p>');
            weatherCard.append('<p class="lead">Wind Speed: ' + cityWindSpeed + '</p>');
            
            $('#sidebar').append('<button id="sideBarBtn" class="btn btn-outline-success">' + cityName + '</button>');

            let weatherObject = {
                cityName,
                celsius,
                feelsLikeCelsius,
                cityHumidity,
                cityWindSpeed
            }

            localStorage.setItem('mySearch', JSON.stringify(weatherObject));
            localStorage.setItem('myCityBtn', JSON.stringify('<button id="sideBarBtn" class="btn btn-outline-success">' + cityName + '</button>'));
            let weatherSearch = JSON.parse(localStorage.getItem('mySearch'));
            console.log(weatherSearch);

            
        });

        // This is needed for appending called searches to side bar and then saving to local storage and loading again on screen load

        $('#sideBarBtn').on('click', function(event) {
            event.preventDefault();

            weatherCard.html('<h1 class="display-3">' + cityName + '</h1>');
            weatherCard.append('<p class="lead">Temperature: ' + celsius + '</p>');
            weatherCard.append('<p class="lead">Feels Like: ' + feelsLikeCelsius + '</p>');
            weatherCard.append('<p class="lead">Humidity: ' + cityHumidity + '%</p>');
            weatherCard.append('<p class="lead">Wind Speed: ' + cityWindSpeed + '</p>');
        })
    
    });

    
    
})

    

