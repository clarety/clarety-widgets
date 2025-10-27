import React from 'react';
import { DonationPanel, LoginPanel } from '../../src/shared/components';
import { ModePanel, EventPanel, TeamPanel, QtysPanel, OffersPanel, DetailsPanel, ValidatePanel, PaymentPanel } from '../../src/registration/components';
import { MerchPanel, MerchConnect } from '../../src/registration/components';
import { ModeConnect, EventConnect, LoginConnect, TeamConnect, QtysConnect, OffersConnect, DetailsConnect, DonationConnect, ValidateConnect, PaymentConnect } from '../../src/registration/components';
import { Registration, initTranslations, renderWidget } from '../../src';
import './styles/registration.css';

async function renderRegistrations(props) {
  // await initTranslations({
  //   translationsPath: 'translations/{{lng}}.json',
  //   defaultLanguage: 'en',
  // });
  
  Registration.init();
  
  Registration.setClientIds({
    // dev:  '82ee4a2479780256c9bf9b951f5d1cfb', // baseline
    // dev:  '60efcad7dc9df95cb418032c39565a79', // mdc
    // dev:  'ab0c9407ba7f0581ebc49fa787049e80', // a21
    dev:  '9987567f7e7c62c4f8a50b48950370ca', // bhcc
    prod: '',
  });
  
  Registration.setPanels([

    // {
    //   component: PaymentPanel,
    //   connect: PaymentConnect,
    //   settings: {
    //     showCvcInfoBtn: true,
    //   },
    // },


    {
      component: ModePanel,
      connect: ModeConnect,
      settings: {},
    },
    {
      component: EventPanel,
      connect: EventConnect,
      settings: {},
    },
    {
      component: LoginPanel,
      connect: LoginConnect,
      settings: {
        allowGuest: false,
        createAccount: true,
        showFirstName: true,
        showLastName: true,
      },
    },
    {
      component: TeamPanel,
      connect: TeamConnect,
      settings: {
        allowCreate: true,
      },
    },
    {
      component: QtysPanel,
      connect: QtysConnect,
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
        showGender: true,
        isGenderRequired: true,
        isDobRequired: true,
        isMobileRequired: true,
        isAddressRequired: true,
      },
    },
    // {
    //   component: DonationPanel,
    //   connect: DonationConnect,
    //   settings: {
    //     showFrequencySelect: false,
    //     showNoneButton: true,
    //   },
    // },
    {
      component: ValidatePanel,
      connect: ValidateConnect,
      settings: {},
    },
    {
      component: PaymentPanel,
      connect: PaymentConnect,
      settings: {
        showCvcInfoBtn: true,
      },
    },
  ]);

  renderWidget(props.elementId, <Registration {...props} />);
}

export default class RegistrationDemo extends React.Component {
  componentDidMount() {
    renderRegistrations({
      elementId: 'rego-widget-demo',
      // storeId: '1',

      // a21
      // storeCode: 'US',
      // seriesId: '30',
      // prevSeriesId: '25',
      // donationSingleOfferId: '151',

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

      // bhcc
      storeId: null,
      storeUid: "",
      seriesId: 3,
      // donationSingleOfferId: "37",
      feeOfferUid: 'ofr_8m0g',
      calcFeesFn: (amount) => amount * 0.05,
      sourceUid: null,
      responseId: null,
      emailResponseId: null,
      channel: 'rego',
      currencyCode: 'AUD',
      currencySymbol: '$',
      
      // sourceId: '17',
      // responseId: 'e9c2e351d90b11e996fd',
      // emailResponseId: '1234',

      // showLanguageSelect: true,

      // languages: {
      //   en: 'English',
      //   th: 'Thai',
      // },
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
