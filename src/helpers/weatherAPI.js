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

    return data;
  } catch (error) {
    console.error('Erro na busca de cidades:', error);
    return [];
  }
};

export const getWeatherByCity = async (URL_CIDADE) => {
  const TOKEN = import.meta.env.VITE_TOKEN;
  const API_URL = `http://api.weatherapi.com/v1/current.json?lang=pt&key=${TOKEN}&q=${URL_CIDADE}`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.length !== 0) {
      return {
        temp: data.current.temp_c,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
      };
    }
  } catch (error) {
    console.error('Erro na obtenção de dados de clima:', error);
    return null;
  }
};
