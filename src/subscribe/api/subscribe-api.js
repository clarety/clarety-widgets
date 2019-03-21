import axios from 'axios';
import querystring from 'querystring';
import { parseNestedElements } from '../utils/element-utils';

const baseUrl = 'http://dev-clarety-baseline.clarety.io/api';
const explainEndpoint   = baseUrl + '/explain/?endpoint=subscribe';
const subscribeEndpoint = baseUrl + '/subscribe/';

class SubscribeApi {
  static async fetchElements() {
    const response = await axios.get(explainEndpoint);

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

    const response = await axios.post(subscribeEndpoint, postBody);

    try {
      return response.data.result[0];
    } catch (error) {
      return null;
    }
  }
}

export default SubscribeApi;
