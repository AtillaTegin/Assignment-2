let weather = {
    apiKey: "94f1a30bcd396645d6ab43b75e97ab69",
    fetchWeather: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
             + city 
             + "&units=metric&appid="
             + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, pressure, temp_max, temp_min, feels_like } = data.main;
        const { speed, deg } = data.wind;

        var compassSector = ["North", "North Northeast", "North East", "East Northeast", "East", "East Southeast", "South East", "South Southeast", "South", "South Southwest", "South West", "West Southwest", "West", "West Northwest", "North West", "North Northwest", "North"];
        weather.windDirection = compassSector[(data.wind.deg / 22.5).toFixed(0)];

        document.querySelector(".city").innerText = name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = `${description}`;
        document.querySelector(".temp").innerText = `${temp} °C`;
        document.querySelector(".temp_min").innerText = `Min Temperature: ${temp_min} °C`;
        document.querySelector(".temp_max").innerText = `Max Temperature: ${temp_max} °C`;
        document.querySelector(".feels_like").innerText = `Feels Like: ${feels_like}`;
        document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
        document.querySelector(".pressure").innerText = `Pressure: ${pressure}inHg`;
        document.querySelector(".speed").innerText = `Wind Speed: ${speed}m/s`;
        document.querySelector(".deg").innerText = `Wind direction: ${weather.windDirection} / ${speed}`;
        
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')"
    },
    search: function() {
        this.fetchWeather(document.querySelector("#search_bar").value);
    }
};

let geocode = {
    reverseGeocode: function(latitude, longitude) {
    var api_key = 'aa3a03acc6874e14a2a9596b2c1751d6';

  var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
    if (request.status === 200){
      var data = JSON.parse(request.responseText);
      console.log(data.results[0].components.city);
      weather.fetchWeather("Baku")

    } else if (request.status <= 500){
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    console.log("unable to connect to server");
  };

        request.send();
    },
    getlocation: function() {
        function success (data) {
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, console.error);
        }
        else {
            weather.fetchWeather("Baku")
        }
    }
};

document.querySelector(".search-bar button")
    .addEventListener("click", function(){
        weather.search();
});

document.querySelector("#search_bar")
.addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        weather.search();
    }
});
weather.fetchWeather('Baku');
