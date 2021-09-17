// index.js
require('dotenv').config();
const Mustache = require('mustache');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');

const MUSTACHE_MAIN_DIR = './main.mustache';
/**
  * DATA is the object that contains all
  * the data to be provided to Mustache
  * Notice the "name" and "date" property.
*/
let DATA = {
  name: 'Peter',
  date: new Date().toLocaleDateString('nl-NL', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Amsterdam',
  }),
};

async function setWeatherInformation() {
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Schipluiden&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
  )
  .then(response => response.json())
  .then(response => {
    DATA.city_temperature = Math.round(response.main.temp);
    DATA.city_weather = response.weather[0].description;
    DATA.city_weather_icon = response.weather[0].icon;
    DATA.sun_rise = new Date(response.sys.sunrise * 1000).toLocaleString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Amsterdam',
    });
    DATA.sun_set = new Date(response.sys.sunset * 1000).toLocaleString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Amsterdam',
    });
  });
}

/**
  * A - We open 'main.mustache'
  * B - We ask Mustache to render our file with the data
  * C - We create a README.md file with the generated output
  */
async function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) =>  {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
  /**
   * Fetch Weather
   */
  await setWeatherInformation();

  /**
   * Generate README
   */
  await generateReadMe();

}

action();
