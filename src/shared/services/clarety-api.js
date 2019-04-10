import axios from 'axios';
import Config from './clarety-config';
import { parseNestedElements } from '../utils/element-utils';

class ClaretyApi {
  static async explain(endpoint, params) {
    const apiBase = this._apiBase();
    const url = `${apiBase}/widgets/${endpoint}`;

    try {
      const response = await axios.get(url, { params });
      return response.data.result[0];
    } catch (error) {
      throw new Error(`[Clarety API] Failed to explain endpoint '${endpoint}': ${error.message}`);
    }
  }

  // TEMP: The subscribe explain still uses the old explain endpoint.
  static async __old__explain(endpoint) {
    const apiBase = this._apiBase();
    const url = `${apiBase}/explain/?endpoint=${endpoint}`;

    try {
      const response = await axios.get(url);
      return response.data.result[0];
    } catch (error) {
      throw new Error(`[Clarety API] Failed to explain endpoint '${endpoint}': ${error.message}`);
    }
  }

  static async post(endpoint, data) {
    const postData = parseNestedElements(data);

    const apiBase = this._apiBase();
    const url = `${apiBase}/${endpoint}/`;

    try {
      const response = await axios.post(url, postData);
      return response.data.result[0];
    } catch (error) {
      throw new Error(`[Clarety API] Something went wrong posting data to endpoint '${endpoint}': ${error.message}`);
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
