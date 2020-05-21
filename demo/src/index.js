import React from 'react';
import { render } from 'react-dom';
import Cookies from 'js-cookie';
import { Config } from '../../src';

Config.init({
  // instanceKey: 'mdc',
  // instanceKey: 'clarety-baseline',
  // instanceKey: 'tnc',
  // instanceKey: 'clarety-church',
  // instanceKey: 'ethiopiaid',
  instanceKey: 'a21',
  devSitePath: 'http://localhost:3000/',
  phoneCountry: 'AU',
});

// Mock cookies.
// Cookies.set('jwtAccount', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2OWY1ZGNiYmZjOWRkOWI3MjYzYjdkMTVjOWVjYjViYjMxNWFjNTAiLCJqdGkiOiI3NjlmNWRjYmJmYzlkZDliNzI2M2I3ZDE1YzllY2I1YmIzMTVhYzUwIiwiaXNzIjoiIiwiYXVkIjowLCJzdWIiOiIxMDgiLCJ1c2VyX3R5cGUiOiJjdXN0b21lciIsImV4cCI6MzE0MTMyOTQ5MiwiaWF0IjoxNTcwNjY0NjI2LCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwic2NvcGUiOm51bGwsImN1c3RvbWVyX3VpZCI6ImU3ZmI4ODMxLTRhODMtNDY4ZS04ZWVjLTU5MzE4NTkwOWYxOCJ9.Dv4_t4NrwHXvezCWS9p0LhQI_sOLnYk-3qyQXZF4gdo');
// Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjYXJ0VWlkIjoiOGMyNzU2YjItZjAxOC00YzI3LWEwMjUtYzMxZmNhN2U0ODJiIn0.WDXbbj84bUH7zGVNEEeSK1VwuEfBY8Lt6stiEr6Yhek');
// Cookies.set('jwtCustomer', '');

// Real cookies.
// Cookies.set('jwtAccount', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZCI6IjAzNDY0NjAyYzY4NmIzZjYyZjk2MzJlODMxMDY1OTNkZjE0ZGMxZmMiLCJqdGkiOiIwMzQ2NDYwMmM2ODZiM2Y2MmY5NjMyZTgzMTA2NTkzZGYxNGRjMWZjIiwiaXNzIjoiIiwiYXVkIjowLCJzdWIiOiI2NjUiLCJ1c2VyX3R5cGUiOiJjdXN0b21lciIsImV4cCI6MzE0MjU0Mjc0MCwiaWF0IjoxNTcxMjcxMjUwLCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwic2NvcGUiOm51bGwsImN1c3RvbWVyX3VpZCI6ImNzdF9qMnprIn0.A6AKBL_sdIeuxzR3-73X9tBh2kcfSyAZlnIasIOwbgQb_FETFoEH601KfOsYm6Kd1MskDPy5nZNi5VCjceqALYXd3ZEmTRvsfKWB1nrhrPxDSV37soYl2E3SEc1uCls_YRMYGOtBiGulJ5ZlxDfjQOLNtqa_sqR6Q6wEcbM-JDU');
Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzYWxlSWQiOiIyNzE4IiwiY2FydFVpZCI6ImNydF9tdmxvIiwiaXNzIjoiZGV2IiwiZXhwIjoxNTkwMTA4MjI2LCJzdWIiOiIiLCJhdWQiOiIifQ.yEg9gP5D_T90u-Qp9OnGm2z0u6Pws6-tutqYeGjmrq8');
// Cookies.set('jwtCustomer', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lclVpZCI6ImNzdF9sODB3Iiwic3RvcmVVaWQiOiJzdHJfbDlwNyIsImlzcyI6ImRldiIsImV4cCI6MTU4ODcyNzcwMCwic3ViIjoiIiwiYXVkIjoiIn0.1fvSp4np51hnsdIVBUzsJ5I8eMHe1QJ0gIhi4nrYsyM');


const Demo = () => {
  const url = window.location.href;

  if (url.endsWith('subscribe')) {
    const SubscribeDemo = require('./SubscribeDemo').default;
    return <SubscribeDemo />;
  }

  if (url.indexOf('donate-page') !== -1) {
    const DonatePageDemo = require('./DonatePageDemo').default;
    return <DonatePageDemo />;
  }

  if (url.indexOf('donate') !== -1) {
    const DonateDemo = require('./DonateDemo').default;
    return <DonateDemo />;
  }

  if (url.endsWith('registration')){
    const RegistrationDemo = require('./RegistrationDemo').default;
    return <RegistrationDemo />;
  }

  if (url.endsWith('checkout')) {
    const CheckoutDemo = require('./CheckoutDemo').default;
    return <CheckoutDemo />;
  }

  if (url.endsWith('cart')) {
    const CartDemo = require('./CartDemo').default;
    return <CartDemo />;
  }

  if (url.endsWith('lead-gen')) {
    const LeadGenDemo = require('./LeadGenDemo').default;
    return <LeadGenDemo />;
  }

  if (url.endsWith('quiz')) {
    const QuizDemo = require('./QuizDemo').default;
    return <QuizDemo />;
  }

  if (url.endsWith('fundraising-start')) {
    const FundraisingStartDemo = require('./FundraisingStartDemo').default;
    return <FundraisingStartDemo />;
  }

  if (url.endsWith('file-upload')) {
    const FileUploadDemo = require('./FileUploadDemo').default;
    return <FileUploadDemo />;
  }

  return (
    <div className="list-group m-5">
      <a href="subscribe" className="list-group-item list-group-item-action">Subscribe Widget Demo</a>
      <a href="donate" className="list-group-item list-group-item-action">Donate Widget Demo</a>
      <a href="donate-page" className="list-group-item list-group-item-action">Donate Page Demo</a>
      <a href="registration" className="list-group-item list-group-item-action">Registration Demo</a>
      <a href="checkout" className="list-group-item list-group-item-action">Checkout Demo</a>
      <a href="cart" className="list-group-item list-group-item-action">Cart Demo</a>
      <a href="lead-gen" className="list-group-item list-group-item-action">Lead Gen Demo</a>
      <a href="quiz" className="list-group-item list-group-item-action">Quiz Demo</a>
      <a href="fundraising-start" className="list-group-item list-group-item-action">Fundraising Start Demo</a>
      <a href="file-upload" className="list-group-item list-group-item-action">File Upload Demo</a>
    </div>
  );
};

render(<Demo />, document.querySelector('#demo'));
