import axios from 'axios';
import { Config } from 'clarety-utils';
import { parseNestedElements } from 'shared/utils';

export class ClaretyApi {
  static async explain(endpoint, params) {
    const apiBase = this._apiBase();
    const url = `${apiBase}/widgets/${endpoint}/`;

    try {
      const response = await axios.get(url, { params });
      return response.data.result[0];
    } catch (error) {
      throw new Error(`[Clarety API] Failed to explain endpoint '${endpoint}': ${error.message}`);
    }
  }

  static async post(endpoint, data) {
    const apiBase = this._apiBase();
    const url = `${apiBase}/${endpoint}/`;

    const postData = parseNestedElements(data);

    try {
      const response = await axios.post(url, postData);
      return response.data.result[0];
    } catch (error) {
      throw new Error(`[Clarety API] Something went wrong posting data to endpoint '${endpoint}': ${error.message}`);
    }
  }

  static _apiBase() {
    const env = this._getEnv();
    const protocol = env === 'dev' ? 'http': 'https';
    const prefix = env === 'prod' ?  '' : env + '-';
    const instanceKey = Config.get('instanceKey') || 'NO_INSTANCE_KEY';
    return `${protocol}://${prefix}${instanceKey}.clarety.io/api`;
  }

  static _getEnv() {
    const url = window.location.href;
    if (url.startsWith('http://localhost')) return 'dev';
    if (url.startsWith('http://dev-'))      return 'dev';
    if (url.startsWith('https://test-'))    return 'test';
    if (url.startsWith('https://stage-'))   return 'stage';
  
    return 'prod';
  }
}
