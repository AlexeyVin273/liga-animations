import {readJSONFile} from '../../utils/fetch';
import {MapFilters} from './map-filters';

let myMap;

const initMap = () => {
  const map = document.querySelector('.map');

  if (!map) {
    return;
  }

  const mapContainer = map.querySelector('.map__container');
  const mapOverlay = map.querySelector('.map__overlay');
  const center = mapContainer.getAttribute('data-map-center').split(', ').map((str) => +str);
  const zoom = mapContainer.getAttribute('data-map-zoom');
  const scrollZoom = mapContainer.hasAttribute('data-map-scrollZoom');
  const clusterMap = mapContainer.hasAttribute('data-map-clusterize');

  window.initMap = () => {
    window.ymaps.ready(() => {
      myMap = new window.ymaps.Map(mapContainer, {
        center,
        zoom,
        controls: [],
        behaviors: ['drag', 'multiTouch'],
      },
      {
        autoFitToViewport: 'always',
      });

      let objectManager = new window.ymaps.ObjectManager({
        clusterize: clusterMap,
        gridSize: 200,
        // preset: 'islands#invertedVioletClusterIcons',
        clusterIconLayout: 'default#pieChart',
        clusterIconPieChartRadius: 30,
        clusterIconPieChartCoreRadius: 15,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: getClusterContentLayout(),
        clusterBalloonPagerType: 'marker',
      });

      setPlacemark();

      const jsonUrl = mapContainer.getAttribute('data-map-pins');
      if (jsonUrl) {
        setPlacemarksFromJson(jsonUrl, objectManager, mapContainer);
      }

      if (scrollZoom) {
        setZoomControl(mapOverlay);
      }

      const mapFilters = new MapFilters(map, updateFilters, objectManager); //eslint-disable-line

      objectManager.clusters.events.add(['mouseenter', 'mouseleave'], (evt) => {
        const objectId = evt.get('objectId');
        if (evt.get('type') === 'mouseenter') {
          objectManager.clusters.setClusterOptions(objectId, {
            clusterIconPieChartRadius: 32,
            clusterIconPieChartCoreRadius: 16,
          });
        } else {
          objectManager.clusters.setClusterOptions(objectId, {
            clusterIconPieChartRadius: 30,
            clusterIconPieChartCoreRadius: 15,
          });
        }
      });
    });
  };
};

const setPlacemark = () => {
  let placemark = new window.ymaps.Placemark([49.627855, 72.855157], {
    balloonContent: 'Здесь живёт кот Василий. Я обитаю по соседству.',
  }, {
    iconLayout: 'default#image',
    iconImageHref: '../img/svg/pin.svg',
    iconImageSize: [55, 74],
    iconImageOffset: [-30, -74],
  });

  myMap.geoObjects.add(placemark);
};

const setPlacemarksFromJson = (jsonUrl, objectManager, mapContainer) => {
  objectManager.objects.options.set({
    iconLayout: getPlacemarkLayout(),
    iconShape: {
      type: 'Rectangle',
      coordinates: [
        [0, 0], [60, 60]
      ],
    },
    balloonLayout: getBalloonLayout(),
    balloonContentLayout: getBalloonContentLayout(),
    balloonShadow: false,
    hideIconOnBalloonOpen: false,
  });

  const placemarks = [];

  readJSONFile(jsonUrl).then((data) => {
    for (let i = 0; i < data.pins.length; ++i) {
      const pin = data.pins[i];
      const placemark = {
        type: 'Feature',
        id: i,
        geometry: {
          type: 'Point',
          coordinates: pin.latLng,
        },
        properties: {
          textHead: pin.textHead,
          title: pin.title,
          address: pin.address,
          imagePath: pin.imagePath,
          imageAlt: pin.imageAlt,
          category: pin.category,
          icon: pin.icon,
        },
        options: {
          iconColor: getRandomColor(),
        },
      };

      placemarks.push(placemark);
    }

    objectManager.add(placemarks);
    myMap.geoObjects.add(objectManager);

    /*
    ** Добавляем hover на метку
    */
    objectManager.objects.events.add(['mouseenter', 'mouseleave'], (evt) => {
      const objectId = evt.get('objectId');
      const placemarkEl = mapContainer.querySelector(`#placemark-${objectId}`);

      if (placemarkEl) {
        placemarkEl.classList[evt.get('type') === 'mouseenter' ? 'add' : 'remove']('is-hover');
      }
    });
  });
};

const getPlacemarkLayout = () => {
  const markup = [
    '<div class="placemark" id=placemark-$[id]>',
    '<div class="placemark__icon">',
    '<svg aria-hidden="true">',
    '<use xlink:href="#$[properties.icon]"></use>',
    '</div>',
    '</div>'
  ];

  return window.ymaps.templateLayoutFactory.createClass(markup.join(''));
};

const getBalloonLayout = () => {
  const markup = [
    '<div class="placemark-balloon">',
    '$[[options.contentLayout]]',
    '</div>'
  ];

  return window.ymaps.templateLayoutFactory.createClass(markup.join(''), {
    build() {
      this.constructor.superclass.build.call(this);
      this._$parent = this.getParentElement();
      this._$element = this._$parent.querySelector('.placemark-balloon');
      this._$closeBtn = this._$element.querySelector('.placemark-balloon__close-btn');
      this.closeBtnCallback = window.ymaps.util.bind(this.onCloseClick, this);
      this._$closeBtn.addEventListener('click', this.closeBtnCallback);
    },
    clear() {
      this._$closeBtn.removeEventListener('click', this.closeBtnCallback);
      this.constructor.superclass.clear.call(this);
    },
    onCloseClick(evt) {
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

  return window.ymaps.templateLayoutFactory.createClass(markup.join(''));
};

const getClusterContentLayout = () => {
  const markup = [
    '<div class=cluster-balloon>',
    '<div class=cluster-balloon__image>',
    '<img src="$[properties.imagePath]" width=300 height=80 alt="$[properties.imageAlt]">',
    '</div>',
    '<div class=cluster-balloon__content>',
    '<span class=cluster-balloon__category>$[properties.textHead]</span>',
    '<p class=cluster-balloon__title>$[properties.title]</p>',
    '<address class=cluster-balloon__address>$[properties.address]</address>',
    '</div>',
    '</div>'
  ];

  return window.ymaps.templateLayoutFactory.createClass(markup.join(''));
};

const setZoomControl = (overlay) => {
  let isCtrlDown = false;

  myMap.behaviors.enable('scrollZoom');

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Control') {
      isCtrlDown = true;
    }
  });

  document.addEventListener('keyup', (evt) => {
    if (evt.key === 'Control') {
      isCtrlDown = false;
    }
  });

  myMap.container.events.add('wheel', (evt) => {
    if (!isCtrlDown) {
      evt.stopPropagation();
      overlay.classList.add('is-active');
      setTimeout(() => {
        overlay.classList.remove('is-active');
      }, 1200);
    }
  });
};

const updateFilters = (objectManager, currentFilter) => {
  objectManager.setFilter((object) => {
    if (currentFilter === 'all') {
      return true;
    }

    return object.properties.category === currentFilter;
  });
};

const getRandomColor = () => {
  const placemarkColors = [
    '#DB425A', '#4C4DA2', '#00DEAD', '#D73AD2',
    '#F8CC4D', '#F88D00', '#AC646C', '#548FB7'
  ];

  return placemarkColors[Math.floor(Math.random() * placemarkColors.length)];
};

export {initMap};
