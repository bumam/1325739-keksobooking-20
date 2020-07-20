'use strict';

(function () {
  var PHOTO_IMG_WIDTH = 45;
  var PHOTO_IMG_HEIGHT = 40;
  var map = document.querySelector('.map');
  var cardTemplate = document.querySelector('#card').content;

  function createPhotos(array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      var newImg = document.createElement('img');
      newImg.width = PHOTO_IMG_WIDTH;
      newImg.height = PHOTO_IMG_HEIGHT;
      newImg.src = array[i];
      newImg.alt = 'Фотография жилья';
      fragment.appendChild(newImg);
    }
    return fragment;
  }

  function create(item) {
    var fragment = document.createDocumentFragment();
    var card = cardTemplate.cloneNode(true);
    var offer = item.offer;
    card.querySelector('.popup__avatar').src = item.author.avatar;
    card.querySelector('.popup__title').textContent = offer.title;
    card.querySelector('.popup__text--address').textContent = offer.address;
    card.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';

    card.querySelector('.popup__type').textContent = window.form.getTypeLabel(offer.type);

    card.querySelector('.popup__text--capacity').textContent =
      offer.rooms + ' ' + 'комнаты для' + ' ' + offer.guests + ' ' + 'гостей';
    card.querySelector('.popup__text--time').textContent =
      'Заезд после' + ' ' + offer.checkin + ', выезд до' + ' ' + offer.checkout;

    for (var j = 0; j < offer.features.length; j++) {
      card.querySelector('.popup__feature--' + offer.features[j]).textContent = offer.features[j];
    }

    card.querySelector('.popup__description').textContent = offer.description;

    var cardPhotos = card.querySelector('.popup__photos');
    cardPhotos.innerHTML = '';

    cardPhotos.appendChild(createPhotos(offer.photos));
    card.querySelectorAll('li:empty').forEach(function (elementent) {
      elementent.remove();
    });

    card.querySelectorAll('li:empty').forEach(function (elementent) {
      elementent.remove();
    });

    fragment.appendChild(card);

    return fragment;
  }

  function remove() {
    var card = map.querySelector('.popup');
    if (card) {
      card.remove();
    }
  }

  function closeOffer(evt) {
    if (
      evt.type === 'keydown' && evt.keyCode === 27 ||
      evt.type === 'click' && evt.target.classList.contains('popup__close')
    ) {
      window.pin.remove();
      remove();
      map.removeEventListener('click', closeOffer);
      document.removeEventListener('keydown', closeOffer);
    }
  }

  window.card = {
    create: create,
    remove: remove,
    closeOffer: closeOffer,
  };
})();
