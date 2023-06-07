import {gsap} from '../vendor/gsap.min.js';
import {ScrollToPlugin} from '../vendor/ScrollToPlugin.min';

gsap.registerPlugin(ScrollToPlugin);

const initIntro = () => {
  const introEl = document.querySelector('.intro');

  if (!introEl) {
    return;
  }

  const navItems = introEl.querySelectorAll('.intro__nav-item');
  gsap.to(navItems, {
    scale: 1,
    duration: 0.8,
    stagger: 0.05,
    delay: 0.5,
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
      gsap.to(window, {duration: 1, scrollTo: block});
    }
  });
};

export {initIntro};
