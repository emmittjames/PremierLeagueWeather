let celsius = false

function getDataFromLocalStorage() {
    if (typeof window !== 'undefined') {
        const data = JSON.parse(localStorage.getItem("prem"))
        return data
    }
}  

function isDataOutdated(data){
    const date = new Date(data["date"])
    const today = new Date();
    if(!date || date.getDay()<today.getDay()){
        console.log("fetching new data")
        return true
    }
    return false
}

async function fetchPrem(year){
    let data = getDataFromLocalStorage();
    if(!data || isDataOutdated(data)) {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': config.footyKey,
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        }
        const response = await(fetch("https://api-football-v1.p.rapidapi.com/v3/standings?season=" + year + "&league=39", options))
        const data = await response.json()
        const teamNames = getTeamNames(data)
        localStorage.setItem("prem", 
            JSON.stringify({ "teamNames": teamNames, "date": new Date()})
        )
        return getDataFromLocalStorage()["teamNames"];
    }
    return data["teamNames"]
}

function getTeamNames(data){
    let teamNames = []
    const league = data["response"][0]["league"]
    const teams = league["standings"][0]
    for(let i=0;i<teams.length;i++){
        teamNames.push(teams[i]["team"]["name"])
    }
    return teamNames
}

function getSeasonYear(){
    const today = new Date()
    const year = today.getFullYear()
    const premStart = new Date(year, 8, 1);
    if(today<premStart){
        year--;
    }
    return year
}

async function fetchWeatherUsingCity(city){
    const response = await(fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + config.weatherKey + "&units=" + "imperial"))
    const data = await response.json()
    return getWeatherData(data)
}

async function fetchWeatherUsingCoords(lon,lat){
    const response = await(fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + config.weatherKey + "&units=" + "imperial"))
    const data = await response.json()
    return getWeatherData(data)
}

async function getWeatherData(data){
    let weatherData = []
    weatherData.push(data["name"])
    weatherData.push(data.main["temp"])
    weatherData.push(data.weather[0]["description"])
    return weatherData
}

async function calculateTeamUsingCity(city){
    const weatherData = await fetchWeatherUsingCity(city)
    calculateTeam(weatherData)
}

async function calculateTeamUsingCoords(lon,lat){
    const weatherData = await fetchWeatherUsingCoords(lon,lat)
    calculateTeam(weatherData)
}

async function calculateTeam(weatherData){ 
    const city = weatherData[0]
    let temp = Math.round(weatherData[1])
    const description = weatherData[2]
    const message = getMessage(temp)
    const teamNames = await fetchPrem(getSeasonYear())
    const teamIndex = calculateteamIndex(temp)
    const selectedTeam = teamNames[teamIndex]
    if(celsius){
        temp = convertToCelsius(temp)
        temp += "°C, "
    }
    else{
        temp += "°F, "
    }
    changeScreen(city, temp, description, message, selectedTeam)
}

function changeScreen(name, temp, description, message, team){
    name = name.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    document.querySelector(".team").innerText = team
    document.querySelector(".city").innerText = "Weather in " + name
    document.querySelector(".conditions").innerText = temp + description
    document.querySelector(".message").innerText = message
    changePicture(team);
}

function changePicture(team){
    team = team.replace(/\s/g, '');
    document.body.style.backgroundImage = "url(Pictures/" + team + ".jpeg)"
}

function calculateteamIndex(temperature){
    let random = Math.round(Math.random()*3)
    const posNeg = Math.random();
    if(posNeg>.5){
        random*=-1
    }
    let index = Math.round(temperature/4)-5
    index+=random;
    if(index<0){
        index=0;
    }
    if(index>19){
        index=19;
    }
    index = 19-index
    return index
}

function getMessage(temperature){
    let message = ""
    if(temperature<30){
        message += "Wow! It's cold"
    }
    else if(temperature<40){
        message += "It's pretty cold"
    }
    else if(temperature<50){
        message += "It's a little cold"
    }
    else if(temperature<60){
        message += "It's fair"
    }
    else if(temperature<70){
        message += "It's warm"
    }
    else if(temperature<85){
        message += "It's pretty hot"
    }
    else{
        message += "Wow! It's hot"
    }
    message += "\nJust like"
    return message
}

function startup(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                calculateTeamUsingCoords(position.coords.longitude, position.coords.latitude)
            },
            (error) => {
                alert("Please enable location services to get local weather")
                calculateTeamUsingCity("New York City")
            }
        )
    } 
    else {
        alert("Please enable location services to get local weather")
        calculateTeamUsingCity("New York City")
    }
}

function convertToCelsius(temp){
    temp-=32
    temp*=(5/9)
    return Math.round(temp)
}

function convertToFahrenheit(temp){
    temp*=(9/5)
    temp+=32
    return Math.round(temp)
}

document.querySelector(".search button").addEventListener("click",function(){
    calculateTeamUsingCity(document.querySelector(".searchBar").value)
    document.querySelector(".searchBar").value = ""
})

document.querySelector(".searchBar").addEventListener("keyup",function(e){
    if(e.key == "Enter"){
        calculateTeamUsingCity(document.querySelector(".searchBar").value)
        document.querySelector(".searchBar").value = ""
    }
})

document.querySelector(".toggle").addEventListener("change",function(e){
    const text = document.querySelector(".conditions").innerText
    const commaIndex = text.indexOf(",")
    const description = text.substring(commaIndex)
    let temp = text.substring(0,commaIndex-2)
    if(document.querySelector(".toggle").checked){    //Celsius
        celsius = true;
        temp = convertToCelsius(temp)
        tempStr = temp + "°C"
    }
    else{       //Fahrenheit
        celsius = false;
        temp = convertToFahrenheit(temp)
        tempStr = temp + "°F"
    }
    document.querySelector(".conditions").innerText = tempStr + description
})


startup()

//TODO: celcius/farenheight option
//Less important TODO: polish up gui a little bit, once deployed make it look decent on mobile