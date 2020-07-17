'use strict';

(function () {
  var filtersBlock = document.querySelector('.map__filters');
  var filterType = filtersBlock.querySelector('#housing-type');
  var filterPrice = filtersBlock.querySelector('#housing-price');
  var filterRooms = filtersBlock.querySelector('#housing-rooms');
  var filterGuestsNumber = filtersBlock.querySelector('#housing-guests');
  var selectFilters = filtersBlock.querySelectorAll('.map__filter');
  var inputFilters = filtersBlock.querySelectorAll('.map__features input');

  var any = 'any';
  var low = 'low';
  var high = 'high';
  var middle = 'middle';

  var PRICE_LOW = 10000;
  var PRICE_MIDDLE = 50000;

  var mapSection = document.querySelector('.map__pins');
  var before = document.querySelector('.map__filters-container');
  var parentDiv = before.parentNode;

  var AMOUNT_OF_SHOWED_PINS = 5;

  function initFilter() {
    selectFilters.forEach(function (elem) {
      elem.addEventListener('change', function () {
        window.debounce(updateOffers);
      });
    });

    inputFilters.forEach(function (elem) {
      elem.addEventListener('change', function () {
        window.debounce(updateOffers);
      });
    });
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


  function filterAds(ad) {
    var adOffer = ad.offer;
    var adFeatures = adOffer.features;
    var adPrice = adOffer.price;

    for (var i = 0; i < selectFilters.length; i++) {
      if (selectFilters[i] === filterType) {
        if (selectFilters[i].value !== any && adOffer.type !== selectFilters[i].value) {
          return false;
        }
      }
      if (selectFilters[i] === filterPrice) {
        if (selectFilters[i].value !== any &&
          (selectFilters[i].value === low && adPrice > PRICE_LOW ||
            selectFilters[i].value === middle && (adPrice <= PRICE_LOW || adPrice >= PRICE_MIDDLE) ||
            selectFilters[i].value === high && adPrice < PRICE_MIDDLE)
        ) {
          return false;
        }
      }
      if (selectFilters[i] === filterRooms || selectFilters[i] === filterGuestsNumber) {
        if (selectFilters[i].value !== any && adOffer.guests !== selectFilters[i].value * 1) {
          return false;
        }
      }
    }

    for (var j = 0; j < inputFilters.length; j++) {
      if (inputFilters[j].checked === true && adFeatures.indexOf(inputFilters[j].value) === -1) {
        return false;
      }
    }

    return true;
  }

  function removePins() {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (elem) {
      elem.remove();
    });
  }

  function removeCards() {
    var cards = document.querySelectorAll('.popup');
    cards.forEach(function (elem) {
      elem.remove();
    });
  }

  function updateOffers() {
    window.load('https://javascript.pages.academy/keksobooking/data', function (hotels) {
      var filteredAds = hotels.filter(filterAds);
      removePins();
      removeCards();
      mapSection.appendChild(window.pin.createPins(filteredAds));
      parentDiv.insertBefore(window.card.createCards(filteredAds), before);
      window.card.hideCards();
      hideExtraPins();
    });
  }

  initFilter();

  window.filter = {
    updateOffers: updateOffers,
    hideExtraPins: hideExtraPins,
    removePins: removePins,
    removeCards: removeCards
  };

})();
