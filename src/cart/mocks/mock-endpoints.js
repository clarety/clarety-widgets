import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import { getCartSuccess, updateCartItemSuccess } from 'cart/mocks';

export function setupCartAxiosMock(){
    const apiBase = ClaretyApi.getApiBaseUrl();

    const cartUid = '8c2756b2-f018-4c27-a025-c31fca7e482b';
    const cartItemUid = '9875654';
    const cartItemUidAlt = '9875655';

    const mock = new MockAdapter(axios, { delayResponse: 500 });

    mock.onGet(`${apiBase}carts/${cartUid}/`)
        .reply(200, getCartSuccess);

    mock.onPut(`${apiBase}carts/${cartUid}/items/${cartItemUid}/`)
        .reply(200, updateCartItemSuccess);

    mock.onPut(`${apiBase}carts/${cartUid}/items/${cartItemUidAlt}/`)
        .reply(200, updateCartItemSuccess);
}
