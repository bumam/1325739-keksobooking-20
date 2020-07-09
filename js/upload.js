'use strict';
(function () {
  var URL = 'https://javascript.pages.academy/keksobooking';

  function onError(message) {
    console.error(message);
  };

  window.upload = function (data, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onSuccess(xhr.status);
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.open('POST', URL);
    xhr.send(data);
  };

})();
