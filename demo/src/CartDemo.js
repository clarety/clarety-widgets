import React from 'react';
import { Cart, setupCartAxiosMock } from '../../src';

Cart.init();

export default class CartDemo extends React.Component {
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
