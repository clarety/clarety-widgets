import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import { getCartSuccess, getItemSuccess } from 'cart/mocks';

export function setupCartAxiosMock(){
    const apiBase = ClaretyApi.getApiBaseUrl();

    const cartUid = '8c2756b2-f018-4c27-a025-c31fca7e482b';

    const mock = new MockAdapter(axios, { delayResponse: 500 });

    mock
        .onGet(`${apiBase}carts/${cartUid}/`)
        .reply(200, getCartSuccess);

    mock
        .onPost(`${apiBase}update-cart-item/`)
        .reply(200, getItemSuccess);
}