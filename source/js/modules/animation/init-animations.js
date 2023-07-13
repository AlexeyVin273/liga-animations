import {ParallaxAnimation} from './parallax';
import {IntroAnimation} from './intro-animation';
import {initSplitting} from './splitting';
import {initAppearance} from './appearance';
import {initScrollSlider} from './scroll-slider';
import {gsap} from '../../vendor/gsap.min';

const initAnimations = () => {
  gsap.to(window, {duration: 1, scrollTo: 0});
  initSplitting();
  initAppearance();
  initScrollSlider();

  const parallaxAnimation = new ParallaxAnimation(document.querySelector('[data-animation="parallax"]'));
  parallaxAnimation.init();
  const introAnimation = new IntroAnimation(document.querySelector('[data-animation="intro"]'));
  introAnimation.init();
};

export {initAnimations};
