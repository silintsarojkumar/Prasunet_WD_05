const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-wether");
const wetherCardDiv = document.querySelector(".wether-cards");
const API_KEY ="993e41354632e44530065345d7ee12db";
const createWeatherCard=(cityName,weatherItem,index)=>{
    if(index===0){
        return `<div class="current-wether">
                <div class="details">
                    <h3>${cityName} ${weatherItem.dt_txt.split(" ")[0]}</h3>
                    <h6>Temperature:${(weatherItem.main.temp -273.15).toFixed(2)}°C</h6>
                    <h6>Wind:${weatherItem.wind.speed} M/s</h6>
                    <h6>Humidity:${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>
            </div>`;

    } else{
        return `<li class="card">    
        <h5>(${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
        <h6>Temp:${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
        <h6>Wind:${weatherItem.wind.speed} M/s</h4>
        <h6>Humidity:${weatherItem.main.humidity}%</h4>
        </li>`;

    }
   

}
const getWeatherDetails = ( cityName,lat,lon)=>{
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=993e41354632e44530065345d7ee12db`;
    fetch(WEATHER_API_URL).then(res => res.json()).then(data =>{
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
               return uniqueForecastDays.push(forecastDate);

            }            
        });
        cityInput.value="";
        wetherCardDiv.innerHTML="";
        currentWeatherDiv.innerHTML="";

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem,index) =>{
            if(index===0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem,index));

            }else{
            wetherCardDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem,index));}
        })
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!")

    });
}


const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=993e41354632e44530065345d7ee12db`;


    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const {name,lat,lon}=data[0];
        getWeatherDetails( name,lat,lon);
    }).catch(()=>{
        alert("An error occurred while fetching the coordinates")
    })
}
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const {latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=993e41354632e44530065345d7ee12db`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const {name}=data[0];
                getWeatherDetails( name,latitude,longitude);
                
                
            }).catch(()=>{
                alert("An error occurred while fetching the city")
            })

        },
        error => {
            if(error.code === error.PERMISSION_DENIED){
                alert("your location was denied")
            }
        }
    );

}


searchButton.addEventListener("click",getCityCoordinates);
locationButton.addEventListener("click",getUserCoordinates);
