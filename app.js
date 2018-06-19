let UIController = (() => {
  let DOMStrings = {
    header: 'header_1',
    input: '.input_location',
    inputBtn: '.button_search'
  };

  return {
    displayWeather: (weather, city, id) => {
      document.getElementById(DOMStrings.header).innerHTML = `Weather Forecast for ${city}`;

      document.getElementById('icon_weather').src = 
        `https://www.metaweather.com/static/img/weather/png/${weather.weather_state_abbr}.png`;
      document.getElementById('current_date').innerHTML = `${weather.applicable_date}`;
      document.getElementById('woeid').innerHTML = id;
      document.getElementById('weather_type').innerHTML = weather.weather_state_name;
      document.getElementById('min_temp').innerHTML = Math.round(weather.min_temp);
      document.getElementById('max_temp').innerHTML = Math.round(weather.max_temp);
      document.getElementById('humidity').innerHTML = Math.round(weather.humidity);
      document.getElementById('wind_speed').innerHTML = Math.round(weather.wind_speed);
    },

    InvalidCityMessage: (message) => {
      alert(message);
      document.querySelector(DOMStrings.input).value = '';
    },

    getDOMStrings: () => {
      return DOMStrings;
    },

    getInput: () => {
      return document.querySelector(DOMStrings.input).value;
    },

    waitingMessage: () => {
      document.getElementById(DOMStrings.header).innerHTML = 'Please wait...';
    },

    clearInput: () => {
      document.querySelector(DOMStrings.input).value = '';
      document.querySelector(DOMStrings.input).focus();
    }
  }
})();

let BackgroundTask = ((UICtrl) => {
  let listCities = [
    1252431,
    2459115,
    2459115,
    2487956,
    1236594,
    1062617
  ];

  let keyWordForCities = [
    'Ho Chi Minh',
    'New York',
    'London',
    'San Francisco',
    'Ha Noi',
    'Singapore'
  ];

  return {
    getListCities: () => {
      return listCities;
    },

    getKeyWordForCities: () => {
      return keyWordForCities;
    },

    getWeather: (cityCode, city) => {
      const url = `https://cors.io/?https://www.metaweather.com/api/location/${cityCode}/`;
      fetch(url)
      .then(result => {
        return result.json();
      })
      .then(data => {
        const today = data.consolidated_weather[0];
        console.log(today);
        UICtrl.displayWeather(today, city, cityCode);
      })
      .catch(error => {
        console.log(error);
        return false;
      })
    }
  }
})(UIController);

let controller = ((taskCtrl, UICtrl) => {
  let setUpEventListener = () => {
    let DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlSearchCity);

    document.addEventListener('keypress', event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlSearchCity();
      }
    });
  }

  let ctrlSearchCity = () => {
    let input = UICtrl.getInput();
    let getWeather;
    
    let getKeyCities = taskCtrl.getKeyWordForCities();
    let cityCode = 
        taskCtrl.getListCities()[getKeyCities.indexOf(input)];
    if (cityCode === undefined) {
      UICtrl.InvalidCityMessage('Invalid City. Please try again');
    }
    else {
      taskCtrl.getWeather(cityCode, input);
      UICtrl.waitingMessage();
      UICtrl.clearInput();
    }
  }

  return {
    init: () => {
      console.log("This app is running...");
      document.querySelector(UICtrl.getDOMStrings().input).focus();
      setUpEventListener();
    }
  }
})(BackgroundTask, UIController);

controller.init();