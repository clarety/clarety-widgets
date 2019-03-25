import axios from 'axios';
import querystring from 'querystring';
import Config from './clarety-config';
import { parseNestedElements } from '../utils/element-utils';

class ClaretyApi {
  static async fetchElements(endpoint) {
    const apiBase = this._apiBase();
    const url = `${apiBase}/explain/?endpoint=${endpoint}`;
    const response = await axios.get(url);

    try {
      return response.data.result[0].elements;
    } catch (error) {
      return null;
    }
  }

  static async post(endpoint, action, data) {
    const postData = parseNestedElements(data);

    const postBody = querystring.stringify({
      action: action,
      data: JSON.stringify([postData]),
    });

    const apiBase = this._apiBase();
    const url = `${apiBase}/${endpoint}/`;
    const response = await axios.post(url, postBody);

    try {
      return response.data.result[0];
    } catch (error) {
      return null;
    }
  }

  static _apiBase() {
    const env = Config.get('env');
    const prefix = env ? env + '-' : '';
    const instanceKey = Config.get('instanceKey') || 'NO_INSTANCE_KEY';
    return `http://${prefix}${instanceKey}.clarety.io/api`;
  }
}

export default ClaretyApi;
