import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import { getCartSuccess, getItemSuccess } from 'cart/mocks';

export function setupCartAxiosMock(){
    const apiBase = ClaretyApi.getApiBaseUrl();

    const mock = new MockAdapter(axios, { delayResponse: 500 });

    mock
        .onGet(`${apiBase}cart/`)
        .reply(200, getCartSuccess);

    mock
        .onPost(`${apiBase}update-cart-item/`)
        .reply(200, getItemSuccess);
}