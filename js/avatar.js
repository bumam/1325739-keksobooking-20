'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png'];
  var avatartFileChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var homePhotoFileChooser = document.querySelector('#images');
  var homePhotoPreview = document.querySelector('.ad-form__photo');

  var PHOTO_IMG_WIDTH = 70;
  var PHOTO_IMG_HEIGHT = 70;


  avatartFileChooser.addEventListener('change', function () {
    var file = avatartFileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  homePhotoFileChooser.addEventListener('change', function () {
    var file = homePhotoFileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {

        if (homePhotoPreview.children.length < 1) {
          homePhotoPreview.appendChild(createPicture(reader.result));
        } else {
          homePhotoPreview.querySelector('img').src = reader.result;
        }
      });
      reader.readAsDataURL(file);
    }
  });


  function createPicture(result) {
    var fragment = document.createDocumentFragment();
    var newImg = document.createElement('img');
    newImg.width = PHOTO_IMG_WIDTH;
    newImg.height = PHOTO_IMG_HEIGHT;
    newImg.src = result;
    newImg.alt = 'Фотография жилья';

    fragment.appendChild(newImg);
    return fragment;
  }

})();
