'use strict';

(function () {

  var bookingFormFieldsets = bookingForm.querySelectorAll('fieldset');
  var addressInput = bookingForm.querySelector('#address');
  var parentDiv = before.parentNode;
  var map = document.documentElement.querySelector('.map');
  var mapSection = document.querySelector('.map__pins');
  var before = document.querySelector('.map__filters-container');
  var mainPin = document.querySelector('.map__pin--main');
  var bookingForm = document.documentElement.querySelector('.ad-form');
  var typeSelect = document.querySelector('#type');
  var roomNumberSelect = document.querySelector('#room_number');


  function deactivatePage() {

    map.classList.add('map--faded');
    bookingForm.classList.add('ad-form--disabled');

    bookingFormFieldsets.forEach(function (fieldset) {
      fieldset.setAttribute('disabled', 'disabled');
    });

    var coords = window.pin.getMainPinCenterCoordinates();
    addressInput.value = 'x: ' + coords.x + ', y: ' + coords.y;

    mainPinClick();
    mainPin.addEventListener('keydown', mainPinEnterPress);
  }

  function activatePage() {
    map.classList.remove('map--faded');
    bookingForm.classList.remove('ad-form--disabled');

    bookingFormFieldsets.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });

    var coords = window.pin.getMainPinArrowCoordinates();
    addressInput.value = 'x: ' + coords.x + ', y: ' + coords.y;

    window.form.setPriceRestrictions();
    window.form.validateGuestsLimit();

    var hotels = window.data.generateHotels(7);
    mapSection.appendChild(window.pin.createPins(hotels));
    parentDiv.insertBefore(window.card.createCards(hotels), before);
    window.card.hideCards();

    typeSelect.addEventListener('change', window.form.setPriceRestrictions);
    roomNumberSelect.addEventListener('change', window.form.validateGuestsLimit);

    mapSection.addEventListener('click', window.card.showCard);

    mainPin.removeEventListener('mousedown', mainPinClick);
    mainPin.removeEventListener('keydown', mainPinEnterPress);

    window.syncTimes.syncCheckinTimes();
  }

  function mainPinClick() {
    mainPin.addEventListener('mousedown', function (event) {
      if (event.which === 1) {
        event.preventDefault();

        var startCoords = {
          x: event.clientX,
          y: event.clientY
        };

        var onMouseMove = function (moveEvt) {
          moveEvt.preventDefault();

          var shift = {
            x: startCoords.x - moveEvt.clientX,
            y: startCoords.y - moveEvt.clientY
          };

          var mainPinPosition = {
            x: mainPin.offsetLeft - shift.x,
            y: mainPin.offsetTop - shift.y
          };

          startCoords = {
            x: moveEvt.clientX,
            y: moveEvt.clientY
          };

          var DragLimit = {
            X: {
              MIN: 0,
              MAX: mainPin.parentNode.offsetWidth
            },
            Y: {
              MIN: 230,
              MAX: 630
            }
          };

          var Border = {
            TOP: DragLimit.Y.MIN - window.utils.MAIN_PIN_ARROW_HEIGHT,
            BOTTOM: DragLimit.Y.MAX - window.utils.MAIN_PIN_ARROW_HEIGHT,
            LEFT: DragLimit.X.MIN,
            RIGHT: DragLimit.X.MAX - mainPin.offsetWidth
          };
          if (mainPinPosition.x >= Border.LEFT && mainPinPosition.x <= Border.RIGHT) {
            mainPin.style.left = mainPinPosition.x + 'px';
          }
          if (mainPinPosition.y >= Border.TOP && mainPinPosition.y <= Border.BOTTOM) {
            mainPin.style.top = mainPinPosition.y + 'px';
          }

        };
        var onMouseUp = function (upEvt) {
          upEvt.preventDefault();

          if (map.className === 'map map--faded') {
            activatePage();
          }


          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }
    });
  }

  function mainPinEnterPress(event) {
    if (event.key === 'Enter') {
      activatePage();
    }
  }
  deactivatePage();
})();
