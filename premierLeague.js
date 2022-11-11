function fetchPrem(year){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '14499cf8bcmsh49dd9f051925dbfp1311fcjsna203bcd62a2d',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    fetch("https://api-football-v1.p.rapidapi.com/v3/standings?season=" + year + "&league=39", options)
    .then(response => response.json())
    .then((data) => {
        test(data)
    });
}

let teamNames = []

function test(data){
    const league = data["response"][0]["league"]
    const teams = league["standings"][0]
    for(let i=0;i<teams.length;i++){
        teamNames.push(teams[i]["team"]["name"])
    }
    for(let i=0;i<teamNames.length;i++){
        console.log(teamNames[i])
    }
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

fetchPrem(getSeasonYear());
for(let i=0;i<teamNames.length;i++){
    console.log(teamNames[i])
}