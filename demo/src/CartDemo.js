import React from 'react';
import { Cart, setupCartAxiosMock } from '../../src';

Cart.init();

Cart.setTranslationsPath('translations/{{lng}}.json');

export default class CartDemo extends React.Component {
  componentWillMount() {
    // setupCartAxiosMock();
  }

  render() {
    return (
      <div className="m-5">
        <Cart/>
      </div>
    );
  }
}
