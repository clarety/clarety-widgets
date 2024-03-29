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
  const defaultFrequency = offers[0] ? offers[0].frequency : undefined;
  const defaultSelections = {};

  for (const offer of offers) {
    const defaultAmount = offer.amounts.find(amount => amount.default) || offer.amounts[0];
    if (!defaultAmount) throw new Error('Offer contains no amounts');

    const defaultPaymentUid = getDefaultOfferPaymentUid(offer);

    defaultSelections[offer.frequency] = {
      offerUid: offer.offerUid,
      offerPaymentUid: defaultPaymentUid,
      amount: defaultAmount.amount,
      isVariableAmount: defaultAmount.variable,
    };
  }

  return {
    ...state,
    frequency: defaultFrequency,
    selections: defaultSelections,
  };
};
