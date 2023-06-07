import {initParallax} from './parallax';
import {initSplitting} from './splitting';
import {initAppearance} from './appearance';
import {initScrollSlider} from './scroll-slider';
import {gsap} from '../../vendor/gsap.min';
import {ScrollToPlugin} from '../../vendor/ScrollToPlugin.min';

gsap.registerPlugin(ScrollToPlugin);

const initAnimations = () => {
  gsap.to(window, {duration: 1, scrollTo: 0});
  initSplitting();
  initParallax();
  initAppearance();
  initScrollSlider();
};

export {initAnimations};
