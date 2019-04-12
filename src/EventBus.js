class EventBus {
  constructor() {
    this._events = {};
  }

  on(name, handler) {
    this._events[name] = this._events[name] || [];
    this._events[name].push(handler);
  }

  off(name, handler) {
    if (!this._events[name]) return;
    this._events[name] = this._events[name].filter(h => h !== handler);
  }

  emit(name, data) {
    if (!this._events[name]) return;
    this._events[name].forEach(h => h(data));
  }
}

const eventBus = new EventBus();
export default eventBus;
