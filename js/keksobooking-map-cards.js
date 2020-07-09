'use strict';

(function () {
  var PHOTO_IMG_WIDTH = 45;
  var PHOTO_IMG_HEIGHT = 40;
  var map = document.documentElement.querySelector('.map');
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

  function createCards(array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      var card = cardTemplate.cloneNode(true);
      var offer = array[i].offer;
      card.querySelector('.popup__avatar').src = array[i].author.avatar;
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
      card.querySelectorAll('li:empty').forEach(function (element) {
        element.remove();
      });

      card.querySelectorAll('li:empty').forEach(function (element) {
        element.remove();
      });

      fragment.appendChild(card);
    }
    return fragment;
  }

  function showCard(event) {
    var cards = document.querySelectorAll('.map__card');
    hideActiveCard();

    if (event.target.dataset.pinId !== undefined) {
      window.pin.removeActivePin();
      event.target.classList.add('map__pin--active');
      cards[event.target.dataset.pinId].classList.remove('hidden');
      cards[event.target.dataset.pinId].classList.add('map__card--active');

      map.addEventListener('click', closeOffer);
      document.addEventListener('keydown', closeOffer);
    }
  }

  function hideCards() {
    var cards = map.querySelectorAll('.popup');
    cards.forEach(function (elem) {
      if (elem.classList.contains('.hidden') !== true) {
        elem.classList.add('hidden');
      }
    });
  }

  function hideActiveCard() {
    var card = document.querySelector('.map__card--active');
    if (card) {
      card.classList.add('hidden');
      card.classList.remove('map__card--active');
    }
  }

  function closeOffer(event) {
    if (
      event.type === 'keydown' && event.keyCode === 27 ||
      event.type === 'click' && event.target.classList.contains('popup__close')
    ) {
      window.pin.removeActivePin();
      hideActiveCard();
      map.removeEventListener('click', closeOffer);
      document.removeEventListener('keydown', closeOffer);
    }
  }

  window.card = {
    createCards: createCards,
    hideCards: hideCards,
    showCard: showCard,
  };
})();
