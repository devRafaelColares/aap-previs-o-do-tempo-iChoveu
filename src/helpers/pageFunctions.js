import { getWeatherByCity, searchCities } from './weatherAPI';

/**
 * Cria um elemento HTML com as informações passadas
 */
function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
}

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement('span', 'forecast-temp max', `${maxTemp}º`);
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement('span', 'forecast-temp min', `${minTemp}º`);
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
function clearChildrenById(elementId) {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
}

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export function showForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });

  forecastContainer.classList.remove('hidden');
}

/**
 * Recebe um objeto com as informações de uma cidade e retorna um elemento HTML
 */

export function createCityElement(cityInfo) {
  const { name, country, temp, condition, icon, url } = cityInfo;
  const cityElement = createElement('li', 'city');
  const headingElement = createElement('div', 'city-heading');
  const nameElement = createElement('h2', 'city-name', name);
  const countryElement = createElement('p', 'city-country', country);
  headingElement.append(nameElement, countryElement);

  const tempElement = createElement('p', 'city-temp', `${temp}º`);
  const conditionElement = createElement('p', 'city-condition', condition);
  const tempContainer = createElement('div', 'city-temp-container');
  tempContainer.append(conditionElement, tempElement);

  const iconElement = createElement('img', 'condition-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const newButton = createElement('button', 'btn', 'Ver previsão');
  newButton.addEventListener('click', async () => {
    const TOKEN = import.meta.env.VITE_TOKEN;
    const forecastURL = `http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${TOKEN}&q=${url}&days=7`;

    try {
      const data = await (await fetch(forecastURL)).json();
      const formattedForecast = data.forecast.forecastday.map((day) => ({
        date: day.date,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon.replace('64x64', '128x128'),
      }));
      showForecast(formattedForecast);
    } catch (error) {
      window.alert(`Erro ao buscar a previsão: ${error.message}`);
    }
  });

  const infoContainer = createElement('div', 'city-info-container');
  infoContainer.append(tempContainer, iconElement, newButton);

  cityElement.append(headingElement, infoContainer);

  return cityElement;
}

/**
 * Lida com o evento de submit do formulário de busca
 */
export async function handleSearch(event) {
  event.preventDefault();
  clearChildrenById('cities');

  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value;
  const waith = await searchCities(searchValue);
  const dataWaith = await Promise.all(waith.map((city) => getWeatherByCity(city.url)));

  try {
    const cities = document.getElementById('cities');
    cities.innerHTML = '';

    const cityElements = waith.reduce((elements, city, index) => {
      const weather = dataWaith[index];

      const cityInfo = {
        name: city.name,
        country: city.country,
        temp: weather.temp,
        condition: weather.condition,
        icon: weather.icon,
        url: city.url,
      };

      const cityElement = createCityElement(cityInfo);
      elements.push(cityElement);

      return elements;
    }, []);

    cityElements.forEach((element) => {
      cities.appendChild(element);
    });

    console.log(dataWaith);
  } catch (error) {
    console.error(error);
  }
}
