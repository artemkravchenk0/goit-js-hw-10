const BASE_URL = 'https://restcountries.com/v3.1/name/'

export default (countryName) => {
  const url = `${BASE_URL}${countryName}?fields=name,capital,population,flags,languages`;
  return fetch(url);
}