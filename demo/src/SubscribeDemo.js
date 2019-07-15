import React from 'react';
import Clarety, { setupSubscribeAxiosMock } from '../../src';

Clarety.config({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

export default class SubscribeDemo extends React.Component {
  componentWillMount() {
    setupSubscribeAxiosMock();
  }

  render() {
    return (
      <div className="m-5">
        <Clarety.SubscribeWidget
          listCode="newsletter"
        />
      </div>
    );
  }
}
