import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider as ReduxProvider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { BreakpointProvider } from 'react-socks';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setPanels, setClientIds, setAuth, setTrackingData, fetchSettings, updateAppSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, getJwtAccount } from 'shared/utils';
import { mapDonationSettings } from 'donate/utils';
import { MiniCart, MiniCartBrand, BusyOverlay } from 'registration/components';
import { fetchEvents, fetchAuthCustomer } from 'registration/actions';
import { rootReducer } from 'registration/reducers';
import { RegistrationApi } from 'registration/utils';

// Polyfil plural rules.
if (!Intl.PluralRules) {
  require('@formatjs/intl-pluralrules/polyfill');
  require('@formatjs/intl-pluralrules/dist/locale-data/en');
}

export class Registration extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    Registration.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resourcs.
    Registration.resources = new Resources();
    Registration.resources.setComponent('MiniCartBrand', MiniCartBrand);
  }

  static setClientIds({ dev, prod }) {
    Registration.store.dispatch(setClientIds({ dev, prod }));
  }

  static setPanels(panels) {
    Registration.resources.setPanels(panels);
    Registration.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    Registration.resources.setComponent(name, component);
  }

  render() {
    return (
      <IntlProvider locale="en" messages={this.props.translations}>
        <ReduxProvider store={Registration.store}>
          <BreakpointProvider>
            <RegistrationRoot
              resources={Registration.resources}
              {...this.props}
            />
          </BreakpointProvider>
        </ReduxProvider>
      </IntlProvider>
    );
  }
}

class _RegistrationRoot extends React.Component {
  async componentDidMount() {
    const { updateAppSettings, fetchEvents, setTrackingData, fetchSettings } = this.props;

    // Init translations.
    await i18next.init({
      lng: 'en',
      debug: true,
      resources: {
        en: {
          translation: {
            "btn": {
              "edit":   "Edit",
              "next":   "Next",
              "retry":  "Try Again",
              "cancel": "Cancel",
              "none":   "None",

              // TODO: this should be an override somehow
              "submit": "Submit Registration",

              // TODO: move into team panel?
              "noTeam":      "No Thanks",
              "createTeam":  "Create Team",
              "searchTeams": "Search Teams",
            },

            "label": {
              "customer": {
                "firstName":   "First Name",
                "lastName":    "Last Name",
                "email":       "Email",
                "mobile":      "Mobile",
                "gender":      "Gender",
                "dateOfBirth": "Date of Birth",

                "billing": {
                  "address1": "Address 1",
                  "address2": "Address 2",
                  "suburb":   "Suburb",
                  "state":    "State",
                  "postcode": "Postcode",
                  "country":  "Country",
                },

                "delivery": {
                  "address1": "Address 1",
                  "address2": "Address 2",
                  "suburb":   "Suburb",
                  "state":    "State",
                  "postcode": "Postcode",
                  "country":  "Country",
                },

                "team": {
                  "search":           "Team Search",
                  "name":             "Team Name",
                  "type":             "Team Type",
                  "password":         "Team Password",
                  "passwordRequired": "Should team members enter a password in order to join?",
                },
              },

              "autofill": {
                "email":   "Use email from first participant?",
                "mobile":  "Use mobile from first participant?",
                "address": "Use address from first participant?",
                "billing": "Billing Address is same as Delivery Address",
              },

              "adult":        "Adult",
              "adult_plural": "Adults",
              "child":        "Child",
              "child_plural": "Children",

              "promoCode": "If applicable, enter the promo code provided",
              "waveProductId": "Wave",
            },

            "validation": {
              "required":      "This is a required field",
              "email":         "Please enter a valid email",
              "phone":         "Please enter a valid phone number",
              "phone-unique":  "Emergency phone number needs to be different to your mobile number",
              "age-too-young": "Participant must be older than {{age}} on the day of the walk to attend",
              "age-too-old":   "Participant must be younger than {{age}} on the day of the walk to attend",
            },

            "option": {
              "Male":              "Male",
              "Female":            "Female",
              "Prefer to not say": "Prefer to not say",
            },

            "modePanel": {
              "editTitle": "Registrations",
              "doneTitle": "Registrations",
            },

            "eventPanel": {
              "editTitle": "Which Location Are You Registering For?",
              "doneTitle": "Location",
            },

            "loginPanel": {
              "waitTitle": "Account Details",
              "editTitle": "Account Details",
              "doneTitle": "You are logged in as",
            },

            "qtysPanel": {
              "editTitle":      "Participant Selection",
              "doneTitle":      "Registration",
              "message":        "",
              "adult-title":    "Adults",
              "adult-subtitle": "Ages 17+",
              "child-title":    "Children",
              "child-subtitle": "Ages 13 - 17",              
            },

            "offersPanel": {
              "editTitle":     "Participant Selection",
              "doneTitle":     "Participants",
              "prefillPrompt": "Who is this registration for?",
            },

            "detailsPanel": {
              "editTitle":         "Registration Details For",
              "doneTitle":         "Registration Details",
              "customerFormTitle": "Personal Details",
              "extendFormTitle":   "Event Details",
            },

            "teamPanel": {
              "editTitle":          "Do you want to participate with a team?",
              "doneTitle":          "Your Team",
              "corporateTeamTitle": "Your Team",
              "message-1":          "Combine your efforts and participate as a team! Either create a new team or join one that’s already been created.",
              "message-2":          "If you are registering with an existing team, please contact your team leader for the team name and password (if applicable) before proceeding with the team registration process.",
              "createTeamTitle":    "Create New Team",
              "noTeam":             "No Team",
            },

            "donationPanel": {
              "editTitle": "Make A Donation",
              "doneTitle": "Your Donation",
              "message":   "",
            },

            "expressCheckoutPanel": {
              "waitTitle": "Express Checkout",
              "editTitle": "Express Checkout",
              "doneTitle": "Express Checkout",
            },

            "reviewPanel": {
              "errorTitle":    "We Found Some Problems With Your Registration",
              "errorSubtitle": "Please correct the issues and try again",
              "reviewTitle":   "Please Review Your Registration",
            },

            "paymentPanel": {
              // TODO: these need to be overrides somehow...
              "waitTitle": "Registration Summary",
              "editTitle": "Registration Summary",
              "doneTitle": "Registration Summary",
            },
          }
        },

        fr: {
          translation: {
            "btn": {
              "edit": "Le Edit",
            },

            "modePanel": {
              "editTitle": "Le Registrations",
              "doneTitle": "Le Registrations",
            }
          }
        },
      }
    });

    // Settings.
    updateAppSettings({
      storeId: this.props.storeId,
      seriesId: this.props.seriesId,
      prevSeriesId: this.props.prevSeriesId,
      variant: this.props.variant,
      ...this.props.settings,
    });

    // Init API.
    RegistrationApi.init({
      storeId: this.props.storeId,
      seriesId: this.props.seriesId,
      isExpress: this.props.variant === 'express',
    });

    // Auth.
    const jwtAccount = getJwtAccount();
    if (jwtAccount) {
      const { setAuth, fetchAuthCustomer } = this.props;
      ClaretyApi.setAuth(jwtAccount.jwtString);
      setAuth(jwtAccount.jwtString);
      await fetchAuthCustomer();
    }

    // Events.
    const didFetch = await fetchEvents();
    if (!didFetch) return;

    // Tracking.
    const { sourceId, sourceUid, responseId, emailResponseId } = this.props;
    setTrackingData({ sourceId, sourceUid, responseId, emailResponseId });

    // Donations.
    const { storeCode, donationSingleOfferId, donationRecurringOfferId } = this.props;
    if (donationSingleOfferId || donationRecurringOfferId) {
      await fetchSettings('donations/', {
        store: storeCode,
        offerSingle: donationSingleOfferId,
        offerRecurring: donationRecurringOfferId,
      }, mapDonationSettings);
    }
  }

