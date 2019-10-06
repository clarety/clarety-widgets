import React from 'react';
import { render } from 'react-dom';
import Cookies from 'js-cookie';
import { Config } from '../../src';
import SubscribeDemo from './SubscribeDemo';
import DonatePageDemo from './DonatePageDemo';
import DonateDemo from './DonateDemo';
import RegistrationsDemo from './RegistrationsDemo';
import CheckoutDemo from './CheckoutDemo';
import CartDemo from './CartDemo';

Config.init({
  instanceKey: 'clarety-baseline',
  phoneCountry: 'AU',

  storeId: 0,
  seriesId: 0,
});

// Mock JWT session.
Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjYXJ0VWlkIjoiOGMyNzU2YjItZjAxOC00YzI3LWEwMjUtYzMxZmNhN2U0ODJiIn0.WDXbbj84bUH7zGVNEEeSK1VwuEfBY8Lt6stiEr6Yhek');

const Demo = () => {
  const url = window.location.href;

  if (url.endsWith('subscribe'))     return <SubscribeDemo />;
  if (url.endsWith('donate-page'))   return <DonatePageDemo />;
  if (url.endsWith('donate'))        return <DonateDemo />;
  if (url.endsWith('registrations')) return <RegistrationsDemo />;
  if (url.endsWith('checkout'))      return <CheckoutDemo />;
  if (url.endsWith('cart'))          return <CartDemo />;

  return (
    <div className="list-group m-5">
      <a href="subscribe" className="list-group-item list-group-item-action">Subscribe Widget Demo</a>
      <a href="donate" className="list-group-item list-group-item-action">Donate Widget Demo</a>
      <a href="donate-page" className="list-group-item list-group-item-action">Donate Page Demo</a>
      <a href="registrations" className="list-group-item list-group-item-action">Registrations Demo</a>
      <a href="checkout" className="list-group-item list-group-item-action">Checkout Demo</a>
      <a href="cart" className="list-group-item list-group-item-action">Cart Demo</a>
    </div>
  );
};

render(<Demo />, document.querySelector('#demo'));
