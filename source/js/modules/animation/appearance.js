import {gsap} from '../../vendor/gsap.min.js';
import {ScrollTrigger} from '../../vendor/ScrollTrigger.min.js';
import {AbstractAnimation} from './abstract-animation.js';

export class AppearanceAnimation extends AbstractAnimation {
  constructor(container) {
    super(container);
  }

  setScrollTriggers() {
    const fadeTriggers = ScrollTrigger.batch('[data-appearance="fade"]', {
      start: 'top 80%',
      batchMax: 2,
      onEnter: (batch) => {
        gsap.to(batch, {autoAlpha: 1, overwrite: true});
      },
    });

    const fadeInTriggers = ScrollTrigger.batch('[data-appearance="fade-in"]', {
      start: 'top 80%',
      end: 'bottom 30%',
      batchMax: 2,
      onEnter: (batch) => {
        gsap.to(batch, {autoAlpha: 1, y: 0, overwrite: true});
      },
    });

    const fadeScaleTriggers = ScrollTrigger.batch('[data-appearance="fade-scale"]', {
      start: 'top 80%',
      end: 'bottom 30%',
      batchMax: 2,
      onEnter: (batch) => {
        gsap.to(batch, {autoAlpha: 1, scale: 1, overwrite: true});
      },
    });

    this.scrollTriggers = fadeTriggers.concat(fadeInTriggers).concat(fadeScaleTriggers);
  }
}
