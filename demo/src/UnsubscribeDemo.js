import React from 'react';
import { UnsubscribePanel, UnsubscribeConnect, ConfirmPanel } from '../../src/unsubscribe/components';
import { UnsubscribeWidget, initTranslations } from '../../src';

initTranslations({
  translationsPath: 'translations/{{lng}}.json',
  defaultLanguage: 'en',
});

UnsubscribeWidget.init();

UnsubscribeWidget.setPanels([
  {
    component: UnsubscribePanel,
    connect: UnsubscribeConnect,
    settings: {},
  },
  {
    component: ConfirmPanel,
    connect: undefined,
    settings: {},
  }
]);

const UnsubscribeDemo = () => (
  <div className="container my-5">
    <div className="row">
      <div className="col">

        <div className="cms-zone">
          <div id="cmscontentitem_1044" className="content_app-CmsReactSubscribeApp">
            <div className="content_app_react_subscribe h-100">
              <div id="unsubscribewidget_1044" className="subscribe-widget">
                <UnsubscribeWidget
                  elementId="unsubscribewidget_1044"
                  buttonText="Unsubscribe!"
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
              <p style={{ textAlign: 'center' }}>You have unsubscribed.</p>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default UnsubscribeDemo;
