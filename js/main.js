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
var form = document.documentElement.querySelector(".ad-form");
var mapPins = document.querySelector(".map__pins");
var cardTemplate = document.querySelector("#card").content;
var before = document.querySelector(".map__filters-container");
var parentDiv = before.parentNode;
var allFieldset = document.querySelectorAll("fieldset");
var mainPin = document.querySelector(".map__pin--main");
var address = document.querySelector("#address");
var price = document.querySelector("#price");
var roomNumber = document.querySelector("#room_number");
var capacity = document.querySelector("#capacity");
var coordX = mainPin.offsetLeft
var coordY = mainPin.offsetTop


var PIN_IMG_WIDTH = 40;
var PIN_IMG_HEIGHT = 40;
var PHOTO_IMG_WIDTH = 45;
var PHOTO_IMG_HEIGHT = 40;
var PIN_IMG_SIZE = 65;
var PIN_IMG_ACTIVE_HEIGHT = 87;

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

var hotels = generateHotels(7);

function createPins(array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    var pin = document.createElement("button");
    pin.style = "left: " + array[i].location.x + "px;" + " " + "top: " + array[i].location.y + "px;";
    pin.className = "map__pin";
    pin.innerHTML = "<img/>";
    pin.querySelector("img").width = PIN_IMG_WIDTH;
    pin.querySelector("img").height = PIN_IMG_HEIGHT;
    pin.querySelector("img").src = array[i].author.avatar;
    pin.querySelector("img").alt = array[i].offer.type;

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

var setRoundPinLocation = function () {
  address.value = "x: " + (coordX - Math.round(PIN_IMG_SIZE / 2)) + ", y: " + (coordY - Math.round(PIN_IMG_SIZE / 2));
}; // расчет координат конца пина до актиации страницы (круглый пин)


var setPinLocation = function () {
  address.value = "x: " + (coordX - Math.round(PIN_IMG_SIZE / 2)) + ", y: " + (coordY - PIN_IMG_ACTIVE_HEIGHT);
}; // расчет координат конца пина после актиации страницы и появления хвостика

function deactivatePage() {
  for (let oneFieldset of allFieldset) {
    oneFieldset.setAttribute("disabled", "disabled");
  }
  address.setAttribute("value", "");
  setRoundPinLocation();

}

function logMouseButton(event) {
  if (event.which == 1) {
    activatePage();
  }
}



function activatePage() {
  map.classList.remove("map--faded");
  form.classList.remove("ad-form--disabled");

  for (let oneFieldset of allFieldset) {
    oneFieldset.removeAttribute("disabled", "disabled");
  }
  setPinLocation();
  setPriceValidity();
  setGuestsLimit()

  mapPins.appendChild(createPins(hotels));
  parentDiv.insertBefore(createCards(hotels), before);
  hideOffer();

  callPriceValidation();
  callGuestsValidation();
  callShowPins();
  callTimeValidation();
}


function setGuestsLimit() {
  var roomValue = document.querySelector("#room_number").value;
  var optionsCapacity = capacity.querySelectorAll("option");
  if (roomValue === "1") {
    for (let optionCapacity of optionsCapacity)
      if (optionCapacity.value > 1 || optionCapacity.value === "0") {
        optionCapacity.disabled = true;
      }
      else {
        optionCapacity.disabled = false;
      }
    capacity.children[2].selected = true;
  }
  if (roomValue === "2") {
    for (let optionCapacity of optionsCapacity)
      if (optionCapacity.value > 2 || optionCapacity.value === "0") {
        optionCapacity.disabled = true;
      }
      else {
        optionCapacity.disabled = false;
      }
    capacity.children[1].selected = true;
  }
  if (roomValue === "3") {
    for (let optionCapacity of optionsCapacity)
      if (optionCapacity.value === "0") {
        optionCapacity.disabled = true;
      } else {
        optionCapacity.disabled = false;
      }
    capacity.children[0].selected = true;
  }

  if (roomValue === "100") {
    for (var i = 0; i < capacity.children.length; i++) {
      capacity.children[i].disabled = true;
    }
    capacity.children[3].selected = true;
    capacity.children[3].disabled = false;
  }
};


function setPriceValidity() {
  var houseType = document.querySelector("#type").value;
  if (houseType === "bungalo") {
    price.placeholder = "0";
    price.setAttribute("min", "0");
  } else if (houseType == "flat") {
    price.placeholder = "1000";
    price.setAttribute("min", "1000");
  } else if (houseType === "house") {
    price.placeholder = "5000";
    price.setAttribute("min", "5000");
  } else if (houseType === "palace") {
    price.placeholder = "10 000";
    price.setAttribute("min", "10000");
  }
}


var removeActivePin = function () {
  var activePin = map.querySelector(".map__pin--active");
  if (activePin) {
    activePin.classList.remove("map__pin--active");
  }
};

function cardShow(event) {
  var pins = document.querySelectorAll(".map__pin:not(.map__pin--main)");
  var cards = document.querySelectorAll(".map__card");
  pins.forEach(function (elem, i) {
    if (event.target.parentElement === elem || elem === document.activeElement) {
      removeActivePin();
      hideOffer();
      elem.classList.add("map__pin--active");
      cards[i].classList.remove("hidden");
      map.addEventListener("click", closeOffer);
      document.addEventListener("keydown", closeOffer);
    }
  }
  )
}

function hideOffer() {
  var offerCards = map.querySelectorAll('.popup');
  offerCards.forEach(function (elem) {
    if (elem.classList.contains('.hidden') !== true) {
      elem.classList.add('hidden');
    }
  });
};

function closeOffer(event) {
  if (event.type === "keydown" && event.keyCode === 27 || event.type === "click" && event.target.classList.contains("popup__close")) {
    removeActivePin();
    hideOffer();
    map.removeEventListener("click", closeOffer);
    document.removeEventListener("keydown", closeOffer);
  }
};

function callPriceValidation() {
  document.querySelector("#type").addEventListener("change", setPriceValidity);
}

function callMainPinReaction() {
  mainPin.addEventListener("mousedown", logMouseButton);
  mainPin.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      activatePage();
    }
  });
}

function callGuestsValidation() {
  document.querySelector("#room_number").addEventListener("change", setGuestsLimit);
}

function callShowPinsCall() {
  document.querySelector('.map__pins').addEventListener('click', cardShow);
}

function callTimeValidation() {
  document.querySelector(".ad-form__element--time").onchange = function (event) {
    document.querySelector("#timein").value = event.target.value;
    document.querySelector("#timeout").value = event.target.value;
  };
}

deactivatePage();
callMainPinReaction();
