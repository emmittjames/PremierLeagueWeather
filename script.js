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
    const index = calculateIndex(temp)
    const message = getMessage(temp)

    const selectedTeam = teamNames[index]
    console.log(selectedTeam)
    console.log(name)
    console.log(temp)
    console.log(description)
    changeScreen(name, temp, description, message, selectedTeam)
}

function changeScreen(name, temp, description, message, team){
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

function calculateIndex(temperature){
    const random = Math.floor(Math.random()*3)
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

calculateTeam("New York")

document.querySelector(".search button").addEventListener("click",function(){
    calculateTeam(document.querySelector(".searchBar").value)
})

document.querySelector(".searchBar").addEventListener("keyup",function(event){
    if(event.key == "Enter"){
        calculateTeam(document.querySelector(".searchBar").value)
    }
})

//TODO: gui changes, get full name for clubs, remove text from search after searching