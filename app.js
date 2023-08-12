"use strict";

const monthsOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const locationElement = document.querySelector(".location");
const weatherElement = document.querySelector(".weather");
const timeElement = document.querySelector(".time");
const imageElement = document.querySelector(".coat-of-arms");
const dateElement = document.querySelector(".date");

const stringImprover = (str) =>
  `${str.slice(0, 1).toUpperCase()}${str.slice(1).toLowerCase().trim()}`;

const errorHandling = function () {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-container");
  errorMessage.innerHTML = `
  <p class="error-message">Oops! Something went wrong.</p>
`;
  document.body.appendChild(errorMessage);
};

const getCoordinates = function () {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported.");
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        let output = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        resolve(output);
      },
      function (error) {
        reject("Error getting coordinates: " + error.message);
      }
    );
  });
};

const reverseGeocoding = async function () {
  try {
    const datas = await getCoordinates();

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${datas.lat}&lon=${datas.lng}&format=json`
    );

    const data = await response.json();
    const markup = `<p class="location-text">${data.address.country}, ${data.address.province}, ${data.address.town}</p>`;
    locationElement.insertAdjacentHTML("afterbegin", markup);
    return data;
  } catch {
    errorHandling();
  }
};

const weatherFinding = async function () {
  try {
    const API_KEY = "9efee5ba073ff10bc440f780eec357ad";
    const datas = await getCoordinates();
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${datas.lat}&lon=${datas.lng}&appid=${API_KEY}`
    );
    const data = await response.json();
    const icon_id = data.weather[0].icon;
    const markup = `
  <ul class="weather-list">
    <li><p class="weather-information">${stringImprover(
      data.weather[0].main
    )}, ${stringImprover(data.weather[0].description)}</p></li>
    <li><p class="temperature-information">${stringImprover(
      "temperature is"
    )} ${(+data.main.temp - 272.15).toFixed()} C°</p></li>
    <li><p class="weather-pressure">${stringImprover("feels like")} ${(
      +data.main.feels_like - 272.15
    ).toFixed()} C°
    </ul>
<img src="https://openweathermap.org/img/wn/${icon_id}@4x.png" alt="${icon_id}" class="weather-img">
`;
    weatherElement.insertAdjacentHTML("beforebegin", markup);
  } catch {
    errorHandling();
  }
};

const timeFunctionalities = function () {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const month = monthsOfYear[monthIndex];
  const year = date.getFullYear();
  const markupDate = `${day}, ${month}, ${year}`;
  const markupTime = `${hour} : ${minute}`;
  const bodyElement = document.querySelector("body");
  if ((hour >= 21 && hour <= 23) || (hour >= 0 && hour <= 6))
    bodyElement.style.background = "linear-gradient(#2f96a3, #303e8f)";
  timeElement.insertAdjacentText("beforebegin", markupTime);
  dateElement.insertAdjacentText("beforebegin", markupDate);
};

const getCountryFLag = async function () {
  try {
    const datas = await reverseGeocoding();
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${datas.address.country_code}`
    );
    const [data] = await response.json();
    imageElement.src = data.coatOfArms.svg;
  } catch (err) {
    errorHandling();
  }
};

weatherFinding();
timeFunctionalities();
getCountryFLag();
