'use strict';

(function () {
  var mapSection = window.utils.mapSection;
  var mainPin = window.utils.mainPin;

  var MAIN_PIN_ARROW_HEIGHT = 87;

  var bookingFormFieldsets = window.utils.bookingForm.querySelectorAll('fieldset');
  var addressInput = window.utils.bookingForm.querySelector('#address');
  var parentDiv = window.utils.before.parentNode;

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

    if (window.utils.map.className === "map map--faded") {
      activatePage();
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }


  function deactivatePage() {
    // скрывает карту
    window.utils.map.classList.add('map--faded');
    // блокирует форму
    window.utils.bookingForm.classList.add('ad-form--disabled');
    for(var fieldset of bookingFormFieldsets) {
      fieldset.setAttribute('disabled', 'disabled');
    }

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
      }
    });
    mainPin.addEventListener('keydown', mainPinKeydownHandler);
  }

  function activatePage() {
    // отобразила карту
    window.utils.map.classList.remove('map--faded');
    // отобразила форму
    window.utils.bookingForm.classList.remove('ad-form--disabled');
    for (var fieldset of bookingFormFieldsets) {
      fieldset.removeAttribute('disabled');
    }

    var coords = window.pin.getMainPinArrowCoordinates();
    addressInput.value = 'x: ' + coords.x + ', y: ' + coords.y;

    // window.form.setPriceRestrictions();
    // window.form.validateGuestsLimit();

    var hotels = window.data.generateHotels(7);

    mapSection.appendChild(window.pin.createPins(hotels));
    parentDiv.insertBefore(window.card.createCards(hotels), window.utils.before);
    window.card.hideCards();

    window.form.activateForm();

    mapSection.addEventListener('click', window.card.showCard);

    // window.utils.mainPin.removeEventListener('mousedown', mainPinClick);
    mainPin.removeEventListener('keydown', mainPinKeydownHandler);
  }

  function mainPinKeydownHandler(event) {
    if (event.key === 'Enter') {
      activatePage();
    }
  }

  deactivatePage();
})();


