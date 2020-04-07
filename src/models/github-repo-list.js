import axios from 'axios';
import { parseLinks } from '../helpers/util';
import Notify from './notify';

const apiUrl = 'https://api.github.com/search/repositories';
const MAX_COUNT = 30;

export default class GithubRepoList {
  constructor() {
    this._all = [];
    this._pagingUrls = {};
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
        this.save(data.items);

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
        this.update(res.data.items);
        this.parseLinks(res.headers.link);
      })
      .catch((err) => {
        this.dispatchError(err);
      });
  }

  save(list) {
    this._all = list;
    this.listChanged.execute();
  }

  update(list) {
    this._all = this._all.concat(list);
    this.listChanged.execute();
  }

  parseLinks(linkStr) {
    this._pagingUrls = parseLinks(linkStr);
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
    return this._pagingUrls.next;
  }

  get isError() {
    return this._isError;
  }
}
