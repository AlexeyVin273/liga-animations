import {initParallax} from "./parallax";
import {initSplitting} from "./splitting";

const initAnimations = () => {
  initSplitting();
  initParallax();
};

export {initAnimations};
