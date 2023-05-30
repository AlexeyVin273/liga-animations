import Splitting from '../../vendor/splitting.min';

const initSplitting = () => {
  Splitting();
  Splitting({
    target: '[data-splitting-words]',
    by: 'words',
  });
};

export {initSplitting};
