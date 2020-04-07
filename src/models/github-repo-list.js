import axios from 'axios';
import { parseLinks } from '../helpers/util';
import Notify from './notify';

const apiUrl = 'https://api.github.com/search/repositories';
const MAX_COUNT = 30;

export default class GithubRepoList {
  constructor() {
    this._all = [];
    this._urls = {};
    this._isError = false;
    this.listChanged = new Notify();
    this.nextUrlChanged = new Notify();
    this.isErrorChanged = new Notify();
  }

  async fetchByKeyword(searchKeyword) {
    this.clearError();

    const requestUrl = `${apiUrl}?q=${searchKeyword}`;
    await axios
      .get(requestUrl)
      .then((res) => {
        const data = res.data;
        this._all = data.items;
        this.listChanged.execute();
        if (data.total_count > MAX_COUNT) {
          this.parseLinks(res.headers.link);
        }
      })
      .catch((err) => {
        this.dispatchError(err);
      });
  }

  async fetchNext() {
    await axios
      .get(this.nextUrl)
      .then((res) => {
        this._all.push(...res.data.items);
        this.listChanged.execute();
        this.parseLinks(res.headers.link);
      })
      .catch((err) => {
        this.dispatchError(err);
      });
  }

  parseLinks(linkStr) {
    this._urls = parseLinks(linkStr);
    this.nextUrlChanged.execute();
  }

  clearError() {
    this._isError = false;
  }

  dispatchError(err) {
    console.error(err);
    this._isError = true;
    this.isErrorChanged.execute();
  }

  get all() {
    return this._all;
  }

  get nextUrl() {
    return this._urls.next;
  }

  get isError() {
    return this._isError;
  }
}
