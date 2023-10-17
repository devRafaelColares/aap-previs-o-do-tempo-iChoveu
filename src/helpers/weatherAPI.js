// Remova os comentários a medida que for implementando as funções

export const searchCities = async (TERMO_DE_BUSCA) => {
  const TOKEN = import.meta.env.VITE_TOKEN;
  const API_URL = `http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${TERMO_DE_BUSCA}`;

  try {
    const result = await fetch(API_URL);
    const data = await result.json();
    return data;
  } catch (error) {
    if (data.length === 0) {
      window.alert('Nenhuma cidade encontrada');
      return [];
    }
  }
};
console.log(searchCities('São Paulo'));

export const getWeatherByCity = (/* cityURL */) => {
//   seu código aqui
};
