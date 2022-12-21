# [Premier League Weather](https://eplweather.com)

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This weather app will take in the weather of the current location or a searched location and display an English Premier League team that corresponds to the weather based on how "hot" the team is currently doing
	
## Technologies
Project created with:
* JavaScript
* HTML5
* CSS3
* [OpenWeather API](https://openweathermap.org/api)
* [API-Football](https://www.api-football.com)

## Cloning
1. Clone the repository
2. Create a file named "config.js" in the root directory
3. Put this code into the file:
```
var config = {
    footyKey : 'Your API-Football key',
    weatherKey : 'Your OpenWeather API key'
}
```
