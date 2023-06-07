import {gsap} from '../../vendor/gsap.min.js';
import {ScrollTrigger} from '../../vendor/ScrollTrigger.min.js';

gsap.registerPlugin(ScrollTrigger);

const initParallax = () => {
  initIntroParallax(document.querySelector('.intro > .container'));

  gsap.to('[data-parallax="fade-scale"]', {
    scrollTrigger: {
      trigger: '.parallax ul',
      start: 'top 90%',
      end: 'top 50%',
      scrub: 1,
    },
    ease: 'power1.inOut',
    scale: 1,
    autoAlpha: 1,
    duration: 3,
  });

  gsap.to('[data-parallax="transform y"]', {
    scrollTrigger: {
      trigger: '.parallax ul',
      start: 'top 90%',
      end: 'top 50%',
      scrub: 1,
    },
    ease: 'power1.inOut',
    y: 0,
    duration: 3,
  });

  gsap.to('[data-parallax="transform x"]', {
    scrollTrigger: {
      trigger: '.parallax ul',
      start: 'top 90%',
      end: 'top 30%',
      scrub: 1,
    },
    ease: 'power1.inOut',
    x: 0,
    duration: 3,
  });
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
