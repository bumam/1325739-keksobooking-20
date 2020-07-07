'use strict';

(function () {

  window.utils = {
    map: document.documentElement.querySelector('.map'),
    mapSection: document.querySelector('.map__pins'),
    cardTemplate: document.querySelector('#card').content,
    before: document.querySelector('.map__filters-container'),
    mainPin: document.querySelector('.map__pin--main'),
    bookingForm: document.documentElement.querySelector('.ad-form'),
    typeSelect: document.querySelector('#type'),
    roomNumberSelect: document.querySelector('#room_number'),

    getRandomNumber: function (min, max) {
      return min + Math.floor(Math.random() * (max - min));
    }
  };
})();
