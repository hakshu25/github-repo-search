export default class Notify {
  constructor() {
    this.handlers = [];
  }

  observe(handler) {
    this.handlers.push(handler);
  }

  execute() {
    this.handlers.forEach((h) => h());
  }
}
