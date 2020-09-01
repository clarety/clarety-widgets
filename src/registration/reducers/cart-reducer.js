import { cartReducer as sharedCartReducer } from 'shared/reducers';
import { types } from 'registration/actions';

export const cartReducer = (state, action) => {
  switch (action.type) {
    case types.setFundraising:              return setFundraising(state, action);

    case types.registrationCreateRequest:   return registrationCreateRequest(state, action);
    case types.registrationCreateSuccess:   return registrationCreateSuccess(state, action);
    case types.registrationCreateFailure:   return registrationCreateFailure(state, action);

    case types.updateShippingSuccess:       return updateShipping(state, action.result.sale);

    default:                                return sharedCartReducer(state, action);
  }
};

function setFundraising(state, action) {
  return {
    ...state,
    fundraising: {
      createPage: action.createPage,
      goal: action.goal,
    },
  };
}

function registrationCreateRequest(state, action) {
  return {
    ...state,
    id: null,
    uid: null,
    jwt: null,
    status: null,
    errors: null,
  };
}

function registrationCreateSuccess(state, action) {
  return {
    ...state,
    id: action.result.id,
    uid: action.result.uid,
    jwt: action.result.jwt,
    status: action.result.sale.status,
    items: resolveCartItems(state.items, action.result.sale.salelines),
    shippingOptions: action.result.sale.shippingOptions,
    shippingKey: action.result.sale.shippingKey,
    summary: {
      ...state.summary,
      shipping: action.result.sale.shipping,
      tax: action.result.sale.includesTax,
      total: action.result.sale.total,
    }
  };
}

function registrationCreateFailure(state, action) {
  return {
    ...state,
    errors: action.result.validationErrors,
  };
}

function updateShipping(state, sale) {
  return {
    ...state,

    shippingOptions: sale.shippingOptions,
    shippingKey:     sale.shippingKey,

    summary: {
      ...state.summary,
      shipping: sale.shipping,
      tax: sale.includesTax,
      total: sale.total,
    }
  };
}

function resolveCartItems(prevItems, items) {
  return items.map((item, index) => {
    const prevItem = getPrevItem(prevItems, item);

    return {
      ...prevItem,
      description: item.description,
      quantity: Number(item.quantity),
      price: Number(item.price),
      discount: Number(item.discount),
      discountDescription: item.rewardDescription,
      total: convertTotal(item.total),
    };
  });
}

function getPrevItem(prevItems, item) {
  // Resolve using app ref.
  if (item.appRef) {
    return prevItems.find(prevItem => prevItem.appRef === item.appRef);
  }

  // Resolve using donation type.
  if (item.type === 'Donation') {
    return prevItems.find(prevItem => prevItem.type === 'donation');
  }

  // Resolve using add-on offer ids.
  if (item.type === 'Add on') {
    return prevItems.find(prevItem => prevItem.offerId === item.offerId);
  }

  return item;
}

function convertTotal(total) {
  // check if total is a string like "$1.00"
  if (typeof total === 'string' && total.charAt(0) === '$') {
    total = total.substring(1);
  }

  return Number(total);
}
