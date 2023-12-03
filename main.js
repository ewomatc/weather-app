const API_KEY = '26a7a36fb0c93415308af69767c50f15';

const getCurrentWeatherData = async () => {
	const city = 'Lagos';
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
	);
	return response.json();
};

// formatTemperature changes the temp to 1 decimal place and gives it the degree symbol
const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;

const loadCurrentForecast = ({ name, main, weather: [{ description }] }) => {
	const currentForecastElement = document.querySelector('#current-forecast');
	currentForecastElement.querySelector('.city').textContent = name;
	currentForecastElement.querySelector('.temp').textContent = formatTemperature(
		main.temp
	);
	currentForecastElement.querySelector('.description').textContent =
		description;
	currentForecastElement.querySelector(
		'.min-max-temp'
	).textContent = `H: ${formatTemperature(
		main.temp_max
	)} ***** L: ${formatTemperature(main.temp_min)}`;
};

document.addEventListener('DOMContentLoaded', async () => {
	// console.log(await getCurrentWeatherData());
	const currentWeather = await getCurrentWeatherData();
	loadCurrentForecast(currentWeather);
});
