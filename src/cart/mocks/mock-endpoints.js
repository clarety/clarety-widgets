import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import { getCartSuccess } from 'cart/mocks';

export function setupCartAxiosMock(){
    const apiBase = ClaretyApi.getApiBaseUrl();

    const mock = new MockAdapter(axios, { delayResponse: 2000 });

    mock.onGet(`${apiBase}sale/`).reply(200, getCartSuccess);
}