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
        .then((data) => {
            console.log(data);
        })
        //displayWeather: function(data){

        //}
    }
}

weather.fetchWeather("Charlottesville")