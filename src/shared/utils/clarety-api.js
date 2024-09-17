import axios from 'axios';
import Cookies from 'js-cookie';
import { Config } from 'shared/utils/config';
import { getEnv, getDevHost } from 'shared/utils/env';

let _api = null;

export class ClaretyApi {
  static init() {
    // Mock endpoints (must be run before axois create).
    const mockEndpointsFn = Config.get('mockEndpointsFn');
    if (mockEndpointsFn) mockEndpointsFn();

    // Setup axios instance with base url.
    _api = axios.create({
      baseURL: this.getBaseUrl() + '/api/',
      validateStatus: false,
    });

    // Attach jwt to all requests.
    if (Config.get('getJwtFromCookie')) {
      const jwt = Cookies.get('jwt');
      if (!jwt) throw new Error("[ClaretyApi] JWT not found in cookie.");
      _api.defaults.headers.common['Authorization'] = 'bearer ' + jwt;
    }
  }

  static setAuth(jwt) {
    if (!_api) this.init();
    
    _api.defaults.headers.common['Authorization'] = 'bearer ' + jwt;
  }

  static clearAuth() {
    if (!_api) this.init();
    
    delete _api.defaults.headers.common['Authorization'];
  }

  static setHeader(header, value) {
    if (!_api) this.init();
    
    _api.defaults.headers.common[header] = value;
  }

  static clearHeader(header) {
    if (!_api) this.init();
    
    delete _api.defaults.headers.common[header];
  }

  static setJwtSession(jwtSession) {
    this.setHeader('jwtSession', jwtSession);
  }

  static setJwtCustomer(jwtCustomer) {
    this.setHeader('jwtCustomer', jwtCustomer);
  }

  static async auth(email, password, clientId) {
    if (!_api) this.init();

    const data = {
      username: email,
      password: password,
      client_id: clientId,
      grant_type: 'password',
    };

    const authUrl = this.getBaseUrl() + '/jwttoken/';
    const response = await _api.post(authUrl, data);

    if (response.data.access_token) {
      _api.defaults.headers.common['Authorization'] = 'bearer ' + response.data.access_token;
    }

    return response.data;
  }

  static async get(endpoint, params) {
    if (!_api) this.init();

    const response = await _api.get(endpoint, { params });

    this.reloadPageOnJwtError(response);

    return response.data.result;
  }

  static async post(endpoint, data, params) {
    if (!_api) this.init();

    const response = await _api.post(endpoint, data, { params });

    this.reloadPageOnJwtError(response);

    return response.data.result;
  }

  static async put(endpoint, data, params) {
    if (!_api) this.init();

    const response = await _api.put(endpoint, data, { params });

    this.reloadPageOnJwtError(response);

    return response.data.result;
  }

  static async delete(endpoint, params) {
    if (!_api) this.init();

    const response = await _api.delete(endpoint, { params });

    this.reloadPageOnJwtError(response);

    return response.data.result;
  }

  static reloadPageOnJwtError(response) {
    let errors;
    try {
      errors = response.data.result[0].validationErrors;
    } catch (err) {
      // no errors in response.
    }

    if (errors) {
      const jwtError = errors.find(error => error.field === 'jwtSession');
      if (jwtError) location.reload();
    }
  }

  static getBaseUrl() {
    const instanceKey = Config.get('instanceKey');
    if (!instanceKey) throw new Error('[ClaretyApi] "instanceKey" not found in config.');

    // Localhost
    if (window.location.host.includes('localhost')) {
      const protocol = Config.get('localhostProtocol') || 'https:';
      return `${protocol}//${instanceKey}.dev.clarety.io`;
    }
    
    const env = getEnv();
    const devHost = getDevHost();
    const protocol = window.location.protocol;

    if (env === 'dev' && devHost) return `${protocol}//${instanceKey}.dev-${devHost}.clarety.io`;
    if (env === 'dev')            return `${protocol}//${instanceKey}.dev.clarety.io`;
    if (env === 'stage')          return `https://stage-${instanceKey}.clarety.io`;
    if (env === 'test')           return `https://test-${instanceKey}.clarety.io`;

    return `https://${instanceKey}.clarety.io`;
  }
}
