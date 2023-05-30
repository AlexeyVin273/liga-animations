import {gsap} from '../../vendor/gsap.min.js';
import {ScrollTrigger} from '../../vendor/ScrollTrigger.min.js';

gsap.registerPlugin(ScrollTrigger);

const initParallax = () => {
  initIntroParallax(document.querySelector('.intro > .container'));
};

const initIntroParallax = (container) => {
  if (!container) {
    return;
  }

  const intro = document.querySelector('.intro');
  gsap.to(container, {
    scrollTrigger: {
      trigger: intro,
      start: 'bottom bottom',
      end: 'bottom top',
      scrub: 1,
    },
    scale: 0.75,
    opacity: 0.5,
    rotateX: '5deg',
    y: '-10vh',
    duration: 3,
  });
};

export {initParallax};
