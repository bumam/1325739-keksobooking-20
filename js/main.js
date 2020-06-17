"use strict";

var titles = ["Гнездышко", "Уютное убежище", "Твой рай"];
var hotelTypes = ["palace", "flat", "house", "bungalo"];
var times = ["12:00", "13:00", "14:00"];
var description = ["Очень красиво!", "Очень хорошо!", "Очень чисто!"];
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

var getDifMassive = function (pool) {
  var myPool = pool.slice();
  myPool.length = Math.floor(Math.random() * myPool.length) + 1;
  return myPool;
};

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
        features: getDifMassive(features),
        description: description[getRandomNumber(0, description.length)],
        photos: getDifMassive(images),
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
    pin.style =
      "left: " + array[i].location.x + "px;" + " " + "top: " + array[i].location.y + "px;";
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

function createCards(array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    var element = cardTemplate.cloneNode(true);
    var card = element;
    card.querySelector(".popup__avatar").src = array[i].author.avatar;
    card.querySelector(".popup__title").textContent = array[i].offer.title;
    card.querySelector(".popup__text--address").textContent = array[i].offer.address;
    card.querySelector(".popup__text--price").textContent = array[i].offer.price + "₽/ночь";

    var type = "Квартира";
    if (array[i].offer.type === "bungalo") {
      type = "Бунгало";
    }
    if (array[i].offer.type === "house") {
      type = "Дом";
    }
    if (array[i].offer.type === "palace") {
      type = "Дворец";
    }

    card.querySelector(".popup__type").textContent = type;

    array[i].offer.type;
    card.querySelector(".popup__text--capacity").textContent =
      array[i].offer.rooms +
      " " +
      "комнаты для" +
      " " +
      array[i].offer.guests +
      " " +
      "гостей";
    card.querySelector(".popup__text--time").textContent =
      "Заезд после" +
      " " +
      array[i].offer.checkin +
      ", выезд до" +
      " " +
      array[i].offer.checkout;
    card.querySelector(".popup__feature--wifi").textContent = array[i].offer.features[1];
    card.querySelector(".popup__feature--dishwasher").textContent = array[i].offer.features[2];
    card.querySelector(".popup__feature--parking").textContent = array[i].offer.features[3];
    card.querySelector(".popup__feature--washer").textContent = array[i].offer.features[4];
    card.querySelector(".popup__feature--elevator").textContent = array[i].offer.features[5];
    card.querySelector(".popup__feature--conditioner").textContent =
      array[i].offer.features[6];
    card.querySelector(".popup__description").textContent = array[i].offer.description;

    var cardPhotos = card.querySelector(".popup__photos");
    cardPhotos.innerHTML = "";

    var createPhotos = function (array) {
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
    };
    cardPhotos.appendChild(createPhotos(array[i].offer.photos));
    card.querySelectorAll("li:empty").forEach((element) => element.remove());
    fragment.appendChild(card);
  }
  return fragment;
}

var before = document.querySelector(".map__filters-container");
var parentDiv = before.parentNode;
parentDiv.insertBefore(createCards(hotels), before);
