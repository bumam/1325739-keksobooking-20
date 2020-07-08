'use strict';

(function () {
  var bookingForm = document.documentElement.querySelector('.ad-form');
  var priceInput = bookingForm.querySelector('#price');
  var capacitySelect = bookingForm.querySelector('#capacity');
  var typeSelect = document.querySelector('#type');
  var roomNumberSelect = document.querySelector('#room_number');


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
    var selectedRoom = roomNumberSelect.value;
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
    switch (typeSelect.value) {
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

  function activateForm() {
    setPriceRestrictions();
    validateGuestsLimit();
    typeSelect.addEventListener('change', setPriceRestrictions);
    roomNumberSelect.addEventListener('change', validateGuestsLimit);
    document.querySelector('.ad-form__element--time').addEventListener('change', syncCheckinTimes);
  }

  function syncCheckinTimes(event) {
    document.querySelector('#timein').value = event.target.value;
    document.querySelector('#timeout').value = event.target.value;
  }

  function deactivateForm() {
    document.querySelector('.ad-form__element--time').removeEventListener('change', syncCheckinTimes);
  }

  window.form = {
    activateForm: activateForm,
    getTypeLabel: getTypeLabel,
    validateGuestsLimit: validateGuestsLimit,
    setPriceRestrictions: setPriceRestrictions,
    syncCheckinTimes: syncCheckinTimes,
  };
})();
