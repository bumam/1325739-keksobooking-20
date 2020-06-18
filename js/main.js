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
var PIN_IMG_WIDTH = 40;
var PIN_IMG_HEIGHT = 40;
var PHOTO_IMG_WIDTH = 45;
var PHOTO_IMG_HEIGHT = 40;

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
    pin.className = "map__pin map__pin--main";
    pin.innerHTML = "<img/>";
    pin.querySelector("img").width = PIN_IMG_WIDTH;
    pin.querySelector("img").height = PIN_IMG_HEIGHT;
    pin.querySelector("img").src = array[i].author.avatar;
    pin.querySelector("img").alt = array[i].offer.type;

    fragment.appendChild(pin);
  }
  return fragment;
}

var mapPins = document.querySelector(".map__pins");
mapPins.appendChild(createPins(hotels));

var map = document.documentElement.querySelector(".map");
map.classList.remove("map--faded");

var cardTemplate = document.querySelector("#card").content;

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

function createCards(array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    var card = cardTemplate.cloneNode(true);
    var offer = array[i].offer;
    card.querySelector(".popup__avatar").src = array[i].author.avatar;
    card.querySelector(".popup__title").textContent = offer.title;
    card.querySelector(".popup__text--address").textContent = offer.address;
    card.querySelector(".popup__text--price").textContent = offer.price + "₽/ночь";

    function getTypeLabel(type) {
      if (type === "bungalo") {
        card.querySelector(".popup__type").textContent = "Бунгало";
      } else if (type === "house") {
        card.querySelector(".popup__type").textContent = "Дом";
      } else if (type === "palace") {
        card.querySelector(".popup__type").textContent = "Дворец";
      }
    }

    getTypeLabel(offer.type);

    card.querySelector(".popup__text--capacity").textContent =
      offer.rooms + " " + "комнаты для" + " " + offer.guests + " " + "гостей";
    card.querySelector(".popup__text--time").textContent =
      "Заезд после" + " " + offer.checkin + ", выезд до" + " " + offer.checkout;

    for (var j = 0; j < offer.features; j++) {
      var feature = offer.features[j];
      card.querySelector(".popup__feature--" + feature).textContent = feature;
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

var before = document.querySelector(".map__filters-container");
var parentDiv = before.parentNode;
parentDiv.insertBefore(createCards(hotels), before);
