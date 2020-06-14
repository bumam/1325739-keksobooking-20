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
var features = [
  "wifi",
  "dishwasher",
  "parking",
  "washer",
  "elevator",
  "conditioner",
];
var PIN_IMG_WIDTH = 40;
var PIN_IMG_HEIGHT = 40;

var getRandomNumber = function (min, max) {
  return min + Math.ceil(Math.random() * (max - min));
};

var getRandomInteger = function (min, array) {
  var position = min + Math.ceil(Math.random() * (array.length - 1));
  return array[position];
};

var getDifMassive = function (pool) {
  var myPool = pool.slice();
  myPool.length = Math.floor(Math.random() * (myPool.length - 1)) + 1;
  return myPool;
};

var generateHotels = function (amount) {
  var first = Array(); // генерируем объединенный массив из n-amount объектов
  for (var i = 0; i < amount; i++) {
    var author = {
      avatar: "img/avatars/user" + "0" + getRandomNumber(1, 8) + ".png",
    };

    var offer = {
      title: getRandomInteger(0, titles),
      address:
        getRandomNumber(1, window.innerWidth) + "," + getRandomNumber(130, 630),
      price: getRandomNumber(0, 1000000),
      type: getRandomInteger(0, hotelTypes),
      rooms: getRandomNumber(1, 4),
      guests: getRandomNumber(1, 4),
      checkin: getRandomInteger(0, times),
      checkout: getRandomInteger(0, times),
      features: getDifMassive(features),
      description: getRandomInteger(0, description),
      photos: getDifMassive(images),
    };

    var location = {
      x: getRandomNumber(1, window.innerWidth),
      y: getRandomNumber(130, 630),
    };

    var full = {
      // генерируем 1 объект
      author: author,
      offer: offer,
      location: location,
    };

    first[i] = full;
    first.push(first[i]);
  }
  return first;
};

var hotels = generateHotels(7);

var createPins = function (array) {
  var fragment = document.createDocumentFragment(); //создаем новый фрагмент
  for (var i = 0; i < array.length; i++) {
    var newElement = document.createElement("button");
    newElement.style ="left: " + array[i].location.x + "px;" + " " + "top: " + array[i].location.y + "px;";
    newElement.className = "map__pin map__pin--main";
    newElement.innerHTML = "<img/>";
    newElement.querySelector("img").width = PIN_IMG_WIDTH;
    newElement.querySelector("img").height = PIN_IMG_HEIGHT;
    newElement.querySelector("img").src = array[i].author.avatar;
    newElement.querySelector("img").alt = array[i].offer.type;

    fragment.appendChild(newElement);
  }
  return fragment;
};

var mapPins = document.querySelector(".map__pins"); // находим блок для вставки меток
mapPins.appendChild(createPins(hotels)); //отрисовка объектов

var map = document.documentElement.querySelector(".map"); // нахожу блок карты
map.classList.remove("map--faded"); //удаляю  .map--faded

var pinTemplate = document
  .querySelector("#pin")
  .content.querySelector("button");
