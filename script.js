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

async function fetchWeather(city){
    const response = await(fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + config.weatherKey + "&units=" + "imperial"))
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

async function calculateTeam(city){
    const teamNames = await fetchPrem(getSeasonYear())
    const weatherData = await fetchWeather(city)
    const temp = Math.floor(weatherData[1])
    const description = weatherData[2]
    const index = calculateteamIndex(temp)
    const message = getMessage(temp)

    const selectedTeam = teamNames[index]
    console.log(teamNames)
    console.log(selectedTeam)
    console.log(city)
    console.log(temp)
    console.log(description)
    changeScreen(city, temp, description, message, selectedTeam)
}

function changeScreen(name, temp, description, message, team){
    name = name.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    document.querySelector(".team").innerText = team
    document.querySelector(".city").innerText = "Weather in " + name
    document.querySelector(".conditions").innerText = temp + "°F, " + description
    document.querySelector(".message").innerText = message
    changePicture(team);
}

function changePicture(team){
    team = team.replace(/\s/g, '');
    document.body.style.backgroundImage = "url(Pictures/" + team + ".jpeg)"
}

function calculateteamIndex(temperature){
    let random = Math.floor(Math.random()*3)
    const posNeg = Math.random();
    if(posNeg>.5){
        random*=-1
    }
    let index = Math.floor(temperature/4)-5
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

async function fetchCity(lat, lon){
    const response = await(fetch("http://api.openweathermap.org/geo/1.0/reverse?lat=" + lat + "&lon=" + lon + "&limit=1&appid=" +config.weatherKey))
    const data = await response.json()
    return data[0]["name"]
}

function startup(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const city = await fetchCity(position.coords.latitude, position.coords.longitude)
                calculateTeam(city)
            },
            (error) => {
                alert("Please enable location services to get local weather")
                calculateTeam("New York")
            }
        )
    } 
    else {
        alert("Please enable location services to get local weather")
        calculateTeam("New York")
    }
}

document.querySelector(".search button").addEventListener("click",function(){
    calculateTeam(document.querySelector(".searchBar").value)
    document.querySelector(".searchBar").value = ""
})

document.querySelector(".searchBar").addEventListener("keyup",function(event){
    if(event.key == "Enter"){
        calculateTeam(document.querySelector(".searchBar").value)
        document.querySelector(".searchBar").value = ""
    }
})


startup()

//TODO: remove text from search after searching, celcius/farenheight option
//Less important TODO: polish up gui a little bit, once deployed make it look decent on mobile