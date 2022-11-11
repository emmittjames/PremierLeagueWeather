async function fetchPrem(year){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '14499cf8bcmsh49dd9f051925dbfp1311fcjsna203bcd62a2d',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };
    const response = await(fetch("https://api-football-v1.p.rapidapi.com/v3/standings?season=" + year + "&league=39", options))
    const data = await response.json()
    return getTeamNames(data)
}

async function getTeamNames(data){
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
    const apiKey = "55adcacc18884e6c11d90a5bb7f97e31"
    const response = await(fetch("https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=" + apiKey+"&units=" + "imperial"))
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
    const name = weatherData[0]
    const temp = weatherData[1]
    const description = weatherData[2]
    let index = calculateIndex(temp)

    const selectedTeam = teamNames[index]
    console.log(selectedTeam)
    console.log(name)
    console.log(temp)
    console.log(description)
    changeScreen(selectedTeam, name, temp, description)
}

function changeScreen(team, name, temp, description){
    document.querySelector(".team").innerText = team
    document.querySelector(".city").innerText = "Weather in " + name
    document.querySelector(".temp").innerText = temp + "°F"
    document.querySelector(".description").innerText = description
}

function calculateIndex(temperature){
    let index = Math.floor(temperature/4)-5
    if(index<0){
        index=0;
    }
    if(index>19){
        index=19;
    }
    index = 19-index
    return index
}

calculateTeam("Charlottesville")