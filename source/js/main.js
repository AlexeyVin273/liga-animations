import {iosVhFix} from './utils/ios-vh-fix';
import {Header} from './modules/header';
import {initIntro} from './modules/intro';
import {initAnimations} from './modules/animation/init-animations';
import {hidePreloader} from './modules/preloader';
import {initMap} from './modules/map/map';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------
  const header = new Header(document.querySelector('.header'));
  header.init();
  initAnimations();

  window.addEventListener('load', () => {
    setTimeout(() => {
      hidePreloader(initIntro);
    }, 0);

    initMap();
  });
});
