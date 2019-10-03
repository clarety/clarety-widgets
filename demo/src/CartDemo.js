import React from 'react';
import { Cart, setupCartAxiosMock } from '../../src';
import Cookies from 'js-cookie';

Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJ0VWlkIjoiY3J0X3lnNzIiLCJzYWxlSWQiOiIxMjg3IiwiaXNzIjoiZGV2IiwiZXhwIjoxNTcwMDkzNzAzLCJzdWIiOiIiLCJhdWQiOiIifQ.Zsv6H06zTGDxSyG86R6AK-cxi3_63qz3c6-pjrCwXBw');

export default class CheckoutDemo extends React.Component {
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
