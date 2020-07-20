'use strict';

(function () {
  var bookingForm = document.querySelector('.ad-form');
  var priceInput = bookingForm.querySelector('#price');
  var capacitySelect = bookingForm.querySelector('#capacity');
  var typeSelect = document.querySelector('#type');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var roomNumberSelect = document.querySelector('#room_number');
  var header = document.querySelector('#title');
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var features = document.querySelector('.features');
  var inputsFeatures = features.querySelectorAll('input');
  var homePhotoPreview = document.querySelector('.ad-form__photo');

  var typeBungalo = 'bungalo';
  var typeFlat = 'flat';
  var typeHouse = 'house';
  var typePalace = 'palace';

  var oneRoom = 1;
  var twoRooms = 2;
  var threeRooms = 3;
  var manyRooms = 100;

  function getTypeLabel(type) {
    if (type === typeFlat) {
      return 'Квартира';
    } else if (type === typeBungalo) {
      return 'Бунгало';
    } else if (type === typeHouse) {
      return 'Дом';
    } else if (type === typePalace) {
      return 'Дворец';
    }
    return type;
  }

  function validateGuestsLimit() {
    var selectedRoom = roomNumberSelect.value;
    var capacityOptions = capacitySelect.querySelectorAll('option');


    if (selectedRoom === oneRoom) {
      capacityOptions.forEach(function (element) {
        element.disabled = element.value > 1 || element.value === '0';
      });
      capacitySelect.children[2].selected = true;
    }

    if (selectedRoom === twoRooms) {
      capacityOptions.forEach(function (element) {
        element.disabled = element.value > 2 || element.value === '0';
      });
      capacitySelect.children[1].selected = true;
    }

    if (selectedRoom === threeRooms) {
      capacityOptions.forEach(function (element) {
        element.disabled = element.value === '0';
      });
      capacitySelect.children[0].selected = true;
    }

    if (selectedRoom === manyRooms) {
      capacityOptions.forEach(function (element) {
        element.disabled = element.value !== '0';
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

  function activate() {
    setPriceRestrictions();
    validateGuestsLimit();
    typeSelect.addEventListener('change', setPriceRestrictions);
    roomNumberSelect.addEventListener('change', validateGuestsLimit);
    document.querySelector('.ad-form__element--time').addEventListener('change', syncCheckinTimes);
  }

  function syncCheckinTimes(evt) {
    document.querySelector('#timein').value = evt.target.value;
    document.querySelector('#timeout').value = evt.target.value;
  }

  function clean() {
    header.value = '';
    typeSelect.value = 'flat';
    priceInput.value = '';
    priceInput.placeholder = '1000';
    mainPin.style.left = map.offsetWidth / 2 + 16 + 'px';
    mainPin.style.top = map.offsetHeight / 2 + 'px';
    timeIn.value = '12:00';
    timeOut.value = '12:00';
    roomNumberSelect.children[0].selected = true;
    capacitySelect.children[2].selected = true;
    avatarPreview.src = 'img/muffin-grey.svg';
    inputsFeatures.forEach(function (element) {
      element.checked = false;
    });
    homePhotoPreview.innerHTML = '';
  }

  window.form = {
    clean: clean,
    activate: activate,
    getTypeLabel: getTypeLabel,
    validateGuestsLimit: validateGuestsLimit,
    setPriceRestrictions: setPriceRestrictions,
    syncCheckinTimes: syncCheckinTimes,
  };
})();
