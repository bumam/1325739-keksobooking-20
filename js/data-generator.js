'use strict';

(function () {
  var titles = ['Гнездышко', 'Уютное убежище', 'Твой рай'];
  var hotelTypes = ['palace', 'flat', 'house', 'bungalo'];
  var times = ['12:00', '13:00', '14:00'];
  var descriptions = ['Очень красиво!', 'Очень хорошо!', 'Очень чисто!'];
  var images = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  function getCuttedArray(source) {
    var ret = source.slice();
    ret.length = window.utils.getRandomNumber(0, ret.length);
    return ret;
  }

  function generateHotels(amount) {
    var hotels = [];
    for (var i = 0; i < amount; i++) {
      var hotel = {
        author: {
          avatar: 'img/avatars/user' + '0' + window.utils.getRandomNumber(1, 8) + '.png',
        },
        offer: {
          title: titles[window.utils.getRandomNumber(0, titles.length)],
          address: window.utils.getRandomNumber(1, window.innerWidth) + ',' + window.utils.getRandomNumber(130, 630),
          price: window.utils.getRandomNumber(0, 1000000),
          type: hotelTypes[window.utils.getRandomNumber(0, hotelTypes.length)],
          rooms: window.utils.getRandomNumber(1, 4),
          guests: window.utils.getRandomNumber(1, 4),
          checkin: times[window.utils.getRandomNumber(0, times.length)],
          checkout: times[window.utils.getRandomNumber(0, times.length)],
          features: getCuttedArray(features),
          description: descriptions[window.utils.getRandomNumber(0, descriptions.length)],
          photos: getCuttedArray(images),
        },
        location: {
          x: window.utils.getRandomNumber(1, window.innerWidth),
          y: window.utils.getRandomNumber(130, 630),
        },
      };
      hotels.push(hotel);
    }
    return hotels;
  }

  window.data = {
    generateHotels: generateHotels
  };
})();
