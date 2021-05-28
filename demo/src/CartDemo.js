import React from 'react';
import { Cart, initTranslations } from '../../src';

initTranslations({
  translationsPath: 'translations/{{lng}}.json',
  defaultLanguage: 'en',
});

Cart.init();

export default class CartDemo extends React.Component {
  render() {
    return (
      <div className="m-5">
        <Cart/>
      </div>
    );
  }
}
