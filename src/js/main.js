// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
// importing api key from config.js
import { apiKey } from './config.js';

// reference elements in an index.html document by their unique ID attribute.
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const weatherIcon = document.getElementById('weatherIcon');
const iconElement = document.createElement("i");
const weatherTemp = document.getElementById("weatherTemp");
const cityName = document.getElementById("cityName");
const weatherMain = document.getElementById("weatherMain");
const weatherTempMax = document.getElementById("weatherTempMax");
const weatherTempMin = document.getElementById("weatherTempMin");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const moreInfo = document.getElementById("moreInfo");
const mainContainer = document.getElementById("mainContainer");
const errorContainer = document.getElementById("errorContainer");
const errorIcon = document.getElementById("errorIcon");
const errorMessage = document.getElementById("errorMessage");

// variables to complete url to fetch data from openweathermap api
let city = null;
let url = null;
const API_KEY = apiKey;

// function to capitalize first letter of city name
function capitalizeFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
// function to convert m/s to km/h
function convertMStoKMH(mps) {
    // Conversion factor for m/s to km/h
    const conversionFactor = 3.6;
  
    // Calculate the conversion
    const kmh = mps * conversionFactor;
  
    // Return the result
    return kmh;
  }
  


searchButton.addEventListener('click',()=>{
    performSearch();
})
searchInput.addEventListener('keyup',(event)=>{
    if(event.key === "Enter"){
        performSearch();
    }
    
})
// function to perform search in openweathermap sever
function performSearch(){
    const searchQuery = searchInput.value;
    console.log('Search query:', searchQuery);
    searchInput.value = '';
    city = searchQuery
    url = "https://api.openweathermap.org/data/2.5/weather?units=metric&" + `q=${city}&appid=${API_KEY}`
    fetchURL();
}
// function to update icon in index.html based on weather condition
function setIcon(iconTag,iconId,class1,class2,class3,class4){
    iconTag.className = class1 + " " + class2 + " " + class3;
    iconId.classList.add(class4);
    iconId.appendChild(iconTag);
}
// function to change a classes name
function changeClassName(classId,oldClassName,newClassName){
    classId.classList.remove(oldClassName);
    classId.classList.add(newClassName);
}
// function that determines condition and displays appropriate icon in index.html
function determineCondition(weatherCondition){
    
    if(weatherCondition == "Clouds"){
        setIcon(iconElement,weatherIcon,"fa-solid","fa-cloud","fa-5x","p-2");
    }else if(weatherCondition == "Clear"){
        setIcon(iconElement,weatherIcon,"fa-solid","fa-sun","fa-5x","p-2");
    }else if(weatherCondition == "Rain" || weatherCondition == "Thunderstorm" ){
        setIcon(iconElement,weatherIcon,"fa-solid","fa-cloud-showers-heavy","fa-5x","p-2");
    }else if(weatherCondition == "Drizzle"){
        setIcon(iconElement,weatherIcon,"fa-solid","fa-cloud-rain","fa-5x","p-2");
    }else if(weatherCondition == "Mist"){
        setIcon(iconElement,weatherIcon,"fa-solid","fa-smog","fa-5x","p-2");
    }else if(weatherCondition == "Snow"){
        setIcon(iconElement,weatherIcon,"fa-solid","fa-snowflake","fa-5x","p-2");
    }
}
// function that performs fetch of data and prints out result in index.html(sucess or error)
function fetchURL(){
    fetch(url).then(resp => resp.json()).then(data =>{
        // variables holding data to be displayed in index.html
        let weatherCondition = data.weather[0].main;
        let mainTemp = Math.round(data.main.temp);
        let cityCondition = data.weather[0].main;
        let tempMax = Math.round(data.main.temp_max);
        let tempMin = Math.round(data.main.temp_min);
        let humidityValue = data.main.humidity;
        let windSpeedValue = data.wind.speed;
       
        // removing error icon/message and displaying weather icon/data
        changeClassName(errorContainer,"p-2","p-0");
        changeClassName(errorMessage,"d-block","d-none");
        changeClassName(mainContainer,"d-none","d-block");
        changeClassName(moreInfo,"d-none","d-flex");
        
        determineCondition(weatherCondition);

        // updating data in index.html
        weatherTemp.textContent = mainTemp + "°";
        cityName.textContent = capitalizeFirstLetter(city);
        weatherMain.textContent = cityCondition;
        weatherTempMax.textContent = "H:" + tempMax + "°";
        weatherTempMin.textContent = "L:" + tempMin + "°";
        humidity.textContent = humidityValue + " %"
        windSpeed.textContent = Math.round(convertMStoKMH(windSpeedValue)) + " km/h";
        
       

    
        
    }).catch(error =>{
        console.error(error);
        //removing weather icon/data and displaying error icon/message
        changeClassName(errorContainer,"p-0","p-2");
        changeClassName(mainContainer,"d-block","d-none");
        changeClassName(errorMessage,"d-none","d-block");
        
        setIcon(iconElement,errorIcon,"fa-solid","fa-triangle-exclamation","fa-7x","p-0");
        
    })
}
