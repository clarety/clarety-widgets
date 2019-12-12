import React from 'react';
import { CmsConfirmPanel } from '../../src/shared/components';
import { CustomerPanel, CustomerConnect } from '../../src/subscribe/components';
import { SubscribeWidget } from '../../src';

SubscribeWidget.setPanels([
  {
    component: CustomerPanel,
    connect: CustomerConnect,
    settings: {},
  },
  {
    component: CmsConfirmPanel,
    connect: undefined,
    settings: {},
  }
]);

const SubscribeDemo = () => (
  <div className="container my-5">
    <div className="row">
      <div className="col">

        <div className="cms-zone">
          <div id="cmscontentitem_1044" className="content_app-CmsReactSubscribeApp">
            <div className="content_app_react_subscribe h-100">
              <div id="subscribewidget_1044" className="subscribe-widget">
                <SubscribeWidget
                  elementId="subscribewidget_1044"
                  caseTypeUid="ctp_q6oq"
                  nameOption="firstandlast"
                  buttonText="Sign Up Now!"
                  reCaptchaKey="6LdBAbkUAAAAAKmGXpndv5B8JP7T9oOEoVmztVp9"
                />
              </div>
            </div>
          </div>
          <div style={{ clear: 'both' }}></div>
        </div>

        <div className="confirmcontent" style={{ display: 'none' }}>
          <div className="cms-zone">
            <div id="cmscontentitem_1043" className="content_html">
              <p style={{ textAlign: 'center' }}>Thanks for subscribing ##firstname##!</p>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default SubscribeDemo;
