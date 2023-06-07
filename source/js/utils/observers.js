export class EventObserver {
  constructor() {
    this.observers = [];
    this.fire = this.fire.bind(this);
  }

  subscribe(fn) {
    this.observers.push(fn);
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  fire(data) {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

const resizeObserver = new EventObserver();
const resizeObserverProto = new ResizeObserver(() => setTimeout(() => resizeObserver.fire('resize'), 10));
resizeObserverProto.observe(document.documentElement);

export {resizeObserver};

// везде следует использовать его прим: resizeObserver.subscribe(() => {console.log('asd')})


const clickObserver = new EventObserver();
window.addEventListener('click', clickObserver.fire);
export {clickObserver};

const escapeKeydownObserver = new EventObserver();
window.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    setTimeout(() => escapeKeydownObserver.fire(evt), 0);
  }
});
export {escapeKeydownObserver};
