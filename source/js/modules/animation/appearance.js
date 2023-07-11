import {gsap} from '../../vendor/gsap.min.js';
import {ScrollTrigger} from '../../vendor/ScrollTrigger.min.js';

gsap.registerPlugin(ScrollTrigger);

export const initAppearance = () => {
  ScrollTrigger.batch('[data-appearance="fade"]', {
    start: 'top 80%',
    batchMax: 2,
    onEnter: (batch) => {
      gsap.to(batch, {autoAlpha: 1, overwrite: true});
    },
  });

  ScrollTrigger.batch('[data-appearance="fade-in"]', {
    start: 'top 80%',
    batchMax: 2,
    onEnter: (batch) => {
      gsap.to(batch, {autoAlpha: 1, y: 0, overwrite: true});
    },
  });

  ScrollTrigger.batch('[data-appearance="fade-scale"]', {
    start: 'top 80%',
    batchMax: 2,
    onEnter: (batch) => {
      gsap.to(batch, {autoAlpha: 1, scale: 1, overwrite: true});
    },
  });
};
