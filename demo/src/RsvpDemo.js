import React from 'react';
import { RsvpWidget } from '../../src/';
import { CustomerPanel, CustomerConnect } from '../../src/shared/components';
import { SessionPanel, SessionConnect } from '../../src/rsvp/components';
import '../../src/fundraising-start/style.scss';

RsvpWidget.init();

RsvpWidget.setPanels([
  {
    component: SessionPanel,
    connect: SessionConnect,
    settings: {},
  },
  {
    component: CustomerPanel,
    connect: CustomerConnect,
    settings: {
      title: 'Your Details',
      submitBtnText: 'RSVP',
    },
  },
]);

const RsvpWidgetDemo = () => (
  <div className="container my-5">
    <div className="row">
      <div className="col">
        <RsvpWidget
          storeUid="str_8qx4"
          eventUid="evn_w24z"
          confirmPageUrl="event-rsvp-confirm.php"
          reCaptchaKey="..."
        />
      </div>
    </div>
  </div>
);

export default RsvpWidgetDemo;
