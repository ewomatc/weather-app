const API_KEY = '26a7a36fb0c93415308af69767c50f15';
const city = 'Mowe';

const DAYS_OF_THE_WEEK = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

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

const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;
const createIconUrl = (icon) =>
	` https://openweathermap.org/img/wn/${icon}@2x.png`;

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
	const dataFor12Hours = hourlyForecast.slice(1, 13);
	const hourlyContainer = document.querySelector('.hourly-container');

	let innerHTMLString = ``;

	// fetch the details and attach them to innerHTML
	for (let { temp, icon, dt_txt } of dataFor12Hours) {
		innerHTMLString += `<div>
    <h3 class="time">${dt_txt.split(' ')[1]}</h3>
    <img src="${createIconUrl(icon)}" alt="" class="icon" />
    <p class="hourly-temp">${formatTemperature(temp)}</p>
  </div>`;
	}
	hourlyContainer.innerHTML = innerHTMLString;
};

const calculateDayWiseForecast = (hourlyForecast) => {
	let dayWiseForecast = new Map();
	for (let forecast of hourlyForecast) {
		const [date] = forecast.dt_txt.split(' ');
		const dayOfTheWeek = DAYS_OF_THE_WEEK[new Date(date).getDay()];

		if (dayWiseForecast.has(dayOfTheWeek)) {
			let forecastForTheDay = dayWiseForecast.get(dayOfTheWeek);
			forecastForTheDay.push(forecast);
			dayWiseForecast.set(dayOfTheWeek, forecastForTheDay);
		} else {
			dayWiseForecast.set(dayOfTheWeek, [forecast]);
		}

		for (let [key, value] of dayWiseForecast) {
			let temp_min = Math.min(...Array.from(value, (val) => val.temp_min));
			let temp_max = Math.max(...Array.from(value, (val) => val.temp_max));

			dayWiseForecast.set(key, {
				temp_min,
				temp_max,
				icon: value.find((v) => v.icon),
			});
		}
		return dayWiseForecast;
	}
};
// load five day forecast
const loadFiveDayForecast = (hourlyForecast) => {
	const dayWiseForecast = calculateDayWiseForecast(hourlyForecast);
	const container = document.querySelector('.five-day-forecast-container');
	let dayWiseInfo = '';

	Array.from(dayWiseForecast).map(
		([day, { temp_max, temp_min, icon }], index) => {
			dayWiseInfo += `<div class="day-wise-forecast">
    <h3>${index === 0 ? 'today' : day}</h3>
    <img src="${createIconUrl(icon)}" alt="" class="icon" />
    <p class="min-temp">${temp_min}</p>
    <p class="max-temp">${temp_max}</p>
  </div>`;
		}
	);

	container.innerHTML = dayWiseInfo;
};

// load feels like
const loadFeelsLike = ({ main }) => {
	let feelsLikeContainer = document.querySelector('#feels-like');
	feelsLikeContainer.querySelector('.feels-like-temp').textContent =
		formatTemperature(main.feels_like);
};

// load humidity
const loadHumidity = ({ main }) => {
	let humidityContainer = document.querySelector('#humidity');
	humidityContainer.querySelector(
		'.humidity'
	).textContent = `${main.humidity} %`;
};

document.addEventListener('DOMContentLoaded', async () => {
	const currentWeather = await getCurrentWeatherData();
	loadCurrentForecast(currentWeather);

	const hourlyForecast = await getHourlyForecastData();
	loadHourlyForecast(hourlyForecast);
	loadFiveDayForecast(hourlyForecast);

	loadFeelsLike(currentWeather);

	loadHumidity(currentWeather);
});
