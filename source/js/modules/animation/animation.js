import {initParallax} from './parallax';
import {initSplitting} from './splitting';
import {initAppearance} from './appearance';

const initAnimations = () => {
  initSplitting();
  initParallax();
  initAppearance();
};

export {initAnimations};
