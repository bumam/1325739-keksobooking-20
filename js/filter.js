'use strict';

(function () {
  var filtersBlock = document.querySelector('.map__filters');
  var selectFilters = filtersBlock.querySelectorAll('.map__filter');
  var inputFilters = filtersBlock.querySelectorAll('.map__features input');
  var filterType = filtersBlock.querySelector('#housing-type');
  var filterPrice = filtersBlock.querySelector('#housing-price');
  var filterRooms = filtersBlock.querySelector('#housing-rooms');
  var filterGuestsNumber = filtersBlock.querySelector('#housing-guests');

  var any = 'any';
  var low = 'low';
  var high = 'high';
  var middle = 'middle';

  var PRICE_LOW = 10000;
  var PRICE_MIDDLE = 50000;

  var AMOUNT_OF_SHOWED_PINS = 5;

  function hideExtraPins() {
    var createdPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var pinsAmount = document.querySelectorAll('.map__pin:not(.map__pin--main)').length;
    if (pinsAmount > AMOUNT_OF_SHOWED_PINS) {
      for (var i = AMOUNT_OF_SHOWED_PINS; i < pinsAmount; i++) {
        createdPins[i].classList.add('hidden');
      }
    }
  }

  function filterAdvertisement(advertisement) {
    var advertisementOffer = advertisement.offer;
    var advertisementFeatures = advertisementOffer.features;
    var advertisementPrice = advertisementOffer.price;

    for (var i = 0; i < selectFilters.length; i++) {
      if (selectFilters[i] === filterType) {
        if (selectFilters[i].value !== any && advertisementOffer.type !== selectFilters[i].value) {
          return false;
        }
      }
      if (selectFilters[i] === filterPrice) {
        if (selectFilters[i].value !== any &&
          (selectFilters[i].value === low && advertisementPrice > PRICE_LOW ||
            selectFilters[i].value === middle && (advertisementPrice <= PRICE_LOW || advertisementPrice >= PRICE_MIDDLE) ||
            selectFilters[i].value === high && advertisementPrice < PRICE_MIDDLE)
        ) {
          return false;
        }
      }
      if (selectFilters[i] === filterRooms || selectFilters[i] === filterGuestsNumber) {
        if (selectFilters[i].value !== any && advertisementOffer.guests !== selectFilters[i].value * 1) {
          return false;
        }
      }
    }

    for (var j = 0; j < inputFilters.length; j++) {
      if (inputFilters[j].checked === true && advertisementFeatures.indexOf(inputFilters[j].value) === -1) {
        return false;
      }
    }

    return true;
  }

  function removePins() {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (element) {
      element.remove();
    });
  }

  window.filter = {
    hideExtraPins: hideExtraPins,
    filterAdvertisement: filterAdvertisement,
    removePins: removePins
  };

})();
