import {AbstractAnimation} from './abstract-animation.js';
import {gsap} from '../../vendor/gsap.min.js';
import {ScrollTrigger} from '../../vendor/ScrollTrigger.min.js';

export class IntroAnimation extends AbstractAnimation {
  constructor(container) {
    super(container);
  }

  setTimelines() {
    const container = this.container;
    const introTl = gsap.timeline({
      paused: true,
    });

    introTl.to(container.querySelector('.container'), {
      scale: 0.75,
      opacity: 0.5,
      rotateX: '5deg',
      y: '-10vh',
      duration: 3,
    });

    this.scrollTriggers.push(
        ScrollTrigger.create({
          trigger: container,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: 1,
          animation: introTl,
        })
    );

    this.timelines.push(introTl);
  }
}
