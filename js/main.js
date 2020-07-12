'use strict';

(function () {
  var map = document.querySelector('.map');
  var before = document.querySelector('.map__filters-container');
  var mainPin = document.querySelector('.map__pin--main');
  var bookingForm = document.documentElement.querySelector('.ad-form');
  var mapSection = document.querySelector('.map__pins');
  var tegMain = document.querySelector("main");
  var cleanForm = document.querySelector(".ad-form__reset")


  var MAIN_PIN_ARROW_HEIGHT = 87;
  var AMOUNT_OF_SHOWED_PINS = 5;

  var bookingFormFieldsets = bookingForm.querySelectorAll('fieldset');
  var addressInput = bookingForm.querySelector('#address');
  var parentDiv = before.parentNode;

  var startCoords = {
    x: null,
    y: null,
  };

  var dragLimits = {
    X: {
      MIN: 0,
      MAX: mapSection.offsetWidth
    },
    Y: {
      MIN: 230,
      MAX: 630
    }
  };

  var Border = {
    TOP: dragLimits.Y.MIN - MAIN_PIN_ARROW_HEIGHT,
    BOTTOM: dragLimits.Y.MAX - MAIN_PIN_ARROW_HEIGHT,
    LEFT: dragLimits.X.MIN,
    RIGHT: dragLimits.X.MAX - mainPin.offsetWidth
  };

  function onMouseMove(event) {
    event.preventDefault();

    var shift = {
      x: startCoords.x - event.clientX,
      y: startCoords.y - event.clientY
    };

    var mainPinPosition = {
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y
    };

    startCoords = {
      x: event.clientX,
      y: event.clientY
    };


    if (mainPinPosition.x >= Border.LEFT && mainPinPosition.x <= Border.RIGHT) {
      mainPin.style.left = mainPinPosition.x + 'px';
    }
    if (mainPinPosition.y >= Border.TOP && mainPinPosition.y <= Border.BOTTOM) {
      mainPin.style.top = mainPinPosition.y + 'px';
    }
  }

  function onMouseUp(event) {
    event.preventDefault();

    if (map.className === "map map--faded") {
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
    for (var fieldset of bookingFormFieldsets) {
      fieldset.setAttribute('disabled', 'disabled');
    }

    var mapPins = document.querySelectorAll(".map__pin:not(.map__pin--main)");
    for (var mapPin of mapPins) {
      mapPin.classList.add('hidden');
    }

    window.form.cleanForm();

    var coords = window.pin.getMainPinCenterCoordinates();
    addressInput.value = 'x: ' + coords.x + ', y: ' + coords.y;

    // при нажатии на главный пин, активируем страницу
    mainPin.addEventListener('mousedown', function (event) {
      if (event.which === 1) {
        event.preventDefault();

        startCoords = {
          x: event.clientX,
          y: event.clientY
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        cleanForm.addEventListener('click', function (event) {
          event.preventDefault();
          window.form.cleanForm();
        });
      }
    });
    mainPin.addEventListener('keydown', mainPinKeydownHandler);
  }

  function activatePage() {
    // отобразила карту
    map.classList.remove('map--faded');
    // отобразила форму
    bookingForm.classList.remove('ad-form--disabled');
    for (var fieldset of bookingFormFieldsets) {
      fieldset.removeAttribute('disabled');
    }

    var mapPins = document.querySelectorAll(".map__pin:not(.map__pin--main)");
    for (var mapPin of mapPins) {
      mapPin.classList.remove('hidden');
    }

    var coords = window.pin.getMainPinArrowCoordinates();
    addressInput.value = 'x: ' + coords.x + ', y: ' + coords.y;

    if (mapSection.children.length < 3) {
      window.load(function (hotels) {
          window.filters.successHandler(hotels);
          mapSection.appendChild(window.pin.createPins(hotels));
          parentDiv.insertBefore(window.card.createCards(hotels), before);
          window.card.hideCards();
          window.filters.hideExtraPins()
        },
        function () {});
    }
    window.form.activateForm();
    mapSection.addEventListener('click', window.card.showCard);
    mainPin.removeEventListener('keydown', mainPinKeydownHandler);
    window.filters.filterHotelTypes()

    onSubmit();
  }

  function mainPinKeydownHandler(event) {
    if (event.key === 'Enter') {
      activatePage();
    }
  }



  function successNoticenKeydownHandler(event) {
    if (event.key === 'Escape') {
      if (document.querySelector(".success")) {
        document.querySelector(".success").classList.add('hidden')
      }
    }
  }

  function errorNoticenKeydownHandler(event) {
    if (event.key === 'Escape') {
      if (document.querySelector(".error")) {
        document.querySelector(".error").classList.add('hidden')
      }
    }
  }

  function showSuccessNotice() {
    if (document.querySelector(".success") === null) {
      var fragment = document.createDocumentFragment();
      var sucNotice = document.querySelector("#success").content.cloneNode(true);
      fragment.appendChild(sucNotice);
      return fragment;
    }
  }

  function hideSuccessNotice() {
    document.querySelector(".success").classList.remove('hidden');
    document.querySelector(".success").addEventListener('click', function () {
      document.querySelector(".success").classList.add('hidden')
    })
  }

  function showErrorNotice() {
    if (document.querySelector(".error") === null) {
      var fragment = document.createDocumentFragment();
      var erNotice = document.querySelector("#error").content.cloneNode(true);
      fragment.appendChild(erNotice);
      return fragment;
    }
  }

  function hideErrorNotice() {
    document.querySelector(".error__button").addEventListener('click', function () {
      document.querySelector(".error").classList.add('hidden');
      window.form.cleanForm();
    })
  }

  function onSubmit() {
    bookingForm.addEventListener('submit', function (evt) {
      window.upload(new FormData(bookingForm), function (data) {
        onSuccess(data);
        if (!tegMain.querySelector(".success")) {
          tegMain.appendChild(showSuccessNotice());
          document.querySelector("body").addEventListener('keydown', successNoticenKeydownHandler);
        }
        hideSuccessNotice();
        deactivatePage();
      }, function (data) {
        onError(data);
        document.querySelector(".success").classList.add('hidden')
        if (!tegMain.querySelector(".error")) {
          tegMain.appendChild(showErrorNotice());
        }
        hideErrorNotice();
        activatePage()
      });
      evt.preventDefault();

      document.querySelector("body").addEventListener('keydown', errorNoticenKeydownHandler);
    })
  }




  function onSuccess(data) {
    console.log(data);
  };

  var onError = function (message) {
    console.error(message);
  };

  deactivatePage();
})();
