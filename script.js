//const url = "https://api.openweathermap.org/data/2.5/weather?q={London}&appid={55adcacc18884e6c11d90a5bb7f97e31}&units=imperial";

let weather = {
    "apiKey": "55adcacc18884e6c11d90a5bb7f97e31",
    fetchWeather: function(city){
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
            +city
            +"&appid=" + this.apiKey
            +"&units=" + "imperial"
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data){
        const {name} = data
        const {icon,description} = data.weather[0]
        const {temp,humidity} = data.main
        const {speed} = data.wind
        console.log(name,icon,description,temp,humidity,speed)
        document.querySelector(".temp").innerText = temp + "°F"
        document.querySelector(".city").innerText = "Weather in " + name
        document.querySelector(".description").innerText = description
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%"
        document.querySelector(".wind").innerText = speed + " MPH"
        document.querySelector(".icon").src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    }
}

weather.fetchWeather("Charlottesville")