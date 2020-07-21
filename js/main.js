'use strict';

(function () {
  var map = document.querySelector('.map');
  var before = document.querySelector('.map__filters-container');
  var mainPin = document.querySelector('.map__pin--main');
  var bookingForm = document.querySelector('.ad-form');
  var mapSection = document.querySelector('.map__pins');
  var tegMain = document.querySelector('main');
  var cleanForm = document.querySelector('.ad-form__reset');
  var filtersBlock = document.querySelector('.map__filters');
  var selectFilters = filtersBlock.querySelectorAll('.map__filter');
  var inputFilters = filtersBlock.querySelectorAll('.map__features input');

  var TAIL_HEIGHT = 13;

  var MAX_SIMILAR_PINS_AMOUNT = 5;

  var bookingFormFieldsets = bookingForm.querySelectorAll('fieldset');
  var addressInput = bookingForm.querySelector('#address');
  var parentDiv = before.parentNode;
  var hotels = [];

  var startCoords = {
    x: null,
    y: null,
  };

  var dragLimits = {
    X: {
      MIN: 0,
      MAX: mapSection.offsetWidth,
    },
    Y: {
      MIN: 130,
      MAX: 630,
    },
  };

  var Border = {
    TOP: dragLimits.Y.MIN - mainPin.offsetHeight - TAIL_HEIGHT,
    BOTTOM: dragLimits.Y.MAX - mainPin.offsetHeight - TAIL_HEIGHT,
    LEFT: dragLimits.X.MIN - mainPin.offsetWidth / 2,
    RIGHT: dragLimits.X.MAX - mainPin.offsetWidth / 2,
  };

  function onMouseMove(evt) {
    evt.preventDefault();
    var shift = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY,
    };

    var mainPinPosition = {
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y,
    };

    startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    if (mainPinPosition.x >= Border.LEFT && mainPinPosition.x <= Border.RIGHT) {
      mainPin.style.left = mainPinPosition.x + 'px';
    }
    if (mainPinPosition.y >= Border.TOP && mainPinPosition.y <= Border.BOTTOM) {
      mainPin.style.top = mainPinPosition.y + 'px';
    }

  }

  function getRightCoordsDeactive() {
    var coords = window.pin.getCenterCoordinates();
    addressInput.value = coords.x + ', ' + coords.y;
  }

  function getRightCoordsActive() {
    var coords = window.pin.getArrowCoordinates();
    addressInput.value = coords.x + ', ' + coords.y;
  }


  function onMouseUp(evt) {
    evt.preventDefault();
    if (map.className === 'map map--faded') {
      activatePage();
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function deactivatePage() {
    // скрывает карту
    map.classList.add('map--faded');
    // блокирует форму
    bookingForm.classList.add('ad-form--disabled');
    bookingFormFieldsets.forEach(function (element) {
      element.setAttribute('disabled', 'disabled');
    });

    window.card.remove();
    window.filter.removePins();

    window.form.clean();
    getRightCoordsDeactive();

    // при нажатии на главный пин, активируем страницу
    mainPin.addEventListener('mousedown', function (evt) {
      if (evt.which === 1) {
        evt.preventDefault();

        startCoords = {
          x: evt.clientX,
          y: evt.clientY,
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mousemove', getRightCoordsDeactive);
        document.addEventListener('mouseup', onMouseUp);
      }
    });
    mainPin.addEventListener('keydown', mainPinKeydownHandler);

    cleanForm.removeEventListener('click', function (evt) {
      evt.preventDefault();
      deactivatePage();
    });
  }

  function activatePage() {
    // отобразила карту
    map.classList.remove('map--faded');
    // отобразила форму
    bookingForm.classList.remove('ad-form--disabled');
    bookingFormFieldsets.forEach(function (element) {
      element.removeAttribute('disabled');
    });


    if (mapSection.children.length < 3) {
      window.load('https://javascript.pages.academy/keksobooking/data', function (data) {
        for (var i = 0; i < Math.min(data.length, MAX_SIMILAR_PINS_AMOUNT); i++) {
          mapSection.appendChild(window.pin.create(data[i]));
        }
        setPinId();

        window.card.remove();
        getHotels(data);
      });
    }
    window.form.activate();
    mapSection.addEventListener('click', showCard);
    mainPin.removeEventListener('keydown', mainPinKeydownHandler);
    document.addEventListener('mousemove', getRightCoordsActive);

    onSubmit();

    cleanForm.addEventListener('click', function (evt) {
      evt.preventDefault();
      deactivatePage();
    });

    initFilter();
  }

  function getHotels(data) {
    hotels = data.slice();
    return hotels;
  }

  function initFilter() {
    selectFilters.forEach(function (element) {
      element.addEventListener('change', function () {
        window.debounce(updateOffers);
      });
    });

    inputFilters.forEach(function (element) {
      element.addEventListener('change', function () {
        window.debounce(updateOffers);
      });
    });
  }

  function updateOffers() {
    var filteredAdvertisement = hotels.filter(window.filter.filterAdvertisement);
    window.filter.removePins();
    window.card.remove();

    for (var i = 0; i < Math.min(filteredAdvertisement.length, MAX_SIMILAR_PINS_AMOUNT); i++) {
      mapSection.appendChild(window.pin.create(filteredAdvertisement[i]));
    }
    setPinId();
  }

  function setPinId() {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (item, j) {
      item.querySelector('img').dataset.pinId = j;
    });
  }

  function showCard(evt) {
    var filteredAdvertisement = hotels.filter(window.filter.filterAdvertisement);
    window.card.remove();
    if (evt.target.dataset.pinId !== undefined) {
      window.pin.remove();
      evt.target.classList.add('map__pin--active');
      parentDiv.insertBefore(window.card.create(filteredAdvertisement[evt.target.dataset.pinId]), before);
      map.addEventListener('click', window.card.closeOffer);
      document.addEventListener('keydown', window.card.closeOffer);
    }
  }

  function mainPinKeydownHandler(evt) {
    if (evt.key === 'Enter') {
      activatePage();
    }
  }

  function successNoticenKeydownHandler(evt) {
    if (evt.key === 'Escape') {
      if (document.querySelector('.success')) {
        document.querySelector('.success').classList.add('hidden');
      }
    }
  }

  function errorNoticenKeydownHandler(evt) {
    if (evt.key === 'Escape') {
      if (document.querySelector('.error')) {
        document.querySelector('.error').classList.add('hidden');
      }
    }
  }

  function showSuccessNotice() {
    if (document.querySelector('.success') === null) {
      var fragment = document.createDocumentFragment();
      var sucNotice = document.querySelector('#success').content.cloneNode(true);
      fragment.appendChild(sucNotice);
      return fragment;
    }
    return fragment;
  }

  function hideSuccessNotice() {
    document.querySelector('.success').classList.remove('hidden');
    document.querySelector('.success').addEventListener('click', function () {
      document.querySelector('.success').classList.add('hidden');
    });
  }

  function showErrorNotice() {
    if (document.querySelector('.error') === null) {
      var fragment = document.createDocumentFragment();
      var erNotice = document.querySelector('#error').content.cloneNode(true);
      fragment.appendChild(erNotice);
      return fragment;
    }
    return fragment;
  }

  function hideErrorNotice() {
    document.querySelector('.error__button').addEventListener('click', function () {
      document.querySelector('.error').classList.add('hidden');
      window.form.clean();
    });
  }

  function onSubmit() {
    bookingForm.addEventListener('submit', function (evt) {
      window.upload('https://javascript.pages.academy/keksobooking', new FormData(bookingForm), function () {
        if (!tegMain.querySelector('.success')) {
          tegMain.appendChild(showSuccessNotice());
          document.querySelector('body').addEventListener('keydown', successNoticenKeydownHandler);
        }
        hideSuccessNotice();
        deactivatePage();
      }, function () {
        document.querySelector('.success').classList.add('hidden');
        if (!tegMain.querySelector('.error')) {
          tegMain.appendChild(showErrorNotice());
        }
        hideErrorNotice();
        activatePage();
      });
      evt.preventDefault();

      document.querySelector('body').addEventListener('keydown', errorNoticenKeydownHandler);
    });
  }
  deactivatePage();
})();
