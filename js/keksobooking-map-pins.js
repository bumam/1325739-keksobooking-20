'use strict';

(function () {
  var PIN_IMG_WIDTH = 40;
  var PIN_IMG_HEIGHT = 40;
  var MAIN_PIN_ARROW_HEIGHT = 87;
  var map = document.documentElement.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  function createPins(hotels) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < hotels.length; i++) {
      var pin = document.createElement('button');
      pin.style = 'left: ' + hotels[i].location.x + 'px;' + ' ' + 'top: ' + hotels[i].location.y + 'px;';
      pin.innerHTML = '<img/>';
      pin.querySelector('img').width = PIN_IMG_WIDTH;
      pin.querySelector('img').height = PIN_IMG_HEIGHT;
      pin.querySelector('img').src = hotels[i].author.avatar;
      pin.querySelector('img').alt = hotels[i].offer.type;
      pin.querySelector('img').dataset.pinId = i;
      pin.classList.add('map__pin');

      fragment.appendChild(pin);
    }
    return fragment;
  }

  function removeActivePin() {
    var activePin = map.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  }

  function getMainPinCenterCoordinates() {
    return {
      x: mainPin.offsetLeft + Math.round(mainPin.offsetWidth / 2),
      y: mainPin.offsetTop + Math.round(mainPin.offsetHeight / 2),
    };
  }

  function getMainPinArrowCoordinates() {
    return {
      x: mainPin.offsetLeft + Math.round(mainPin.offsetWidth / 2),
      y: mainPin.offsetTop + MAIN_PIN_ARROW_HEIGHT,
    };
  }

  window.pin = {
    createPins: createPins,
    removeActivePin: removeActivePin,
    getMainPinCenterCoordinates: getMainPinCenterCoordinates,
    getMainPinArrowCoordinates: getMainPinArrowCoordinates,
  };
})();
