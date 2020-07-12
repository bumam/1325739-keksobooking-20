'use strict';

(function () {

  var hotelTypes = document.querySelector('#housing-type');
  var AMOUNT_OF_SHOWED_PINS = 5;

  function successHandler(data) {
    var dataPins = data;
    return dataPins;
  }

  function hideExtraPins() {
    var createdPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var pinsAmount = document.querySelectorAll('.map__pin:not(.map__pin--main)').length;
    if (pinsAmount > AMOUNT_OF_SHOWED_PINS) {
      for (var i = AMOUNT_OF_SHOWED_PINS; i < pinsAmount; i++) {
        createdPins[i].classList.add('hidden');
      }
    }
  }

  function filterHotelTypes() {
    hotelTypes.addEventListener('click', function () {
      window.card.hideCards();
      var currentHotelsType = hotelTypes.value;
      var createdPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

      if (currentHotelsType === 'any') {
        createdPins.forEach(function (elem) {
          elem.classList.remove('hidden');
          hideExtraPins();
        });
      } else {
        createdPins.forEach(function (elem) {
          elem.classList.add('hidden');
        });

      }

      for (var i = 0; i < createdPins.length; i++) {
        var btnPin = createdPins.item(i);
        var pinsAlt = btnPin.children[0].getAttribute('alt');
        if (pinsAlt === currentHotelsType) {
          btnPin.classList.remove('hidden');
        }
      }

    });
  }


  window.filters = {
    successHandler: successHandler,
    filterHotelTypes: filterHotelTypes,
    hideExtraPins: hideExtraPins
  };
})();
