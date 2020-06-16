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

var getRandomNumber = function (min, max) {
  return min + Math.ceil(Math.random() * (max - min));
};

var getDifMassive = function (pool) {
  var myPool = pool.slice();
  myPool.length = Math.floor(Math.random() * (myPool.length - 1)) + 1;
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
