import axios from 'axios';
import { ClaretyConfig } from '.';
import { parseNestedElements } from '../utils';

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
    const env = ClaretyConfig.env();
    const protocol = env === 'dev' ? 'http': 'https';
    const prefix = env === 'prod' ?  '' : env + '-';
    const instanceKey = ClaretyConfig.get('instanceKey') || 'NO_INSTANCE_KEY';
    return `${protocol}://${prefix}${instanceKey}.clarety.io/api`;
  }
}
