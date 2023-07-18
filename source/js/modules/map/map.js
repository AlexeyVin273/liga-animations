import {YandexMap} from './yandex-map';

export const initMap = () => {
  const mapEl = document.querySelector('[data-map]');
  if (!mapEl) {
    return;
  }

  /**
   * Запускаем загрузку YandexMap API
   */

  const scriptEl = document.createElement('script');
  scriptEl.type = 'text/javascript';
  scriptEl.src = 'https://api-maps.yandex.ru/2.1/?apikey=2d2f5732-4627-41ea-8cfa-e9db03f760b8&lang=ru_RU&onload=window.initMap';
  document.getElementsByTagName('body')[0].appendChild(scriptEl);
};

window.initMap = () => {
  window.ymaps.ready(() => {
    const yandexMap = new YandexMap(window.ymaps);
    yandexMap.init();
  });
};
