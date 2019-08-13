import React from 'react';
import { Config } from 'clarety-utils';
import { Cart, setupCartAxiosMock } from '../../src';

Config.init({
  instanceKey: 'clarety-baseline',
});

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
