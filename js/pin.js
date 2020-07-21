'use strict';

(function () {
  var PIN_IMG_WIDTH = 40;
  var PIN_IMG_HEIGHT = 40;

  var TAIL_HEIGHT = 13;
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  function create(hotel) {
    var fragment = document.createDocumentFragment();

    var pin = document.createElement('button');
    pin.style = 'left: ' + hotel.location.x + 'px;' + ' ' + 'top: ' + hotel.location.y + 'px;';
    pin.innerHTML = '<img/>';
    pin.querySelector('img').width = PIN_IMG_WIDTH;
    pin.querySelector('img').height = PIN_IMG_HEIGHT;
    pin.querySelector('img').src = hotel.author.avatar;
    pin.querySelector('img').alt = hotel.offer.type;
    pin.classList.add('map__pin');

    fragment.appendChild(pin);

    return fragment;
  }

  function remove() {
    var activePin = map.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  }


  function getCenterCoordinates() {
    return {
      x: mainPin.offsetLeft + Math.round(mainPin.offsetWidth / 2),
      y: mainPin.offsetTop + Math.round(mainPin.offsetHeight / 2),
    };
  }


  function getArrowCoordinates() {
    return {
      x: mainPin.offsetLeft + Math.round(mainPin.offsetWidth / 2),
      y: mainPin.offsetTop + mainPin.offsetWidth + TAIL_HEIGHT,
    };

  }

  window.pin = {
    create: create,
    remove: remove,
    getCenterCoordinates: getCenterCoordinates,
    getArrowCoordinates: getArrowCoordinates,
  };
})();
