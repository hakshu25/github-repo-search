import axios from 'axios';
import { parseLinks } from '../helpers/util';
import Notify from './notify';

const apiUrl = 'https://api.github.com/search/repositories';
const MAX_COUNT = 30;

export default class GithubRepoList {
  constructor() {
    this._all = [];
    this._totalCount = 0;
    this._urls = {};
    this._error = null;
    this.listChanged = new Notify();
    this.totalCountChanged = new Notify();
    this.nextUrlChanged = new Notify();
    this.errorChanged = new Notify();
  }

  async fetchByKeyword(searchKeyword) {
    const requestUrl = `${apiUrl}?q=${searchKeyword}`;
    await axios
      .get(requestUrl)
      .then((res) => {
        this._all = res.data.items;
        this.totalCount = res.data.total_count;
        this.listChanged.execute();
        if (this.totalCount > MAX_COUNT) {
          this.parseLinks(res.headers.link);
        }
      })
      .catch((err) => {
        console.error(err);
        this.error = err;
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
        console.error(err);
        this.error = err;
      });
  }

  get all() {
    return this._all;
  }

  get totalCount() {
    return this._totalCount;
  }

  set totalCount(count) {
    this._totalCount = count;
    this.totalCountChanged.execute();
  }

  get nextUrl() {
    return this._urls.next;
  }

  get error() {
    return this._error;
  }

  set error(err) {
    this._error = err;
    this.errorChanged.execute();
  }

  parseLinks(linkStr) {
    this._urls = parseLinks(linkStr);
    this.nextUrlChanged.execute();
  }
}
