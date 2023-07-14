import {ScrollTrigger} from '../../vendor/ScrollTrigger.min';
import {AbstractAnimation} from './abstract-animation';

export class ScrollSlider extends AbstractAnimation {
  constructor(container) {
    super(container);
  }

  setScrollTriggers() {
    const container = this.container;

    this.clearActiveSlides();
    const slides = container.querySelectorAll('[data-scroll-slider="slide"]');
    slides[0]?.classList.add('is-active');

    const innerHeight = window.innerHeight;
    container.setAttribute('style', `min-height: ${innerHeight * slides.length}px`);

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      onToggle: this.setSlidesTriggers(slides, innerHeight),
    });

    this.scrollTriggers.push(scrollTrigger);
  }

  clearActiveSlides() {
    const activeSlides = this.container.querySelectorAll('[data-scroll-slider="slide"].is-active');
    activeSlides.forEach((slide) => slide.classList.remove('is-active'));
  }

  setSlidesTriggers(slides, innerHeight) {
    slides.forEach((element, i) => {
      const scrollTrigger = ScrollTrigger.create({
        trigger: element,
        start: `${i * innerHeight} 30%`,
        end: `${(i + 1) * innerHeight} 30%`,
        onEnter: () => {
          element.classList.add('is-active');
        },
        onLeave: () => {
          element.classList.remove('is-active');
        },
        onEnterBack: () => {
          element.classList.add('is-active');
        },
        onLeaveBack: () => {
          if (element !== slides[0]) {
            element.classList.remove('is-active');
          }
        },
      });

      this.scrollTriggers.push(scrollTrigger);
    });
  }
}
