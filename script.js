const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(() => {
    const time = new Date(); //creation of a new class
    const month = time.getMonth(); 
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hour12 = hour >= 13 ? hour %12: hour //converting 24 hr format to 12 hr format
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM' // to display am/pm dynamically

    timeEl.innerHTML = (hour12 < 10? '0'+hour12 : hour12) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month] // displaying date from the date object method 

}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => { // to get latitude and longitude(current poition of the device)
        let latitude = success.coords.latitude;
        let longitude = success.coords.longitude;
        // API call
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        showWeatherData(data);
        console.log(data);
        })

    })
}

function showWeatherData (data){ 
    let {humidity, feels_like, visibility,uvi, wind_speed} = data.current;
    
    timezone.innerHTML = data.timezone;

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div id='dummy1'>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div id='dummy2'>Feels Like</div>
        <div>${feels_like}&#176;</div>
    </div>
    <div class="weather-item">
        <div id='dummy3'>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div id='dummy4'>Visibility</div>
        <div>${visibility}</div>
    </div>
    <div class="weather-item">
        <div id='dummy5'>UV Index</div>
        <div>${uvi}</div>
    </div>
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night} &#176; C</div>
                <div class="temp">Day - ${day.temp.day} &#176; C</div>
            </div>
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night} &#176; C</div>
                <div class="temp">Day - ${day.temp.day} &#176; C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}