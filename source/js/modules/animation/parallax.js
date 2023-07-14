import {AbstractAnimation} from './abstract-animation.js';
import {gsap} from '../../vendor/gsap.min.js';
import {ScrollTrigger} from '../../vendor/ScrollTrigger.min.js';

export class ParallaxAnimation extends AbstractAnimation {
  constructor(container) {
    super(container);
  }

  setTimelines() {
    this._setFadeOutAnimation(this.container);
    this._setTransformYAnimation(this.container);
    this._setTransformXAnimation(this.container);
  }

  _setFadeOutAnimation(container) {
    const fadeScaleTl = gsap.timeline({
      paused: true,
    });

    fadeScaleTl.to('[data-parallax="fade-scale"]', {
      scale: 1,
      autoAlpha: 1,
      duration: 3,
    });

    this.scrollTriggers.push(
        ScrollTrigger.create({
          trigger: container,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1,
          animation: fadeScaleTl,
        })
    );

    this.timelines.push(fadeScaleTl);
  }

  _setTransformYAnimation(container) {
    const transformTl = gsap.timeline({
      paused: true,
    });

    transformTl.to('[data-parallax="transform y"]', {
      y: 0,
      duration: 3,
    });

    this.scrollTriggers.push(
        ScrollTrigger.create({
          trigger: container,
          start: 'top 90%',
          end: 'top 40%',
          scrub: 1,
          animation: transformTl,
        })
    );

    this.timelines.push(transformTl);
  }

  _setTransformXAnimation(container) {
    const transformTl = gsap.timeline({
      paused: true,
    });

    transformTl.to('[data-parallax="transform x"]', {
      x: 0,
      duration: 3,
    });

    this.scrollTriggers.push(
        ScrollTrigger.create({
          trigger: container,
          start: 'top 90%',
          end: 'top 30%',
          scrub: 1,
          animation: transformTl,
        })
    );

    this.timelines.push(transformTl);
  }
}
