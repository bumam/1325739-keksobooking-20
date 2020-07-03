'use strict';

(function () {

  var bookingFormFieldsets = window.utils.bookingForm.querySelectorAll('fieldset');
  var addressInput = window.utils.bookingForm.querySelector('#address');
  var parentDiv = window.utils.before.parentNode;

  function deactivatePage() {

    window.utils.map.classList.add('map--faded');
    window.utils.bookingForm.classList.add('ad-form--disabled');

    for (var fieldset of bookingFormFieldsets) {
      fieldset.setAttribute('disabled', 'disabled');
    }

    var coords = window.pin.getMainPinCenterCoordinates();
    addressInput.value = 'x: ' + coords.x + ', y: ' + coords.y;

    mainPinClick();
    window.utils.mainPin.addEventListener('keydown', mainPinEnterPress);
  }

  function activatePage() {
    window.utils.map.classList.remove('map--faded');
    window.utils.bookingForm.classList.remove('ad-form--disabled');

    for (var fieldset of bookingFormFieldsets) {
      fieldset.removeAttribute('disabled');
    }

    var coords = window.pin.getMainPinArrowCoordinates();
    addressInput.value = 'x: ' + coords.x + ', y: ' + coords.y;

    window.form.setPriceRestrictions();
    window.form.validateGuestsLimit();

    var hotels = window.data.generateHotels(7);
    window.utils.mapPins.appendChild(window.pin.createPins(hotels));
    parentDiv.insertBefore(window.card.createCards(hotels), window.utils.before);
    window.card.hideCards();

    window.utils.typeSelect.addEventListener('change', window.form.setPriceRestrictions);
    window.utils.roomNumberSelect.addEventListener('change', window.form.validateGuestsLimit);

    window.utils.mapPins.addEventListener('click', window.card.showCard);

    window.utils.mainPin.removeEventListener('mousedown', mainPinClick);
    window.utils.mainPin.removeEventListener('keydown', mainPinEnterPress);

    window.syncTimes.syncCheckinTimes();
  }

  function mainPinClick() {
    window.utils.mainPin.addEventListener('mousedown', function (event) {
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
            x: window.utils.mainPin.offsetLeft - shift.x,
            y: window.utils.mainPin.offsetTop - shift.y
          };

          startCoords = {
            x: moveEvt.clientX,
            y: moveEvt.clientY
          };

          var DragLimit = {
            X: {
              MIN: 0,
              MAX: window.utils.mainPin.parentNode.offsetWidth
            },
            Y: {
              MIN: 230,
              MAX: 630
            }
          };
          console.log(DragLimit.X.MAX)

          var Border = {
            TOP: DragLimit.Y.MIN - window.utils.MAIN_PIN_ARROW_HEIGHT,
            BOTTOM: DragLimit.Y.MAX - window.utils.MAIN_PIN_ARROW_HEIGHT,
            LEFT: DragLimit.X.MIN,
            RIGHT: DragLimit.X.MAX - window.utils.mainPin.offsetWidth
          };
          if (mainPinPosition.x >= Border.LEFT && mainPinPosition.x <= Border.RIGHT) {
            window.utils.mainPin.style.left = mainPinPosition.x + 'px';
          }
          if (mainPinPosition.y >= Border.TOP && mainPinPosition.y <= Border.BOTTOM) {
            window.utils.mainPin.style.top = mainPinPosition.y + 'px';
          }

        };
        var onMouseUp = function (upEvt) {
          upEvt.preventDefault();

          if (window.utils.map.className === "map map--faded") {
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


