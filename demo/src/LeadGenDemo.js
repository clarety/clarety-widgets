import React from 'react';
import { LeadGenWidget } from '../../src/';

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

          singleOfferId="8"
          recurringOfferId="17"

          sourceId="17"
          responseId="e9c2e351d90b11e996fd"
          emailResponseId="1234"

          reCaptchaKey="1234"

          forceMdLayout
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
