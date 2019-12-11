import React from 'react';
import { SubscribeWidget, setupSubscribeAxiosMock } from '../../src';

export default class SubscribeDemo extends React.Component {
  componentWillMount() {
    // setupSubscribeAxiosMock();
  }

  render() {
    return (
      <div className="m-5">
        <SubscribeWidget
          listCode="newsletter"
          nameOption="full"
        />
      </div>
    );
  }
}
