import React from 'react';
import { Cart, setupCartAxiosMock } from '../../src';

export default class CheckoutDemo extends React.Component {
  componentWillMount() {
    setupCartAxiosMock();
  }

  render() {
    return (
      <div className="m-5">
        <Cart/>
      </div>
    );
  }
}
