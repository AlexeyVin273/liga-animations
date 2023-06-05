import {initParallax} from './parallax';
import {initSplitting} from './splitting';
import {initAppearance} from './appearance';
import {initScrollSlider} from './scroll-slider';

const initAnimations = () => {
  initSplitting();
  initParallax();
  initAppearance();
  initScrollSlider();
};

export {initAnimations};
