'use strict';

(function () {
  var bookingForm = document.documentElement.querySelector('.ad-form');
  var priceInput = bookingForm.querySelector('#price');
  var capacitySelect = bookingForm.querySelector('#capacity');
  var typeSelect = document.querySelector('#type');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var roomNumberSelect = document.querySelector('#room_number');
  var header = document.querySelector('#title');
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');


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
    return type;
  }

  function validateGuestsLimit() {
    var selectedRoom = roomNumberSelect.value;
    var capacityOptions = capacitySelect.querySelectorAll('option');


    if (selectedRoom === '1') {
      capacityOptions.forEach(function (elem) {
        elem.disabled = elem.value > 2 || elem.value === '0';
      });
      capacitySelect.children[2].selected = true;
    }

    if (selectedRoom === '2') {
      capacityOptions.forEach(function (elem) {
        elem.disabled = elem.value > 2 || elem.value === '0';
      });
      capacitySelect.children[1].selected = true;
    }

    if (selectedRoom === '3') {
      capacityOptions.forEach(function (elem) {
        elem.disabled = elem.value === '0';
      });
      capacitySelect.children[0].selected = true;
    }

    if (selectedRoom === '100') {
      capacityOptions.forEach(function (elem) {
        elem.disabled = elem.value !== '0';
      });
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

  function cleanForm() {
    header.value = '';
    // type.value = 'flat';
    priceInput.value = '';
    priceInput.placeholder = '1000';
    mainPin.style.left = map.offsetWidth / 2 + 16 + 'px';
    mainPin.style.top = map.offsetHeight / 2 + 'px';
    timeIn.value = '12:00';
    timeOut.value = '12:00';
    roomNumberSelect.children[0].selected = true;
    capacitySelect.children[2].selected = true;
  }

  // function deactivateForm() {
  // document.querySelector('.ad-form__element--time').removeEventListener('change', syncCheckinTimes);
  // }

  window.form = {
    cleanForm: cleanForm,
    activateForm: activateForm,
    getTypeLabel: getTypeLabel,
    validateGuestsLimit: validateGuestsLimit,
    setPriceRestrictions: setPriceRestrictions,
    syncCheckinTimes: syncCheckinTimes,
  };
})();
