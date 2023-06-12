import {ScrollLock} from '../utils/scroll-lock';
import {gsap} from '../vendor/gsap.min.js';
import {ScrollTrigger} from '../vendor/ScrollTrigger.min.js';
import {resizeObserver} from '../utils/observers';

gsap.registerPlugin(ScrollTrigger);

const setHeaderHeight = () => {
  const headerEl = document.querySelector('.header');

  if (headerEl) {
    const headerHeight = headerEl.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
  }
};

const initHeader = () => {
  setHeaderHeight();

  const headerEl = document.querySelector('.header');

  if (!headerEl) {
    return;
  }

  const scrollLock = new ScrollLock();

  const menuToggle = headerEl.querySelector('.header__toggle');
  const mainNav = headerEl.querySelector('.main-nav');

  menuToggle.addEventListener('click', () => {
    if (menuToggle.classList.contains('is-active')) {
      scrollLock.enableScrolling();
    } else {
      scrollLock.disableScrolling();
    }

    menuToggle.classList.toggle('is-active');
    mainNav.classList.toggle('is-active');
    headerEl.classList.toggle('menu-opened');
  });

  let headerTrigger = null;

  const initHeaderTrigger = () => {
    if (headerTrigger) {
      headerTrigger.kill();
      headerTrigger = null;
    }

    const scrollSlider = document.querySelector('[data-scroll-slider="parent"]');
    const startPos = scrollSlider ? window.innerHeight : 'top';
    const endPos = scrollSlider ? scrollSlider.getBoundingClientRect().top : document.body.offsetHeight;

    headerTrigger = ScrollTrigger.create({
      trigger: headerEl,
      start: `${startPos} top`,
      end: `${endPos} ${headerEl.offsetHeight}`,
      onEnter: () => {
        headerEl.classList.add('bg-active');
      },
      onEnterBack: () => {
        headerEl.classList.add('bg-active');
      },
      onLeaveBack: () => {
        headerEl.classList.remove('bg-active');
      },
      onLeave: () => {
        headerEl.classList.remove('bg-active');
      },
    });
  };

  const introEl = document.querySelector('.intro');

  if (introEl) {
    initHeaderTrigger();
    resizeObserver.subscribe(initHeaderTrigger);
  }
};

export {initHeader};
