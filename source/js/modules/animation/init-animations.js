import {ParallaxAnimation} from './parallax';
import {IntroAnimation} from './intro-animation';
import {AppearanceAnimation} from './appearance';
import {ScrollSlider} from './scroll-slider';
import {gsap} from '../../vendor/gsap.min';
import Splitting from '../../vendor/splitting.min';

const Animations = {
  'parallax': ParallaxAnimation,
  'intro': IntroAnimation,
  'appearance': AppearanceAnimation,
  'scroll-slider': ScrollSlider,
};

const initAnimations = () => {
  gsap.to(window, {duration: 1, scrollTo: 0});

  Splitting();  //eslint-disable-line
  Splitting({ //eslint-disable-line
    target: '[data-splitting-words]',
    by: 'words',
  });

  let type;

  try {
    const containers = document.querySelectorAll('[data-animation]');
    containers.forEach((container) => {
      type = container.getAttribute('data-animation');
      const animation = new Animations[type](container);
      animation.init();
    });
  } catch (error) {
    console.error(`No actions for animation "${type}" found`); //eslint-disable-line
    console.error(error); //eslint-disable-line
  }
};

export {initAnimations};
