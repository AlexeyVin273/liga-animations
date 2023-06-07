const hidePreloader = (callback) => {
  const preloaderEl = document.querySelector('.preloader');
  const intro = document.querySelector('.intro');

  if (!preloaderEl) {
    return;
  }

  preloaderEl.classList.add('is-hidden');
  intro.classList.add('is-shown');
  document.body.classList.remove('scroll-lock-ios');

  setTimeout(() => {
    callback();
  }, 0);
};

export {hidePreloader};
