import React from 'react';
import { render } from 'react-dom';
import SubscribeDemo from './SubscribeDemo';
import DonateDemo from './DonateDemo';
import CheckoutDemo from './CheckoutDemo';
import './styles/StepIndicator.css';

const Demo = () => {
  const url = window.location.href;

  if (url.endsWith('subscribe')) return <SubscribeDemo />;
  if (url.endsWith('donate')) return <DonateDemo />;
  if (url.endsWith('checkout')) return <CheckoutDemo />;

  return (
    <div className="list-group m-5">
      <a href="subscribe" className="list-group-item list-group-item-action">Subscribe Widget Demo</a>
      <a href="donate" className="list-group-item list-group-item-action">Donate Widget Demo</a>
      <a href="checkout" className="list-group-item list-group-item-action">Checkout Widget Demo</a>
    </div>
  );
};

render(<Demo />, document.querySelector('#demo'));
