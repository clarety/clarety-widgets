import { types as sharedActionTypes } from 'shared/actions';
import { types } from 'donate/actions';
import { getDefaultOfferPaymentUid } from 'shared/utils';

const initialState = {
  frequency: null,
  selections: {},
};

export const donationPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.selectFrequency:
      return selectFrequency(state, action);

    case types.selectSchedule:
      return selectSchedule(state, action);

    case types.selectAmount:
      return selectAmount(state, action);

    case types.selectDefaults:
      return selectDefaults(state, action.offers);

    case sharedActionTypes.fetchSettingsSuccess:
      const offers = action.result.priceHandles || action.result.offers;
      return selectDefaults(state, offers);

    default:
      return state;
  }
};

const selectFrequency = (state, action) => {
  return {
    ...state,
    frequency: action.frequency,
  };
};

const selectSchedule = (state, action) => {
  return {
    ...state,
    selections: {
      ...state.selections,
      recurring: {
        ...state.selections.recurring,
        offerPaymentUid: action.offerPaymentUid,
      },
    }
  };
};

const selectAmount = (state, action) => {
  const { frequency, amount, isVariableAmount } = action;

  return {
    ...state,
    selections: {
      ...state.selections,
      [frequency]: {
        ...state.selections[frequency],
        amount,
        isVariableAmount,
        variableAmount: isVariableAmount ? amount : '',
      },
    }
  };
};

const selectDefaults = (state, offers) => {
  const defaultFrequency = offers[0].frequency;
  const defaultSelections = {};

  for (let offer of offers) {
    const defaultAmount = offer.amounts.find(amount => amount.default);
    const defaultPaymentUid = getDefaultOfferPaymentUid(offer);

    defaultSelections[offer.frequency] = {
      offerUid: offer.offerUid,
      offerPaymentUid: defaultPaymentUid,
      amount: defaultAmount ? defaultAmount.amount : 0,
      isVariableAmount: false,
    };
  }

  return {
    ...state,
    frequency: defaultFrequency,
    selections: defaultSelections,
  };
};
