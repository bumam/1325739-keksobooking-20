"use strict";

var titles = ["Гнездышко", "Уютное убежище", "Твой рай"];
var hotelTypes = ["palace", "flat", "house", "bungalo"];
var times = ["12:00", "13:00", "14:00"];
var descriptions = ["Очень красиво!", "Очень хорошо!", "Очень чисто!"];
var images = [
  "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel3.jpg",
];
var features = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];

var map = document.documentElement.querySelector(".map");
var mapPins = document.querySelector(".map__pins");
var cardTemplate = document.querySelector("#card").content;
var before = document.querySelector(".map__filters-container");
var parentDiv = before.parentNode;
var mainPin = document.querySelector(".map__pin--main");


var bookingForm = document.documentElement.querySelector(".ad-form");
var bookingFormFieldsets = bookingForm.querySelectorAll("fieldset");
var addressInput = bookingForm.querySelector("#address");
var priceInput = bookingForm.querySelector("#price");
var capacitySelect = bookingForm.querySelector("#capacity");
var typeSelect = document.querySelector("#type");
var roomNumberSelect = document.querySelector("#room_number")

var PIN_IMG_WIDTH = 40;
var PIN_IMG_HEIGHT = 40;

var PHOTO_IMG_WIDTH = 45;
var PHOTO_IMG_HEIGHT = 40;

var MAIN_PIN_ARROW_HEIGHT = 87;

var getRandomNumber = function (min, max) {
  return min + Math.floor(Math.random() * (max - min));
};

function getCuttedArray(source) {
  var ret = source.slice();
  ret.length = getRandomNumber(0, ret.length);
  return ret;
}

var generateHotels = function (amount) {
  var hotels = Array();
  for (var i = 0; i < amount; i++) {
    var hotel = {
      author: {
        avatar: "img/avatars/user" + "0" + getRandomNumber(1, 8) + ".png",
      },
      offer: {
        title: titles[getRandomNumber(0, titles.length)],
        address: getRandomNumber(1, window.innerWidth) + "," + getRandomNumber(130, 630),
        price: getRandomNumber(0, 1000000),
        type: hotelTypes[getRandomNumber(0, hotelTypes.length)],
        rooms: getRandomNumber(1, 4),
        guests: getRandomNumber(1, 4),
        checkin: times[getRandomNumber(0, times.length)],
        checkout: times[getRandomNumber(0, times.length)],
        features: getCuttedArray(features),
        description: descriptions[getRandomNumber(0, descriptions.length)],
        photos: getCuttedArray(images),
      },
      location: {
        x: getRandomNumber(1, window.innerWidth),
        y: getRandomNumber(130, 630),
      },
    };
    hotels.push(hotel);
  }
  return hotels;
};

function createPins(hotels) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < hotels.length; i++) {
    var pin = document.createElement("button");
    pin.style = "left: " + hotels[i].location.x + "px;" + " " + "top: " + hotels[i].location.y + "px;";
    pin.innerHTML = "<img/>";
    pin.querySelector("img").width = PIN_IMG_WIDTH;
    pin.querySelector("img").height = PIN_IMG_HEIGHT;
    pin.querySelector("img").src = hotels[i].author.avatar;
    pin.querySelector("img").alt = hotels[i].offer.type;
    pin.querySelector("img").dataset.pinId = i;
    pin.classList.add("map__pin");

    fragment.appendChild(pin);
  }
  return fragment;
}


function createPhotos(array) {
  var fragment = document.createDocumentFragment();

  for (var j = 0; j < array.length; j++) {
    var newImg = document.createElement("img");
    newImg.width = PHOTO_IMG_WIDTH;
    newImg.height = PHOTO_IMG_HEIGHT;
    newImg.src = array[j];
    newImg.alt = "Фотография жилья";

    fragment.appendChild(newImg);
  }
  return fragment;
}

function getTypeLabel(type) {
  if (type === "flat") {
    return "Квартира";
  } else if (type === "bungalo") {
    return "Бунгало";
  } else if (type === "house") {
    return "Дом";
  } else if (type === "palace") {
    return "Дворец";
  }
}

function createCards(array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    var card = cardTemplate.cloneNode(true);
    var offer = array[i].offer;
    card.querySelector(".popup__avatar").src = array[i].author.avatar;
    card.querySelector(".popup__title").textContent = offer.title;
    card.querySelector(".popup__text--address").textContent = offer.address;
    card.querySelector(".popup__text--price").textContent = offer.price + "₽/ночь";
    card.querySelector(".popup__type").textContent = getTypeLabel(offer.type);

    card.querySelector(".popup__text--capacity").textContent =
      offer.rooms + " " + "комнаты для" + " " + offer.guests + " " + "гостей";
    card.querySelector(".popup__text--time").textContent =
      "Заезд после" + " " + offer.checkin + ", выезд до" + " " + offer.checkout;

    for (var j = 0; j < offer.features.length; j++) {
      card.querySelector(".popup__feature--" + offer.features[j]).textContent = offer.features[j];
    }

    card.querySelector(".popup__description").textContent = offer.description;

    var cardPhotos = card.querySelector(".popup__photos");
    cardPhotos.innerHTML = "";

    cardPhotos.appendChild(createPhotos(offer.photos));
    card.querySelectorAll("li:empty").forEach((element) => element.remove());
    fragment.appendChild(card);
  }
  return fragment;
}

