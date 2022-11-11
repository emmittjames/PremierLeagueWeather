let prem = {
    "options": {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '14499cf8bcmsh49dd9f051925dbfp1311fcjsna203bcd62a2d',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    },

    fetchPrem: function(year){
        fetch("https://api-football-v1.p.rapidapi.com/v3/standings?season=" + year + "&league=39", this.options)
        .then(response => response.json().then(data =>{
            console.log(data)
            let league = data["response"][0]["league"]
            let teams = league["standings"][0];
            for(let i=0;i<teams.length;i++){
                console.log(teams[i]);
            }
        }))
        .then(response => console.log(response))
        .catch(err => console.error(err));
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

prem.fetchPrem(getSeasonYear());