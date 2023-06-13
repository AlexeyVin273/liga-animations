export class MapFilters {
  constructor(map, cb, ...args) {
    this._cb = cb;
    this._args = args;
    this._mapFilters = map.querySelector('.map__filters');
    this._currentFilter = 'all';

    if (this._mapFilters) {
      this._onFilterItemClicked = this._onFilterItemClicked.bind(this);
      this._mapFilters.addEventListener('click', this._onFilterItemClicked);
    }
  }

  _onFilterItemClicked(evt) {
    const filterItem = evt.target.closest('[data-map-filter]');
    if (!filterItem) {
      return;
    }

    this._clearActiveItems();
    this._setItemActive(filterItem);

    this._currentFilter = filterItem.getAttribute('data-map-filter');
    setTimeout(() => {
      this._cb(...this._args, this._currentFilter);
    }, 0);
  }

  _clearActiveItems() {
    const activeItems = this._mapFilters.querySelectorAll('[data-map-filter].is-active');
    activeItems.forEach((item) => item.classList.remove('is-active'));
  }

  _setItemActive(item) {
    item.classList.add('is-active');
  }
}
