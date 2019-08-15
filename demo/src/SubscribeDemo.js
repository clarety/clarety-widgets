import React from 'react';
import { Config, SubscribeWidget, setupSubscribeAxiosMock } from '../../src';

Config.init({
  instanceKey: 'clarety-baseline',
});

export default class SubscribeDemo extends React.Component {
  componentWillMount() {
    // setupSubscribeAxiosMock();
  }

  render() {
    return (
      <div className="m-5">
        <SubscribeWidget
          listCode="newsletter"
        />
      </div>
    );
  }
}
