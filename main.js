const API_KEY = '26a7a36fb0c93415308af69767c50f15';
const city = 'Lagos';

// Get current weather data block
const getCurrentWeatherData = async () => {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
	);
	return response.json();
};

// Get hourly forecast data
const getHourlyForecastData = async () => {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
	);

	const data = await response.json();

	return data.list.map((forecast) => {
		const {
			main,
			dt,
			dt_txt,
			weather: [{ description, icon }],
		} = forecast;

		return {
			temp: main.temp,
			temp_max: main.temp_max,
			temp_min: main.temp_min,
			dt,
			dt_txt,
			description,
			icon,
		};
	});
};

// formatTemperature changes the temp to 1 decimal place and gives it the degree symbol
const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;

//load current forecast
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

// load hourly forecast
const loadHourlyForecast = (hourlyForecast) => {
	console.log(hourlyForecast);
};

document.addEventListener('DOMContentLoaded', async () => {
	const currentWeather = await getCurrentWeatherData();
	loadCurrentForecast(currentWeather);

	const hourlyForecast = await getHourlyForecastData();
});
