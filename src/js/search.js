import '@pnotify/core/dist/BrightTheme.css';

import oneCountryQuery from '../templates/countryFind.hbs'
import countryList from '../templates/manyCountries.hbs'

import countrySearch from './fetchCountries.js'
import { alert } from '@pnotify/core/dist/PNotify.js';

const searchForm = document.querySelector('.js-search-form');
const articlesContainer = document.querySelector('.js-articles');

var debounce = require('lodash.debounce');

searchForm.addEventListener('input', debounce(countrySearchInputHandler, 500));

function countrySearchInputHandler(e) {
  e.preventDefault();
  clearArticlesContainer();
   const searchQuery = e.target.value;
  
  countrySearch.fetchCountries(searchQuery).then(data => {
    errorHandler(data)    
  })
  .catch(Error => {
      alert({
          text: "You must enter query parameters!"
      });
      console.log(Error)
  })
}

function errorHandler(data) {

    const specifyAlert = alert({
        text: "Too many matches found. Please enter a more specific query!"
    });
    const notFoundAlert = alert({
          text: "No country has been found. Please enter a more specific query!"
    });
    

   if (data.length > 10) {
        specifyAlert
      } else if (data.status === 404) {
        notFoundAlert
      } else if (data.length === 1) {
          createMarkup(data, oneCountryQuery);
      } else if (data.length <= 10) {
          createMarkup(data, countryList);
      } 
}

function createMarkup(countryes, template) {
  const markup = countryes.map(count => template(count)).join();
  articlesContainer.insertAdjacentHTML('afterbegin', markup)
}

function clearArticlesContainer() {
    articlesContainer.innerHTML = '';
}