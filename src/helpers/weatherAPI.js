export const searchCities = async (term) => {
  const TOKEN = import.meta.env.VITE_TOKEN;
  const API_URL = `http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.length === 0) {
      window.alert('Nenhuma cidade encontrada');
      return [];
    }

    return data.map((city) => ({
      url: city.url,
      name: city.name,
      country: city.country,
    }));
  } catch (error) {
    console.error('Erro na busca de cidades:', error);
    return [];
  }
};

export const getWeatherByCity = async (/* cityURL */) => {

};
