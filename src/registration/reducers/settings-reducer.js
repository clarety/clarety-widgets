import { types } from 'registration/actions';
import { initialState as sharedInitialState } from 'shared/reducers';
import { settingsReducer as sharedSettingsReducer } from 'shared/reducers';

const initialState = {
  ...sharedInitialState,

  isBusy: false,

  events: null,
  event: null,

  extendForm: null,
  elements: null,

  priceHandles: null,

  currency: {
    symbol: '$',
    code: 'AUD',
  },
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchEventsSuccess:
      return {
        ...state,
        events: action.results.events,
      };

    case types.fetchFullEventRequest:
      return {
        ...state,
        isBusy: true,
      };

    case types.fetchFullEventSuccess:
      return {
        ...state,
        isBusy: false,
        event: convertEvent(action.result.events[0]),
        extendForm: convertSelectFields(action.result.extendForms[0]),
        elements: action.result.elements,
      };

    case types.setPriceHandles:
      return {
        ...state,
        priceHandles: action.priceHandles,
      };

    default:
      return sharedSettingsReducer(state, action);
  }
};

// Select field options are currently provided in a single object
// { 'QLD': 'Queensland', 'VIC': 'Victoria' }
// we want an array of objects containing values and labels
// [{ value: 'QLD', label: 'Queensland' }, { value: 'VIC', label: 'Victoria' }]
function convertSelectFields(extendForm) {
  for (let field of extendForm.extendFields) {
    // Check if field has an options object.
    if (field.options && typeof field.options === 'object') {
      // Map options to an array of values and labels.
      field.options = Object.entries(field.options).map(
        ([key, value]) => ({ value: key, label: value })
      );
    }
  }

  return extendForm;
}

function convertEvent(event) {
  return {
    ...event,
    addOns: convertEventAddOns(event.addOns),
    registrationTypes: convertRegistrationTypes(event.registrationTypes),
  };
};

function convertEventAddOns(addOns) {
  return addOns.map(addOn => ({
    offerId: addOn.offerId,
    name: addOn.name,
    price: Number(addOn.price),
  }));
}

function convertRegistrationTypes(registrationTypes) {
  const types = {};

  for (const [key, value] of Object.entries(registrationTypes)) {
    types[key] = {
      ...value,
      offers: convertRegistrationOffers(value.offers),
    };
  }

  return types;
}

function convertRegistrationOffers(offers) {
  return offers.map(offer => ({
    offerId: offer.offerId,
    name: offer.name,
    shortDescription: offer.shortDescription,
    price: Number(offer.amount),
    waves: convertRegistrationWaves(offer.registrationProducts),
    ageCalculationDate: offer.ageCalculationDate,
    maxAgeUnder: offer.maxAgeUnder,
    minAgeOver: offer.minAgeOver,
  }));
}

function convertRegistrationWaves(registrationProducts) {
  return registrationProducts[0].products;
}
