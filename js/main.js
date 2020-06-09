"use strict";

var numPool = [1, 2, 3, 4, 5, 6, 7, 8];
var titlePool = ["Гнездышко", "Уютное убежище", "Твой рай"];
var housePool = ["palace", "flat", "house", "bungalo"];
var checkPool = ["12:00", "13:00", "14:00"];
var descriptionPool = ["Очень красиво!", "Очень хорошо!", "Очень чисто!"];

var getAvatar = function (AvPool) {
  return "0" + Math.floor(Math.random() * AvPool.length);
};

var getPart = function (poolName) {
  var randеTitle = Math.floor(Math.random() * poolName.length);
  return poolName[randеTitle];
};

var getXY = function (minXY, maxXY) {
  return Math.floor(Math.random() * (maxXY - minXY + 1)) + minXY;
};

var getImg = function () {
  var imgPool = [
    "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel3.jpg",
  ];
  imgPool.length = Math.floor(Math.random() * (imgPool.length - 1)) + 1;
  return imgPool;
}; // генерируем случайную длину массива для фото

var getFts = function () {
  var featuresPool = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
  featuresPool.length = Math.floor(Math.random() * (featuresPool.length - 1)) + 1;
  return featuresPool;
}; // генерируем случайную длину массива для features

function Author() {
  this.avatar = "img/avatars/user" + getAvatar(numPool) + ".png";
}

function Offer() {
  this.title = getPart(titlePool);
  this.address = getXY(1, window.innerWidth) + "," + getXY(130, 630);
  this.price = getXY(0, 1000000);
  this.type = getPart(housePool);
  this.rooms = getPart(numPool);
  this.guests = getPart(numPool);
  this.checkin = getPart(checkPool);
  this.checkout = getPart(checkPool);
  this.features = getFts();
  this.description = getPart(descriptionPool);
  this.photos = getImg();
}

function Location() {
  this.x = getXY(1, window.innerWidth);
  this.y = getXY(130, 630);
}

function Full() {
  // генерируем  массив со всеми данными
  this.author = new Author();
  this.offer = new Offer();
  this.location = new Location();
}

// генерируем единый boss-массив c данными из 8 объектов
var first = Array();
for (var i = 0; i <= 6; i++) {
  first[i] = new Full();
  first.push(first[i]);
}
var oneMassive = first;
console.log(oneMassive);

var map = document.documentElement.querySelector(".map"); // нахожу блок карты
map.classList.remove("map--faded"); //удаляю  .map--faded

var placeMapPin = document.querySelector(".map__pins"); // находим блок для вставки меток
var template = document.querySelector("#pin").content.querySelector("button");

var fragment = document.createDocumentFragment(); //создаем новый фрагмент
var createPins = function () {
  for (var i = 0; i < oneMassive.length; i++) {
    var newElement = document.createElement("button");
    newElement.style =
      "left: " +
      oneMassive[i].location.x +
      "px;" +
      " " +
      "top: " +
      oneMassive[i].location.y +
      "px;";
    newElement.className = "map__pin map__pin--main";
    newElement.innerHTML = "<img/>";
    newElement.querySelector("img").width = "40";
    newElement.querySelector("img").height = "44";
    newElement.querySelector("img").draggable = "false";
    newElement.querySelector("img").src = oneMassive[i].author.avatar;
    newElement.querySelector("img").alt = oneMassive[i].offer.type;

    fragment.appendChild(newElement);
  }
  createPins = fragment;
};
createPins();
placeMapPin.appendChild(fragment); //отрисовка объектов