function getMainPinCenterCoordinates() {
  return {
    x: mainPin.offsetLeft + Math.round(mainPin.offsetWidth / 2),
    y: mainPin.offsetTop + Math.round(mainPin.offsetHeight / 2),
  }
}

function getMainPinArrowCoordinates() {
  return {
    x: mainPin.offsetLeft + Math.round(mainPin.offsetWidth / 2),
    y: mainPin.offsetTop + MAIN_PIN_ARROW_HEIGHT,
  }
}

function mainPinClick(event) {
  if (event.which === 1) {
    activatePage();
  }
}

function mainPinEnterPress(event) {
  if (event.key === "Enter") {
    activatePage();
  }
}

function deactivatePage() {
  map.classList.add("map--faded");
  bookingForm.classList.add("ad-form--disabled");

  for (var fieldset of bookingFormFieldsets) {
    fieldset.setAttribute("disabled", "disabled");
  }

  var coords = getMainPinCenterCoordinates();
  addressInput.value = "x: " + coords.x + ", y: " + coords.y;

  mainPin.addEventListener("mousedown", mainPinClick);
  mainPin.addEventListener("keydown", mainPinEnterPress);
}

function activatePage() {
  map.classList.remove("map--faded");
  bookingForm.classList.remove("ad-form--disabled");

  for (var fieldset of bookingFormFieldsets) {
    fieldset.removeAttribute("disabled");
  }

  var coords = getMainPinArrowCoordinates();
  addressInput.value = "x: " + coords.x + ", y: " + coords.y;

  setPriceRestrictions();
  validateGuestsLimit();

  var hotels = generateHotels(7);
  mapPins.appendChild(createPins(hotels));
  parentDiv.insertBefore(createCards(hotels), before);
  hideCards();

  typeSelect.addEventListener("change", setPriceRestrictions);
  roomNumberSelect.addEventListener("change", validateGuestsLimit);

  mapPins.addEventListener('click', showCard);

  mainPin.removeEventListener("mousedown", mainPinClick);
  mainPin.removeEventListener("keydown", mainPinEnterPress);

  syncCheckinTimes();
}

function validateGuestsLimit() {
  var selectedRoom = roomNumberSelect.value;
  var capacityOptions = capacitySelect.querySelectorAll("option");

  if (selectedRoom === "1") {
    for (var option of capacityOptions) {
      option.disabled = option.value > 1 || option.value === "0";
    }
    capacitySelect.children[2].selected = true;
  }

  if (selectedRoom === "2") {
    for (option of capacityOptions) {
      option.disabled = option.value > 2 || option.value === "0";
    }
    capacitySelect.children[1].selected = true;
  }

  if (selectedRoom === "3") {
    for (option of capacityOptions) {
      option.disabled = option.value === "0";
    }
    capacitySelect.children[0].selected = true;
  }

  if (selectedRoom === "100") {
    for (option of capacityOptions) {
      option.disabled = option.value !== "0";
    }
     capacitySelect.children[3].selected = true;
  }
}

function setPriceRestrictions() {
  switch (typeSelect.value) {
    case 'flat': {
      priceInput.placeholder = "1000";
      priceInput.setAttribute("min", "1000");
      break;
    }
    case 'house': {
      priceInput.placeholder = "5000";
      priceInput.setAttribute("min", "5000");
      break;
    }
    case 'palace': {
      priceInput.placeholder = "10 000";
      priceInput.setAttribute("min", "10000");
      break;
    }
    default: {
      priceInput.placeholder = "0";
      priceInput.setAttribute("min", "0");
    }
  }
}

function removeActivePin() {
  var activePin = map.querySelector(".map__pin--active");
  if (activePin) {
    activePin.classList.remove("map__pin--active");
  }
}


function showCard(event) {
  var cards = document.querySelectorAll(".map__card");
  hideActiveCard();

  if(event.target.dataset.pinId !== undefined) {
    removeActivePin();
    event.target.classList.add("map__pin--active");
    cards[event.target.dataset.pinId].classList.remove("hidden");
    cards[event.target.dataset.pinId].classList.add("map__card--active");

    map.addEventListener("click", closeOffer);
    document.addEventListener("keydown", closeOffer);
  }
}

function hideCards() {
  var cards = map.querySelectorAll('.popup');
  cards.forEach(function (elem) {
    if (elem.classList.contains('.hidden') !== true) {
      elem.classList.add('hidden');
    }
  });
}

function hideActiveCard() {
  var card = document.querySelector(".map__card--active");
  if (card) {
    card.classList.add("hidden");
    card.classList.remove("map__card--active");
  }
}

function closeOffer(event) {
  if (
    event.type === "keydown" && event.keyCode === 27 ||
    event.type === "click" && event.target.classList.contains("popup__close")
  ) {
    removeActivePin();
    hideActiveCard();
    map.removeEventListener("click", closeOffer);
    document.removeEventListener("keydown", closeOffer);
  }
}

function syncCheckinTimes() {
  document.querySelector(".ad-form__element--time").addEventListener('change', function (event) {
    document.querySelector("#timein").value = event.target.value;
    document.querySelector("#timeout").value = event.target.value;
  });
}

deactivatePage();
