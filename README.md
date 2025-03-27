# [Premier League Weather](https://eplweather.netlify.app/)

## Table of contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Cloning](#cloning)
* [Sample Images](#sample-images)
* [License](#license)

## General Info
#### Website link: [eplweather.com](https://eplweather.netlify.app/)
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
2. Generate an [OpenWeather API](https://openweathermap.org/api) key and an [API-Football](https://www.api-football.com) key
3. Create a file named "config.js" in the root directory
4. Put this code into the file and put your generated API keys into it:
```
var config = {
    footyKey : 'Your API-Football key',
    weatherKey : 'Your OpenWeather API key'
}
```
5. Everything should be up and running!

## Sample Images

#### Weather in current location
<img width="1440" alt="Current location" src="https://user-images.githubusercontent.com/90576219/216737857-4b5d41c6-4099-46c9-ac6f-b8f3cd132b02.png">

#### Weather in a searched location
<img width="1439" alt="Searched location" src="https://user-images.githubusercontent.com/90576219/216737869-6990d143-b276-419d-9125-4b143cfe08cb.png">

#### Loading screen
<img width="1440" alt="Loading page" src="https://user-images.githubusercontent.com/90576219/216737969-f2a9f8a6-3205-4e5e-a168-bc50e3b86b7e.png">

## License
Distributed under the MIT License. See ```LICENSE``` for more information
