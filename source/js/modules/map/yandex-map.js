import {readJSONFile, getRandomColor} from '../../utils/utils';
import {MapFilters} from './map-filters';

export class YandexMap {
  constructor(ymaps) {
    this.ymaps = ymaps;
    this.factory = ymaps.templateLayoutFactory;
    this.map = document.querySelector('[data-map]');
  }

  init() {
    if (!this.map) {
      return;
    }

    this.mapContainer = this.map.querySelector('[data-map-container]');
    const mapOverlay = this.map.querySelector('.map__overlay');
    const center = this.mapContainer.getAttribute('data-map-center').split(', ').map((str) => +str);
    const zoom = this.mapContainer.getAttribute('data-map-zoom');
    const scrollZoom = this.mapContainer.hasAttribute('data-map-scrollZoom');
    const isClusterized = this.mapContainer.hasAttribute('data-map-clusterize');

    this._yandexMap = new this.ymaps.Map(this.mapContainer, {
      center,
      zoom,
      controls: [],
      behaviors: ['drag', 'multiTouch'],
    },
    {
      autoFitToViewport: 'always',
    });

    this.initObjectManager(isClusterized);
    this.setHomePlacemark();

    const jsonUrl = this.mapContainer.getAttribute('data-map-pins');
    if (jsonUrl) {
      this.setPlacemarksFromJson(jsonUrl);
    }

    if (scrollZoom) {
      this.setZoomControl(mapOverlay);
    }

    const mapFilters = new MapFilters(this.map, this.updateFilters, this.objectManager); //eslint-disable-line
  }

  initObjectManager(isClusterized) {
    this.objectManager = new this.ymaps.ObjectManager({
      clusterize: isClusterized,
      gridSize: 200,
      clusterIconLayout: 'default#pieChart',
      clusterIconPieChartRadius: 30,
      clusterIconPieChartCoreRadius: 15,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      clusterBalloonContentLayout: 'cluster#balloonCarousel',
      clusterBalloonItemContentLayout: this.getClusterContentLayout(),
      clusterBalloonPagerType: 'marker',
    });

    this.objectManager.clusters.events.add(['mouseenter', 'mouseleave'], (evt) => {
      const objectId = evt.get('objectId');
      if (evt.get('type') === 'mouseenter') {
        this.objectManager.clusters.setClusterOptions(objectId, {
          clusterIconPieChartRadius: 32,
          clusterIconPieChartCoreRadius: 16,
        });
      } else {
        this.objectManager.clusters.setClusterOptions(objectId, {
          clusterIconPieChartRadius: 30,
          clusterIconPieChartCoreRadius: 15,
        });
      }
    });
  }

  getClusterContentLayout() {
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

    return this.factory.createClass(markup.join(''));
  }

  setHomePlacemark() {
    let placemark = new this.ymaps.Placemark([49.627855, 72.855157], {
      balloonContent: 'Здесь живёт кот Василий. Я обитаю по соседству.',
    }, {
      iconLayout: 'default#image',
      iconImageHref: '../img/svg/pin.svg',
      iconImageSize: [55, 74],
      iconImageOffset: [-30, -74],
    });

    this._yandexMap.geoObjects.add(placemark);
  }

  setPlacemarksFromJson(jsonUrl) {
    this.objectManager.objects.options.set({
      iconLayout: this.getPlacemarkLayout(),
      iconShape: {
        type: 'Rectangle',
        coordinates: [
          [0, 0], [60, 60]
        ],
      },
      balloonLayout: this.getBalloonLayout(),
      balloonContentLayout: this.getBalloonContentLayout(),
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

      this.objectManager.add(placemarks);
      this._yandexMap.geoObjects.add(this.objectManager);

      /*
      ** Добавляем hover на метку
      */
      this.objectManager.objects.events.add(['mouseenter', 'mouseleave'], (evt) => {
        const objectId = evt.get('objectId');
        const placemarkEl = this.mapContainer.querySelector(`#placemark-${objectId}`);

        if (placemarkEl) {
          placemarkEl.classList[evt.get('type') === 'mouseenter' ? 'add' : 'remove']('is-hover');
        }
      });
    });
  }


  getPlacemarkLayout() {
    const markup = [
      '<div class="placemark" id=placemark-$[id]>',
      '<div class="placemark__icon">',
      '<svg aria-hidden="true">',
      '<use xlink:href="img/stack.svg#$[properties.icon]"></use>',
      '</div>',
      '</div>'
    ];

    return this.factory.createClass(markup.join(''));
  }

  getBalloonLayout() {
    const markup = [
      '<div class="placemark-balloon">',
      '$[[options.contentLayout]]',
      '</div>'
    ];

    return this.factory.createClass(markup.join(''), {
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
  }

  getBalloonContentLayout() {
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
      '<use xlink:href="img/stack.svg#icon-close"></use>',
      '</button>',
      '</div>'
    ];

    return this.factory.createClass(markup.join(''));
  }

  setZoomControl(overlay) {
    let isCtrlDown = false;

    this._yandexMap.behaviors.enable('scrollZoom');

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

    this._yandexMap.container.events.add('wheel', (evt) => {
      if (!isCtrlDown) {
        evt.stopPropagation();
        overlay.classList.add('is-active');
        setTimeout(() => {
          overlay.classList.remove('is-active');
        }, 1200);
      }
    });
  }

  updateFilters(objectManager, currentFilter) {
    objectManager.setFilter((object) => {
      if (currentFilter === 'all') {
        return true;
      }

      return object.properties.category === currentFilter;
    });
  }
}
