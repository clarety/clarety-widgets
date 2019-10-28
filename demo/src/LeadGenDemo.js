import React from 'react';
import { CustomerPanel, CmsConfirmPanel } from '../../src/shared/components';
import { CustomerConnect } from '../../src/lead-gen/components';
import { LeadGenWidget } from '../../src/';
import '../../src/lead-gen/style.scss';

LeadGenWidget.setPanels([
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

const LeadGenDemo = () => (
  <div className="container my-5">
    <div className="row">

      <div className="col-lg-6">
        <h2 style={headingStyle}>
          Donate now. <span className="text-muted">Human Fund needs your help.</span>
        </h2>
        <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
        <p className="lead">Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
      </div>

      <div className="col-lg-6">
        <div className="cms-zone">
          <div id="cmscontentitem_1044" className="content_app-CmsReactLeadGenApp">
            <div className="content_app_react_leadgen h-100">
              <div id="leadgenwidget_1044" className="lead-gen-widget">
                <LeadGenWidget
                  elementId="leadgenwidget_1044"

                  storeCode="AU"
                  caseTypeUid="ctp_q6oq"
                  // variant="sos"
                  variant="download"
                  // confirmPageUrl="http://dev-tnc.claretycontrol.com/sites/natureaustralia-org-au/content/donate-confirm/gjf19l/donate-confirm"

                  headingText="This is the heading"
                  // subHeadingText="This is the sub heading"
                  headingImage="https://placeimg.com/180/260/nature"
                  buttonText="This is the button"
                  showOptIn="1"
                  optInText="This is the opt in"
                  phoneOption="mobile"
                  addressOption="postcode"

                  sourceUid="src_dy4v"
                  responseId=""
                  emailResponseId=""

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
              <p style={{ textAlign: 'center' }}>Thanks ##firstname## for your support. &nbsp;You have made the Quokka very happy! &nbsp;&nbsp;</p>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>
        </div>
      </div>

    </div>
  </div>
);

export default LeadGenDemo;

const headingStyle = {
  fontWeight: "400",
  fontSize: "50px",
  margin: "7rem 0 2rem",
};
