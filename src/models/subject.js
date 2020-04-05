import _ from 'lodash';

export default class Subject {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    _.remove(this._observers, (v) => _.isEqual(observer, v));
  }

  notifyObservers() {
    this._observers.forEach((observer) => {
      observer.notify(this);
    });
  }

  get observers() {
    return this._observers;
  }
}
