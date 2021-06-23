import React from 'react';
import { DonationPanel, LoginPanel } from '../../src/shared/components';
import { ModePanel, EventPanel, TeamPanel, QtysPanel, OffersPanel, DetailsPanel, ValidatePanel, PaymentPanel } from '../../src/registration/components';
import { MerchPanel, MerchConnect } from '../../src/registration/components';
import { ModeConnect, EventConnect, LoginConnect, TeamConnect, QtysConnect, OffersConnect, DetailsConnect, DonationConnect, ValidateConnect, PaymentConnect } from '../../src/registration/components';
import { Registration, initTranslations, renderWidget } from '../../src';
import '../../src/registration/style.scss';

async function renderRegistrations(props) {
  await initTranslations({
    translationsPath: 'translations/{{lng}}.json',
    defaultLanguage: 'en',
  });
  
  Registration.init();
  
  Registration.setClientIds({
    // dev:  '82ee4a2479780256c9bf9b951f5d1cfb', // baseline
    // dev:  '60efcad7dc9df95cb418032c39565a79', // mdc
    dev:  'ab0c9407ba7f0581ebc49fa787049e80', // a21
    prod: '',
  });
  
  Registration.setPanels([
    {
      component: ModePanel,
      connect: ModeConnect,
      settings: {},
    },
    {
      component: EventPanel,
      connect: EventConnect,
      settings: {
        showStateButtons: true,
        showPromoCode: true,
      },
    },
    {
      component: DonationPanel,
      connect: DonationConnect,
      settings: {
        showFrequencySelect: false,
        showNoneButton: true,
      },
    },
    {
      component: LoginPanel,
      connect: LoginConnect,
      settings: {
        createAccount: true,
        allowGuest: true,
        showGuestForm: true,
        showFirstName: true,
        showLastName: true,
      },
    },
    {
      component: QtysPanel,
      connect: QtysConnect,
      settings: {},
    },
    {
      component: TeamPanel,
      connect: TeamConnect,
      settings: {},
    },
    {
      component: OffersPanel,
      connect: OffersConnect,
      settings: {
        showOffers: true,
        showPrefill: true,
      },
    },
    {
      component: DetailsPanel,
      connect: DetailsConnect,
      settings: {
        showBillingAddress: true,
        showDeliveryAddress: true,
      },
    },
    {
      component: MerchPanel,
      connect: MerchConnect,
      settings: {},
    },
    {
      component: ValidatePanel,
      connect: ValidateConnect,
      settings: {},
    },
    {
      component: PaymentPanel,
      connect: PaymentConnect,
      settings: {
        title: 'Registration Summary',
        submitBtnText: 'Submit Registration',
      },
    },
  ]);

  renderWidget(props.elementId, <Registration {...props} />);
}

export default class RegistrationDemo extends React.Component {
  componentDidMount() {
    renderRegistrations({
      elementId: 'rego-widget-demo',
      storeId: '1',

      // a21
      storeCode: 'US',
      seriesId: '30',
      prevSeriesId: '25',
      donationSingleOfferId: '151',

      // mdc
      // storeCode: 'AU',
      // seriesId: '9',
      // prevSeriesId: '8',
      // donationSingleOfferId: '55',

      // baseline
      // storeCode: 'AU',
      // seriesId: '3',
      // prevSeriesId: '2',
      // donationSingleOfferId: '8',
      
      sourceId: '17',
      responseId: 'e9c2e351d90b11e996fd',
      emailResponseId: '1234',

      showLanguageSelect: true,

      languages: {
        en: 'English',
        th: 'Thai',
      },
    });
  }

  render() {
    return (
      <div className="registrations">
        <div id="rego-widget-demo"></div>
      </div>
    );
  }
}
