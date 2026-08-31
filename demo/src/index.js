import React from 'react';
import { render } from 'react-dom';
import Cookies from 'js-cookie';
import { Config } from '../../src';

Config.init({
  instanceKey: 'clarety-baseline',
  devSitePath: 'http://localhost:3000/',
  // phoneCountry: 'AU',
  localhostProtocol: 'https:',
  useValidIsoCountryCodes: true,
});

const Demo = () => {
  const url = window.location.href;

  if (url.endsWith('unsubscribe')) {
    const UnsubscribeDemo = require('./UnsubscribeDemo').default;
    return <UnsubscribeDemo />;
  }

  if (url.endsWith('subscribe')) {
    const SubscribeDemo = require('./SubscribeDemo').default;
    return <SubscribeDemo />;
  }

  if (url.indexOf('donate-page') !== -1) {
    const DonatePageDemo = require('./DonatePageDemo').default;
    return <DonatePageDemo />;
  }

  if (url.indexOf('fund-donate') !== -1) {
    const FundDonateDemo = require('./FundDonateDemo').default;
    return <FundDonateDemo />;
  }

  if (url.indexOf('donate-rg-upsell') !== -1) {
    const DonateRgUpsellDemo = require('./DonateRgUpsellDemo').default;
    return <DonateRgUpsellDemo />;
  }

  if (url.indexOf('donate') !== -1) {
    const DonateDemo = require('./DonateDemo').default;
    return <DonateDemo />;
  }

  if (url.endsWith('registration')) {
    const RegistrationDemo = require('./RegistrationDemo').default;
    return <RegistrationDemo />;
  }

  if (url.endsWith('checkout')) {
    const CheckoutDemo = require('./CheckoutDemo').default;
    return <CheckoutDemo />;
  }

  if (url.endsWith('cart')) {
    const CartDemo = require('./CartDemo').default;
    return <CartDemo />;
  }

  if (url.endsWith('lead-gen')) {
    const LeadGenDemo = require('./LeadGenDemo').default;
    return <LeadGenDemo />;
  }

  if (url.endsWith('quiz')) {
    const QuizDemo = require('./QuizDemo').default;
    return <QuizDemo />;
  }

  if (url.endsWith('fundraising-start')) {
    const FundraisingStartDemo = require('./FundraisingStartDemo').default;
    return <FundraisingStartDemo />;
  }

  if (url.endsWith('file-upload')) {
    const FileUploadDemo = require('./FileUploadDemo').default;
    return <FileUploadDemo />;
  }

  if (url.endsWith('rsvp')) {
    const RsvpDemo = require('./RsvpDemo').default;
    return <RsvpDemo />;
  }

  if (url.endsWith('case')) {
    const CaseDemo = require('./CaseDemo').default;
    return <CaseDemo />;
  }

  if (url.endsWith('case-section-sidebar')) {
    const CaseSectionSidebarDemo = require('./CaseSectionSidebarDemo').default;
    return <CaseSectionSidebarDemo />;
  }

  if (url.endsWith('membership')) {
    const MembershipDemo = require('./MembershipDemo').default;
    return <MembershipDemo />;
  }

  if (url.endsWith('update-payment-details')) {
    const UpdatePaymentDetailsDemo = require('./UpdatePaymentDetailsDemo').default;
    return <UpdatePaymentDetailsDemo />;
  }

  return (
    <div className="list-group m-5">
      <a href="subscribe" className="list-group-item list-group-item-action">Subscribe Widget</a>
      <a href="unsubscribe" className="list-group-item list-group-item-action">Unsubscribe Widget</a>
      <a href="donate" className="list-group-item list-group-item-action">Donate Widget</a>
      <a href="donate-rg-upsell" className="list-group-item list-group-item-action">Donate Widget RG Upsell</a>
      <a href="fund-donate" className="list-group-item list-group-item-action">Fund Donate Widget</a>
      <a href="donate-page" className="list-group-item list-group-item-action">Donate Page</a>
      <a href="registration" className="list-group-item list-group-item-action">Registration</a>
      <a href="checkout" className="list-group-item list-group-item-action">Checkout</a>
      <a href="cart" className="list-group-item list-group-item-action">Cart</a>
      <a href="lead-gen" className="list-group-item list-group-item-action">Lead Gen</a>
      <a href="quiz" className="list-group-item list-group-item-action">Quiz</a>
      <a href="fundraising-start" className="list-group-item list-group-item-action">Fundraising Start</a>
      <a href="file-upload" className="list-group-item list-group-item-action">File Upload</a>
      <a href="rsvp" className="list-group-item list-group-item-action">RSVP Widget</a>
      <a href="case" className="list-group-item list-group-item-action">Case Widget</a>
      <a href="case-section-sidebar" className="list-group-item list-group-item-action">Case Widget - Section Sidebar</a>
      <a href="membership" className="list-group-item list-group-item-action">Membership Widget</a>
      <a href="update-payment-details" className="list-group-item list-group-item-action">Update Payment Details Widget</a>
    </div>
  );
};

render(<Demo />, document.querySelector('#demo'));
