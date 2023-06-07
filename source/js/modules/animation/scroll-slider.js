import {gsap} from '../../vendor/gsap.min';
import {ScrollTrigger} from '../../vendor/ScrollTrigger.min';
import {resizeObserver} from '../../utils/observers';

gsap.registerPlugin(ScrollTrigger);

const initScrollSlider = () => {
  let timerId;
  let scrollTriggers = [];

  const clearScrollTriggers = () => {
    scrollTriggers.forEach((scrollTrigger) => {
      scrollTrigger.refresh();
      scrollTrigger.kill();
      scrollTrigger = null;
    });

    scrollTriggers = [];
  };

  const clearActiveSlides = (slides) => {
    slides.forEach((slide) => slide.classList.remove('is-active'));
  };

  const initSlider = () => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      const slides = document.querySelectorAll('[data-scroll-slider="slide"]');
      const slider = document.querySelector('[data-scroll-slider="parent"]');
      const innerHeight = window.innerHeight;
      slider.setAttribute('style', `min-height: ${innerHeight * slides.length}px`);

      clearActiveSlides(slides);
      slides[0].classList.add('is-active');
      clearScrollTriggers();

      scrollTriggers.push(
          ScrollTrigger.create({
            trigger: slider,
            start: 'top bottom',
            onToggle: initSlides(slides, innerHeight),
          })
      );
    }, 0);
  };

  const initSlides = (slides, innerHeight) => {
    slides.forEach((element, i) => {
      scrollTriggers.push(
          ScrollTrigger.create({
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
          })
      );
    });
  };

  initSlider();
  resizeObserver.subscribe(initSlider);
};

export {initScrollSlider};
