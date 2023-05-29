import {ScrollLock} from '../utils/scroll-lock';

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
};

export {initHeader};
