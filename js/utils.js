'use strict';

(function () {

  window.utils = {
    PIN_IMG_WIDTH: 40,
    PIN_IMG_HEIGHT: 40,
    PHOTO_IMG_WIDTH: 45,
    PHOTO_IMG_HEIGHT: 40,
    MAIN_PIN_ARROW_HEIGHT: 87,

    map: document.documentElement.querySelector('.map'),
    mapPins: document.querySelector('.map__pins'),
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
