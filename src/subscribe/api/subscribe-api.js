import axios from 'axios';
import querystring from 'querystring';
import Config from '../utils/clarety-config';
import { parseNestedElements } from '../utils/element-utils';

const explainPath = '/explain/?endpoint=subscribe';
const subscribePath = '/subscribe/';

class SubscribeApi {
  static async fetchElements() {
    const endpoint = this._apiBase() + explainPath;
    const response = await axios.get(endpoint);

    try {
      return response.data.result[0].elements;
    } catch (error) {
      return null;
    }
  }

  static async subscribe(formData) {
    const postData = parseNestedElements(formData);

    const postBody = querystring.stringify({
      action: 'subscribe',
      data: JSON.stringify([postData]),
    });

    const endpoint = this._apiBase() + subscribePath;
    const response = await axios.post(endpoint, postBody);

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

export default SubscribeApi;
