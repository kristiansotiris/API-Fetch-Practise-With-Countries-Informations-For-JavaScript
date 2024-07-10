'use strict';

const btn_country = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');


const renderCountry = function (countryData, className = '') {
    const html = `
    <article class="country ${className}">
        <img class="country__img" src="${countryData.flags.svg}" />
        <div class="country__data">
            <h3 class="country__name">${countryData.name.common}</h3>
            <h4 class="country__region">${countryData.region}</h4>
            <p class="country__row"><span>👫</span>${(countryData.population / 1e6).toFixed(1)} million people</p>
            <p class="country__row"><span>🗣️</span>${Object.values(countryData.languages).join(', ')}</p>
            <p class="country__row"><span>💰</span>${Object.values(countryData.currencies).map(curr => curr.name).join(', ')}</p>
        </div>
    </article>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;

    setTimeout(() => {
        countriesContainer.innerHTML = '';
        countriesContainer.style.opacity = 0;
    }, 15000);
}

const getCountryData = function(country) {
    const fetchPromise = new XMLHttpRequest();
    fetchPromise.open('GET', `https://restcountries.com/v3.1/name/${country}`);
    fetchPromise.send();

    fetchPromise.addEventListener('load', () => {
        const response = JSON.parse(fetchPromise.responseText);
        const countryData = response[0];
        console.log(response);

        const html = `
            <article class="country">
                <img class="country__img" src="${countryData.flags.svg}" />
                <div class="country__data">
                    <h3 class="country__name">${countryData.name.common}</h3>
                    <h4 class="country__region">${countryData.region}</h4>
                    <p class="country__row"><span>👫</span>${(countryData.population / 1e6).toFixed(1)} million people</p>
                    <p class="country__row"><span>🗣️</span>${Object.values(countryData.languages).join(', ')}</p>
                    <p class="country__row"><span>💰</span>${Object.values(countryData.currencies).map(curr => curr.name).join(', ')}</p>
                </div>
            </article>`;
    
        // countriesContainer.innerHTML = html;
        countriesContainer.insertAdjacentHTML('beforeend', html);
        countriesContainer.style.opacity = 1;
    });

    fetchPromise.addEventListener('error', () => {
        console.error('Failed to fetch data');
    });
};

btn_country.addEventListener('click', (e) => {
    e.preventDefault();
    const countryName = prompt('Enter the name of a country:');
    if (countryName) {
        getCountryAndNeighbor(countryName);
    }
    else{
        alert('Please enter a country name.');
        countriesContainer.innerHTML = '';
    }
});


const getCountryAndNeighbor = function (country) {
    const fetchPromise = new XMLHttpRequest();
    fetchPromise.open('GET', `https://restcountries.com/v3.1/name/${country}`);
    fetchPromise.send();

    fetchPromise.addEventListener('load', () => {
        const response = JSON.parse(fetchPromise.responseText);
        const data = response[0];
        console.log(response);
        renderCountry(data);

        // Getting neighboring countries
        const neighbors = data.borders;
        if (neighbors) {
            neighbors.forEach(neighbor => {
                const fetchPromise2 = new XMLHttpRequest();
                fetchPromise2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbor}`);
                fetchPromise2.send();

                fetchPromise2.addEventListener('load', () => {
                    const response2 = JSON.parse(fetchPromise2.responseText);
                    const neighborData = response2[0];
                    console.log(response2);
                    renderCountry(neighborData, 'neighbour');
                });
            });
        } else {
            console.log('No neighbors found');
        }
    });
}

const countryName = prompt('Enter the name of a country:');
if (countryName) {
    getCountryAndNeighbor(countryName);
}
