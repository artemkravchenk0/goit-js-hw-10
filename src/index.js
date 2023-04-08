import { Notify } from 'notiflix';
import './css/styles.css';
import fetchCountries from './js/fetch-countries';
import refs from './js/refs';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;


const handleKeyEvent = event => {
    const countryName = event.target.value.trim()

    if (countryName === '') {
        resetHtml()
        return;
    }

    fetchCountries(countryName)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(countryList => {

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
                        <img src="${country.flags.svg}">
                    </span>
                    <span>
                        ${country.name.common}
                    </span>
                </li>`
            }).join('')
        }


        let countryInfoTemplate = ''
        if (countryList.length === 1) {

            const country = countryList[0]

            countryInfoTemplate = `<div>
                <span>Capital:</span>
                <span>${country.capital.join(', ')}</span>
            </div>
            <div>
                <span>Languages:</span>
                <span>${Object.values(country.languages).join(', ')}</span>
            </div>
            <div>
                <span>Population:</span>
                <span>${country.population}</span>
            </div>`
        }

        refs.countryInfoEl.innerHTML = countryInfoTemplate
        refs.countryListEl.innerHTML = countryListHtml
    }).catch(error => {
      Notify.failure('Oops, there is no country with that name')
      resetHtml()
    })
}

const resetHtml = () => {
  refs.countryInfoEl.innerHTML = ''
  refs.countryListEl.innerHTML = ''
}

document.getElementById('search-box').addEventListener('keyup', debounce(handleKeyEvent, DEBOUNCE_DELAY))




