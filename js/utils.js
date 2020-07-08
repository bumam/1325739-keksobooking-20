'use strict';

(function () {

  window.utils = {
    getRandomNumber: function (min, max) {
      return min + Math.floor(Math.random() * (max - min));
    }
  };
})();
