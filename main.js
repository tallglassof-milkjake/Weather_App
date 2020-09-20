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

            let currentWeatherDiv = $('#current-weather');
            currentWeatherDiv.append('<h1 class="display-1 pl-5">' + response.name + '</h1>');
            currentWeatherDiv.append('<h2 class="display-4 pl-5">' + celsius + '</h2>');
        });
    
        
    
    });
    
})

    

