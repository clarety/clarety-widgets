import axios from 'axios';
import querystring from 'querystring';
import Config from './clarety-config';
import { parseNestedElements } from '../utils/element-utils';

class ClaretyApi {
  static async explain(endpoint) {
    const apiBase = this._apiBase();
    const url = `${apiBase}/explain/?endpoint=${endpoint}`;

    try {
      const response = await axios.get(url);
      return response.data.result[0];
    } catch (error) {
      throw new Error(`[Clarety API] Failed to explain endpoint '${endpoint}': ${error.message}`);
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

    try {
      const response = await axios.post(url, postBody);
      return response.data.result[0];
    } catch (error) {
      throw new Error(`[Clarety API] Something went wrong posting data to endpoint '${endpoint}' w/ action '${action}': ${error.message}`);
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
