import React from 'react';
import { LeadGenWidget } from '../../src/';
import '../../src/lead-gen/style.scss';

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

      <div className="donate-widget col-lg-6">
        <LeadGenWidget
          storeCode="AU"
          caseTypeUid="ctp_rdjr"
          confirmPageUrl="http://dev-tnc.claretycontrol.com/sites/natureaustralia-org-au/content/donate-confirm/gjf19l/donate-confirm"

          variant="sos"
          headingText="This is the heading"
          subHeadingText="This is the button"
          buttonText="This is the sub heading"
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
);

export default LeadGenDemo;

const headingStyle = {
  fontWeight: "400",
  fontSize: "50px",
  margin: "7rem 0 2rem",
};
