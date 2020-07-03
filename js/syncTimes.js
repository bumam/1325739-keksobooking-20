'use strict';

(function () {
  function syncCheckinTimes() {
    document.querySelector('.ad-form__element--time').addEventListener('change', function (event) {
      document.querySelector('#timein').value = event.target.value;
      document.querySelector('#timeout').value = event.target.value;
    });
  }
  window.syncTimes = {
    syncCheckinTimes: syncCheckinTimes
  };
})();
