'use strict';

// Утилитный модуль
(function () {

  var priceInput = window.utils.bookingForm.querySelector('#price');
  var capacitySelect = window.utils.bookingForm.querySelector('#capacity');

  function getTypeLabel(type) {
    if (type === 'flat') {
      return 'Квартира';
    } else if (type === 'bungalo') {
      return 'Бунгало';
    } else if (type === 'house') {
      return 'Дом';
    } else if (type === 'palace') {
      return 'Дворец';
    }
  }

  function validateGuestsLimit() {
    var selectedRoom = window.utils.roomNumberSelect.value;
    var capacityOptions = capacitySelect.querySelectorAll('option');

    if (selectedRoom === '1') {
      for (var option of capacityOptions) {
        option.disabled = option.value > 1 || option.value === '0';
      }
      capacitySelect.children[2].selected = true;
    }

    if (selectedRoom === '2') {
      for (option of capacityOptions) {
        option.disabled = option.value > 2 || option.value === '0';
      }
      capacitySelect.children[1].selected = true;
    }

    if (selectedRoom === '3') {
      for (option of capacityOptions) {
        option.disabled = option.value === '0';
      }
      capacitySelect.children[0].selected = true;
    }

    if (selectedRoom === '100') {
      for (option of capacityOptions) {
        option.disabled = option.value !== '0';
      }
      capacitySelect.children[3].selected = true;
    }
  }

  function setPriceRestrictions() {
    switch (window.utils.typeSelect.value) {
      case 'flat': {
        priceInput.placeholder = '1000';
        priceInput.setAttribute('min', '1000');
        break;
      }
      case 'house': {
        priceInput.placeholder = '5000';
        priceInput.setAttribute('min', '5000');
        break;
      }
      case 'palace': {
        priceInput.placeholder = '10 000';
        priceInput.setAttribute('min', '10000');
        break;
      }
      default: {
        priceInput.placeholder = '0';
        priceInput.setAttribute('min', '0');
      }
    }
  }
  window.form = {
    getTypeLabel: getTypeLabel,
    validateGuestsLimit: validateGuestsLimit,
    setPriceRestrictions: setPriceRestrictions
  };
})();
