import React from 'react';
import { render } from 'react-dom';
import Cookies from 'js-cookie';
import { Config } from '../../src';
import SubscribeDemo from './SubscribeDemo';
import DonatePageDemo from './DonatePageDemo';
import DonateDemo from './DonateDemo';
import RegistrationDemo from './RegistrationDemo';
import CheckoutDemo from './CheckoutDemo';
import CartDemo from './CartDemo';

Config.init({
  instanceKey: 'clarety-baseline',
  phoneCountry: 'AU',

  storeId: 0,
  seriesId: 3,
  previousSeriesId: 1,

  devSitePath: 'http://localhost:3000/',
});

// Mock cookies.
Cookies.set('jwtAccount', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2OWY1ZGNiYmZjOWRkOWI3MjYzYjdkMTVjOWVjYjViYjMxNWFjNTAiLCJqdGkiOiI3NjlmNWRjYmJmYzlkZDliNzI2M2I3ZDE1YzllY2I1YmIzMTVhYzUwIiwiaXNzIjoiIiwiYXVkIjowLCJzdWIiOiIxMDgiLCJ1c2VyX3R5cGUiOiJjdXN0b21lciIsImV4cCI6MzE0MTMyOTQ5MiwiaWF0IjoxNTcwNjY0NjI2LCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwic2NvcGUiOm51bGwsImN1c3RvbWVyX3VpZCI6ImU3ZmI4ODMxLTRhODMtNDY4ZS04ZWVjLTU5MzE4NTkwOWYxOCJ9.Dv4_t4NrwHXvezCWS9p0LhQI_sOLnYk-3qyQXZF4gdo');
Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjYXJ0VWlkIjoiOGMyNzU2YjItZjAxOC00YzI3LWEwMjUtYzMxZmNhN2U0ODJiIn0.WDXbbj84bUH7zGVNEEeSK1VwuEfBY8Lt6stiEr6Yhek');

// Real cookies.
// Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJ0VWlkIjoiY3J0X21semsiLCJzYWxlSWQiOiIxMjkyIiwiaXNzIjoiZGV2IiwiZXhwIjoxNTcwNTIyNDM5LCJzdWIiOiIiLCJhdWQiOiIifQ.BuN0B5ILDUs0h7YB8z9Xgm8wxGqk-6aXCGoe59ni7ZM');


const Demo = () => {
  const url = window.location.href;

  if (url.endsWith('subscribe'))     return <SubscribeDemo />;
  if (url.endsWith('donate-page'))   return <DonatePageDemo />;
  if (url.endsWith('donate'))        return <DonateDemo />;
  if (url.endsWith('registrations')) return <RegistrationDemo />;
  if (url.endsWith('checkout'))      return <CheckoutDemo />;
  if (url.endsWith('cart'))          return <CartDemo />;

  return (
    <div className="list-group m-5">
      <a href="subscribe" className="list-group-item list-group-item-action">Subscribe Widget Demo</a>
      <a href="donate" className="list-group-item list-group-item-action">Donate Widget Demo</a>
      <a href="donate-page" className="list-group-item list-group-item-action">Donate Page Demo</a>
      <a href="registrations" className="list-group-item list-group-item-action">Registration Demo</a>
      <a href="checkout" className="list-group-item list-group-item-action">Checkout Demo</a>
      <a href="cart" className="list-group-item list-group-item-action">Cart Demo</a>
    </div>
  );
};

render(<Demo />, document.querySelector('#demo'));
