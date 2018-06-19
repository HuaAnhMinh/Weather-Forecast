'use strict';

var UIController = function () {
  var DOMStrings = {
    header: 'header_1',
    input: '.input_location',
    inputBtn: '.button_search'
  };

  return {
    displayWeather: function displayWeather(weather, city, id) {
      document.getElementById(DOMStrings.header).innerHTML = 'Weather Forecast for ' + city;

      document.getElementById('icon_weather').src = 'https://www.metaweather.com/static/img/weather/png/' + weather.weather_state_abbr + '.png';
      document.getElementById('current_date').innerHTML = '' + weather.applicable_date;
      document.getElementById('woeid').innerHTML = id;
      document.getElementById('weather_type').innerHTML = weather.weather_state_name;
      document.getElementById('min_temp').innerHTML = Math.round(weather.min_temp);
      document.getElementById('max_temp').innerHTML = Math.round(weather.max_temp);
      document.getElementById('humidity').innerHTML = Math.round(weather.humidity);
      document.getElementById('wind_speed').innerHTML = Math.round(weather.wind_speed);
    },

    InvalidCityMessage: function InvalidCityMessage(message) {
      alert(message);
      document.querySelector(DOMStrings.input).value = '';
    },

    getDOMStrings: function getDOMStrings() {
      return DOMStrings;
    },

    getInput: function getInput() {
      return document.querySelector(DOMStrings.input).value;
    },

    waitingMessage: function waitingMessage() {
      document.getElementById(DOMStrings.header).innerHTML = 'Please wait...';
    },

    clearInput: function clearInput() {
      document.querySelector(DOMStrings.input).value = '';
      document.querySelector(DOMStrings.input).focus();
    }
  };
}();

var BackgroundTask = function (UICtrl) {
  var listCities = [1252431, 2459115, 2459115, 2487956, 1236594, 1062617];

  var keyWordForCities = ['Ho Chi Minh', 'New York', 'London', 'San Francisco', 'Ha Noi', 'Singapore'];

  return {
    getListCities: function getListCities() {
      return listCities;
    },

    getKeyWordForCities: function getKeyWordForCities() {
      return keyWordForCities;
    },

    getWeather: function getWeather(cityCode, city) {
      var url = 'https://cors.io/?https://www.metaweather.com/api/location/' + cityCode + '/';
      fetch(url).then(function (result) {
        return result.json();
      }).then(function (data) {
        var today = data.consolidated_weather[0];
        console.log(today);
        UICtrl.displayWeather(today, city, cityCode);
      }).catch(function (error) {
        console.log(error);
        return false;
      });
    }
  };
}(UIController);

var controller = function (taskCtrl, UICtrl) {
  var setUpEventListener = function setUpEventListener() {
    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlSearchCity);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlSearchCity();
      }
    });
  };

  var ctrlSearchCity = function ctrlSearchCity() {
    var input = UICtrl.getInput();
    var getWeather = void 0;

    var getKeyCities = taskCtrl.getKeyWordForCities();
    var cityCode = taskCtrl.getListCities()[getKeyCities.indexOf(input)];
    if (cityCode === undefined) {
      UICtrl.InvalidCityMessage('Invalid City. Please try again');
    } else {
      taskCtrl.getWeather(cityCode, input);
      UICtrl.waitingMessage();
      UICtrl.clearInput();
    }
  };

  return {
    init: function init() {
      console.log("This app is running...");
      document.querySelector(UICtrl.getDOMStrings().input).focus();
      setUpEventListener();
    }
  };
}(BackgroundTask, UIController);

controller.init();
