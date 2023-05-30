import {gsap} from '../vendor/gsap.min.js';

const initIntro = () => {
  const introEl = document.querySelector('.intro');

  if (!introEl) {
    return;
  }

  const moveTo = new window.MoveTo();

  const navItems = introEl.querySelectorAll('.intro__nav-item');
  gsap.to(navItems, {
    scale: 1,
    duration: 0.8,
    stagger: 0.05,
    ease: 'power4.out',
  });

  const navList = introEl.querySelector('.intro__nav-list');
  navList.addEventListener('click', (evt) => {
    const link = evt.target.closest('[data-move-to]');

    if (!link) {
      return;
    }

    evt.preventDefault();

    const block = document.querySelector(`${link.getAttribute('data-move-to')}`);
    if (block) {
      moveTo.move(block, {
        tolerance: 0,
        duration: 800,
        easing: 'easeOutQuart',
        container: window,
      });
    }
  });
};

export {initIntro};
