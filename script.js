const GOOGLE_API_KEY = 'AIzaSyABHOJzsSs_F-Xh6M9zRlmZ07ugXEoZ9Tc';
const API_KEY = '3c6aa129d7ef1458478bb217cc1e9a0b';

const fetchDataBtn = document.getElementById('fetchButton');
fetchDataBtn.addEventListener('click', fetchData);

function fetchData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    document.getElementById('latitude').textContent = `Lat: ${lat.toFixed(4)}`;
    document.getElementById('longitude').textContent = `Long: ${lon.toFixed(4)}`;

    displayMap(lat, lon);
    fetchWeather(lat, lon);

    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('weatherContent').style.display = 'block';
}

function showError(error) {
    let errorMessage;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred.";
            break;
    }
    alert(errorMessage);
}

function displayMap(lat, lon) {
    const mapDiv = document.getElementById('map');
    mapDiv.innerHTML = `<iframe width="100%" height="300" frameborder="0" style="border:0" 
        src="https://www.google.com/maps/embed/v1/place?q=${lat},${lon}&key=${GOOGLE_API_KEY}"></iframe>`;
}

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weatherData');

    const weatherItems = [
        { label: 'Location:', value: data.name },
        { label: 'Wind Speed:', value: `${data.wind.speed} km/h` },
        { label: 'Pressure:', value: `${data.main.pressure} atm` },
        { label: 'Humidity:', value: `${data.main.humidity}%` },
        { label: 'Feels Like:', value: `${data.main.feels_like.toFixed(1)}°C` },
        { label: 'Wind Direction:', value: `${data.wind.deg}°` },

    ];

    weatherDiv.innerHTML = weatherItems.map(item => `
        <div class="weather-item">
            <h4>${item.label}</h4>
            <p>${item.value}</p>
        </div>
    `).join('');
}