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
          caseTypeUid="ctp_q6oq"
          nameOption="full"
          buttonText="Join Now"
        />
      </div>
    );
  }
}
