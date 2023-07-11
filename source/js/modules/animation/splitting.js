import Splitting from '../../vendor/splitting.min';

const initSplitting = () => {
  Splitting();  //eslint-disable-line
  Splitting({ //eslint-disable-line
    target: '[data-splitting-words]',
    by: 'words',
  });
};

export {initSplitting};
