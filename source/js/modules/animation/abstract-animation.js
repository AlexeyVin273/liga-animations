import {resizeObserver} from '../../utils/observers';

export class AbstractAnimation {
  constructor(container) {
    this.container = container;
  }

  init() {
    this._setAnimations = this._setAnimations.bind(this);

    resizeObserver.subscribe(this._setAnimations);
  }

  setTimelines() {
    this.timelines = [];
  }

  setScrollTriggers() {
    this.scrollTriggers = [];
  }

  clearTimelines() {
    this.timelines?.forEach((timeline) => {
      timeline.seek(0).kill();
      timeline = null;
    });

    this.timelines = [];
  }

  clearScrollTriggers() {
    this.scrollTriggers?.forEach((scrollTrigger) => {
      scrollTrigger.kill();
      scrollTrigger = null;
    });

    this.scrollTriggers = [];
  }

  _setAnimations() {
    this.clearTimelines();
    this.clearScrollTriggers();
    this.setTimelines();
    this.setScrollTriggers();
  }
}
