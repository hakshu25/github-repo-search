import axios from 'axios';
import { parseLinks } from '../helpers/util';

const apiUrl = 'https://api.github.com/search/repositories';
const MAX_COUNT = 30;

export default class GithubRepoList {
  constructor() {
    this._all = [];
    this._totalCount = 0;
    this._urls = {};
    this._error = null;
  }

  async fetchByKeyword(searchKeyword) {
    const requestUrl = `${apiUrl}?q=${searchKeyword}`;
    await axios
      .get(requestUrl)
      .then((res) => {
        this._all = res.data.items;
        this._totalCount = res.data.total_count;
        if (this.totalCount > MAX_COUNT) {
          this.parseLinks(res.headers.link);
        }
      })
      .catch((err) => {
        console.error(err);
        this._error = err;
      });
  }

  async fetchNext() {
    await axios
      .get(this.nextUrl)
      .then((res) => {
        this._all.push(...res.data.items);
        this.parseLinks(res.headers.link);
      })
      .catch((err) => {
        console.error(err);
        this._error = err;
      });
  }

  get all() {
    return this._all;
  }

  get totalCount() {
    return this._totalCount;
  }

  get nextUrl() {
    return this._urls.next;
  }

  get error() {
    return this._error;
  }

  parseLinks(linkStr) {
    this._urls = parseLinks(linkStr);
  }
}