  changeLanguage = (lng) => {
    i18next.changeLanguage(lng);
    this.forceUpdate();
  };

  render() {
    const { isBlocking, resources } = this.props;

    return (
      <BlockUi blocking={isBlocking} loader={this.getBusyOverlay()} key={i18next.language}>
        <MiniCart resources={resources} />
        <PanelManager
          layout="stack"
          resources={resources}
        />
      </BlockUi>
    );
  }

  getBusyOverlay() {
    const { isInitializing, isValidating, isSubmitting } = this.props;

    if (isInitializing) return (
      <BusyOverlay
        message={<FormattedMessage id="busy.init" defaultMessage="Just A Moment" />}
      />
    );

    if (isValidating) return (
      <BusyOverlay
        message={<FormattedMessage id="busy.validate" defaultMessage="Checking Your Registration Details" />}
      />
    );

    if (isSubmitting) return (
      <BusyOverlay
        message={<FormattedMessage id="busy.submit" defaultMessage="Submitting Your Registration" />}
      />
    );

    return <span />;
  }
}

const mapStateToProps = state => {
  return {
    isBlocking: state.status !== statuses.ready,
    isInitializing: state.status === statuses.initializing,
    isValidating: state.status === statuses.validating,
    isSubmitting: state.status === statuses.submitting,
  };
};

const actions = {
  updateAppSettings: updateAppSettings,

  setAuth: setAuth,
  fetchAuthCustomer: fetchAuthCustomer,

  fetchEvents: fetchEvents,
  fetchSettings: fetchSettings,
  setTrackingData: setTrackingData,
};

const RegistrationRoot = connect(mapStateToProps, actions)(_RegistrationRoot);
