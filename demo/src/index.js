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

// Mock cookies.
// Cookies.set('jwtAccount', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2OWY1ZGNiYmZjOWRkOWI3MjYzYjdkMTVjOWVjYjViYjMxNWFjNTAiLCJqdGkiOiI3NjlmNWRjYmJmYzlkZDliNzI2M2I3ZDE1YzllY2I1YmIzMTVhYzUwIiwiaXNzIjoiIiwiYXVkIjowLCJzdWIiOiIxMDgiLCJ1c2VyX3R5cGUiOiJjdXN0b21lciIsImV4cCI6MzE0MTMyOTQ5MiwiaWF0IjoxNTcwNjY0NjI2LCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwic2NvcGUiOm51bGwsImN1c3RvbWVyX3VpZCI6ImU3ZmI4ODMxLTRhODMtNDY4ZS04ZWVjLTU5MzE4NTkwOWYxOCJ9.Dv4_t4NrwHXvezCWS9p0LhQI_sOLnYk-3qyQXZF4gdo');
// Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjYXJ0VWlkIjoiOGMyNzU2YjItZjAxOC00YzI3LWEwMjUtYzMxZmNhN2U0ODJiIn0.WDXbbj84bUH7zGVNEEeSK1VwuEfBY8Lt6stiEr6Yhek');
// Cookies.set('jwtCustomer', '');

// Real cookies.
// Cookies.set('jwtAccount', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZCI6IjJhNWNkY2QyMzVmNmY0NzAyNWNlODQ2M2FkODFhZWJjY2EyYjRkM2QiLCJqdGkiOiIyYTVjZGNkMjM1ZjZmNDcwMjVjZTg0NjNhZDgxYWViY2NhMmI0ZDNkIiwiaXNzIjoiIiwiYXVkIjoiYWIwYzk0MDdiYTdmMDU4MWViYzQ5ZmE3ODcwNDllODAiLCJzdWIiOiIzMjY3NSIsInVzZXJfdHlwZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjI1ODc5NTIyLCJpYXQiOjE2MjU3OTMxMjIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJzY29wZSI6bnVsbCwiY3VzdG9tZXJfdWlkIjoiY3N0XzByM2VrIn0.jwJit6GL5Ic9j-3APlHPJLVFCKW0UpXlbyNa-4S-EL92g8FHlAL552y5tnF0k8n4P3m4G60_sl98DsCcm-3v4SmlOrMEJh3MIAk74ph7VqIjFPYTiHN1htrrwNgis0u72jRILqm5VpKgpXgGO9agNyOJL3RXDciz9-CaAg4e3PBLXLAJ2nCdCVHZgindYggQ1kxIn1GpETX8DDY6emdVvbgGOy-k6TMKrxqo-QaEvn48E9Fa3HR-3H3_1sfsxsdurU6ViJDzypY4W3NU0kqsN_qSn4lRMQRaVOltcVoYGIxTrPA-5yEX1JbYCWSITyqamFrLC_QNsBUVwNJwI_PcZg');
Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDA1MzIwOTMsImlzcyI6ImRldiIsInR5cGUiOiJzYWxlIiwic2FsZUlkIjoiMjMwNCIsImNhcnRVaWQiOiJjcnRfZ21rayJ9.kVEYqhTBXE7znHT8x_Oek55ztuVB2LtuvPFBArP4eVs');
// Cookies.set('jwtCustomer', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lclVpZCI6ImNzdF9sODB3Iiwic3RvcmVVaWQiOiJzdHJfbDlwNyIsImlzcyI6ImRldiIsImV4cCI6MTU4ODcyNzcwMCwic3ViIjoiIiwiYXVkIjoiIn0.1fvSp4np51hnsdIVBUzsJ5I8eMHe1QJ0gIhi4nrYsyM');


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
    </div>
  );
};

render(<Demo />, document.querySelector('#demo'));
