import React from 'react';
import { Config, DonateWidget, withOverrides } from '../../src/';
import '../../src/donate/style.scss';

const DemoDonateWidget = withOverrides(DonateWidget, {});

const DonateDemo = () => (
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
        <DemoDonateWidget
          storeCode="AU"
          singleOfferCode="widget-single"
          recurringOfferCode="widget-recurring"
          forceMdLayout
        />
      </div>

    </div>
  </div>
);

export default DonateDemo;

const headingStyle = {
  fontWeight: "400",
  fontSize: "50px",
  margin: "7rem 0 2rem",
};
