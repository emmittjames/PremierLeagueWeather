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
    return getTemperature(data)
}

async function getTemperature(data){
    const temp = data.main["temp"]
    return temp
}

async function calculateTeam(city){
    let teamNames = await fetchPrem(getSeasonYear())
    let temperature = await fetchWeather(city)
    let index = Math.floor(temperature/4)-5
    if(index<0){
        index=0;
    }
    if(index>19){
        index=19;
    }
    index = 19-index

    console.log(teamNames)
    console.log(temperature)
    console.log(index)
    console.log("finish")
    console.log(teamNames[index])

    document.querySelector(".temp").innerText = temp + "°F"
    document.querySelector(".team").innerText = "everton"
}

calculateTeam("Charlottesville")