import {AbstractAnimation} from './animation/abstract-animation';
import {ScrollLock} from '../utils/scroll-lock';
import {ScrollTrigger} from '../vendor/ScrollTrigger.min.js';

class HeaderAnimation extends AbstractAnimation {
  constructor(container) {
    super(container);
  }

  setScrollTriggers() {
    const container = this.container;

    const scrollSlider = document.querySelector('[data-animation="scroll-slider"]');
    const startPos = scrollSlider ? window.innerHeight : 'top';
    const endPos = document.body.offsetHeight - (scrollSlider ? scrollSlider.offsetHeight : 0);

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: `${startPos} top`,
      end: `${endPos} ${container.offsetHeight}`,
      scrub: false,
      onEnter: () => {
        container.classList.add('bg-active');
      },
      onEnterBack: () => {
        container.classList.add('bg-active');
      },
      onLeaveBack: () => {
        container.classList.remove('bg-active');
      },
      onLeave: () => {
        container.classList.remove('bg-active');
      },
    });

    this.scrollTriggers.push(scrollTrigger);
  }
}

export class Header {
  constructor(headerEl) {
    this.headerEl = headerEl;
  }

  init() {
    if (!this.headerEl) {
      return;
    }

    this.setHeaderHeight();

    this.scrollLock = new ScrollLock();
    this.menuToggle = this.headerEl.querySelector('.header__toggle');
    this.mainNav = this.headerEl.querySelector('.main-nav');

    this.onMenuToggleClick = this.onMenuToggleClick.bind(this);
    this.onEscKeydown = this.onEscKeydown.bind(this);

    this.menuToggle.addEventListener('click', this.onMenuToggleClick);
    document.addEventListener('keydown', this.onEscKeydown);

    if (this.headerEl.classList.contains('header--index')) {
      const headerAnimation = new HeaderAnimation(this.headerEl);
      headerAnimation.init();
    }
  }

  setHeaderHeight() {
    if (this.headerEl) {
      const headerHeight = this.headerEl.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
    }
  }

  openMenu() {
    this.scrollLock.disableScrolling();
    this.menuToggle.classList.add('is-active');
    this.mainNav.classList.add('is-active');
    this.headerEl.classList.add('menu-opened');
  }

  closeMenu() {
    this.scrollLock.enableScrolling();
    this.menuToggle.classList.remove('is-active');
    this.mainNav.classList.remove('is-active');
    this.headerEl.classList.remove('menu-opened');
  }

  onMenuToggleClick() {
    return this.menuToggle.classList.contains('is-active') ? this.closeMenu() : this.openMenu();
  }

  onEscKeydown(evt) {
    if (evt.key === 'Escape' && this.menuToggle.classList.contains('is-active')) {
      evt.stopPropagation();
      this.closeMenu();
    }
  }
}
