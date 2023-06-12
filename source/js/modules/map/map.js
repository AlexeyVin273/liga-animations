import {readJSONFile} from '../../utils/fetch';

let myMap;

const initMap = () => {
  const mapContainer = document.querySelector('.map__container');
  const center = mapContainer.getAttribute('data-map-center').split(', ').map((str) => +str);
  const zoom = mapContainer.getAttribute('data-map-zoom');

  if (!mapContainer) {
    return;
  }

  window.initMap = () => {
    window.ymaps.ready(() => {
      myMap = new ymaps.Map(mapContainer, {
        center,
        zoom,
        controls: [],
        behaviors: ['drag', 'multiTouch'],
      },
      {
        autoFitToViewport: 'always',
      });

      setPlacemark();

      const jsonUrl = mapContainer.getAttribute('data-map-pins');
      if (jsonUrl) {
        setPlacemarksFromJson(jsonUrl);
      }
    });
  };
};

const setPlacemark = () => {
  let placemark = new ymaps.Placemark([49.627855, 72.855157], {
    hintContent: 'Здесь обитает кот, который добавил карту на эту страницу',
    balloonContent: 'Метка с котом',
  }, {
    iconLayout: 'default#image',
    iconImageHref: '../img/svg/pin.svg',
    iconImageSize: [55, 74],
    iconImageOffset: [-30, -74],
  });

  myMap.geoObjects.add(placemark);
};

const setPlacemarksFromJson = (jsonUrl) => {
  readJSONFile(jsonUrl).then((data) => {
    data.pins.forEach((pin) => {
      const placemark = new ymaps.Placemark(pin.latLng, {
        textHead: pin.textHead,
        title: pin.title,
        address: pin.address,
        imagePath: pin.imagePath,
        imageAlt: pin.imageAlt,
        category: pin.category,
        icon: pin.icon,
      }, {
        iconLayout: 'default#imageWithContent',
        iconImageHref: '',
        iconImageSize: [60, 60],
        iconImageOffset: [-30, -30],
        placemarkType: pin.category,
        iconContentLayout: getPlacemarkLayout(),
        balloonShadow: false,
        balloonLayout: getBalloonLayout(),
        balloonContentLayout: getBalloonContentLayout(),
        hideIconOnBalloonOpen: false,
      });

      myMap.geoObjects.add(placemark);
    });
  });
};

const getPlacemarkLayout = () => {
  const markup = [
    '<div class="placemark">',
    '<div class="placemark__icon">',
    '<svg aria-hidden="true">',
    '<use xlink:href="#$[properties.icon]"></use>',
    '</div>',
    '</div>'
  ];

  return ymaps.templateLayoutFactory.createClass(markup.join(''));
};

const getBalloonLayout = () => {
  const markup = [
    '<div class="placemark-balloon">',
    '$[[options.contentLayout]]',
    '</div>'
  ];

  return ymaps.templateLayoutFactory.createClass(markup.join(''), {
    build: function () {
      this.constructor.superclass.build.call(this);
      this._$parent = this.getParentElement();
      this._$element = this._$parent.querySelector('.placemark-balloon');
      this._$closeBtn = this._$element.querySelector('.placemark-balloon__close-btn');
      this.closeBtnCallback = window.ymaps.util.bind(this.onCloseClick, this);
      this._$closeBtn.addEventListener('click', this.closeBtnCallback);
    },
    clear: function () {
      this._$closeBtn.removeEventListener('click', this.closeBtnCallback);
      this.constructor.superclass.clear.call(this);
    },
    onCloseClick: function (evt) {
      evt.preventDefault();
      this.events.fire('userclose');
    },
  });
};

const getBalloonContentLayout = () => {
  const markup = [
    '<div class="placemark-balloon__inner">',
    '<div class="placemark-balloon__image">',
    '<img src="$[properties.imagePath]" width="130" height="130" alt="$[properties.imageAlt]">',
    '</div>',
    '<div class="placemark-balloon__info">',
    '<p class="placemark-balloon__category">$[properties.textHead]</p>',
    '<p class="placemark-balloon__title">$[properties.title]</p>',
    '<address class="placemark-balloon__address">$[properties.address]</address>',
    '</div>',
    '<button class="placemark-balloon__close-btn">',
    '<svg aria-hidden="true">',
    '<use xlink:href="#icon-close"></use>',
    '</button>',
    '</div>'
  ];

  return ymaps.templateLayoutFactory.createClass(markup.join(''));
};

export {initMap};
