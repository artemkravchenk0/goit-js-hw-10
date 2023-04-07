import { Notify } from 'notiflix';
import './css/styles.css';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1/name/'
 

const handleKeyEvent = async event => {
    const countryName = event.target.value.trim()

    if (countryName === '') {
        return;
    }

    fetchCountries(countryName).then(countryList => {

        if (!countryList) {
            return;
        }

        let countryListHtml = ''

        if(countryList.length >= 10) {
            Notify.info('Too many matches found. Please enter a more specific name.')
        } else {
            countryListHtml = countryList.map(country => {
                return `<li>
                    <span>
                        <img src="${country.flag}">
                    </span>
                    <span>
                        ${country.name}
                    </span>
                </li>`
            }).join('')
        }
    
    
        let countryInfoTemplate = ''
        if (countryList.length === 1) {
            
            const country = countryList[0]
    
            countryInfoTemplate = `<div>
                <span>Capital:</span>
                <span>${country.capital}</span>
            </div>
            <div>
                <span>Languages:</span>
                <span>${country.languages}</span>
            </div>
            <div>
                <span>Population:</span>
                <span>${country.population}</span>
            </div>`
        }
    
        document.querySelector('.country-info').innerHTML = countryInfoTemplate
        document.querySelector('.country-list').innerHTML = countryListHtml
    })    
}


document.getElementById('search-box').addEventListener('keyup', debounce(handleKeyEvent, DEBOUNCE_DELAY))


const fetchCountries = async (countryName) => {

    const url = `${BASE_URL}${countryName}?fields=name,capital,population,flags,languages`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
              }
              return response.json();
        })
        .then(countriesJson => {
            return countriesJson.map((country) => ({
                name: country.name.common,
                flag: country.flags.svg,
                population: country.population,
                languages: Object.values(country.languages).join(', '),
                capital: country.capital.join(', ')
            }));
        })
        .catch(error => {
            Notify.failure('Oops, there is no country with that name')
        });
}

