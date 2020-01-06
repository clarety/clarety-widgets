import { ClaretyApi } from 'clarety-utils';
import { addItem, updateItem, removeItem } from 'shared/actions';
import { getCart } from 'shared/selectors';
import { setErrors, clearErrors } from 'form/actions';
import { getCreateRegistrationPostData, getSubmitRegistrationPostData, getMakePaymentPostData, getIsLoggedIn } from 'registration/selectors';
import { types } from 'registration/actions';

export const setWaveInCart = (participantIndex, waveProductId) => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    const index = cart.items.findIndex(item =>
      item.type === 'event' &&
      item.options.participantIndex === participantIndex
    );

    dispatch(updateItem(index, {
      productId: waveProductId,
    }));
  };
};

export const addAddOnToCart = (item, participantIndex) => {
  return (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    const index = cart.items.findIndex(cartItem => cartItem.offerId === item.offerId);

    if (index === -1) {
      // Add new item.
      item.options = {
        participants: [participantIndex],
      };
      dispatch(addItem(item));
    } else {
      // Update existing item.
      const cartItem = cart.items[index];
      cartItem.quantity += 1;
      cartItem.options = {
        participants: [
          ...cartItem.options.participants,
          participantIndex,
        ],
      };
      dispatch(updateItem(index, cartItem));
    }
  };
};

export const removeAddOnsFromCart = (participantIndex) => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    // Iterate backwards since we're removing items by index.
    for (let itemIndex = cart.items.length - 1; itemIndex >= 0; itemIndex--) {
      const item = cart.items[itemIndex];

      // Make sure this is one of our add-ons.
      if (item.type !== 'add-on') continue;
      if (!item.options || !item.options.participants) continue;
      if (!item.options.participants.includes(participantIndex)) continue;

      if (item.quantity === 1) {
        // Remove item.
        dispatch(removeItem(itemIndex));
      } else {
        // Update item.
        item.quantity -= 1;
        item.options.participants = item.options.participants.filter(index => index !== participantIndex);
        dispatch(updateItem(item));
      }
    }
  };
};

export const createRegistration = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const isLoggedIn = getIsLoggedIn(state);
    const postData = getCreateRegistrationPostData(state);

    dispatch(clearErrors());
    dispatch(registrationCreateRequest(postData));

    const endpoint = isLoggedIn
      ? 'registration-sale/'
      : 'registration-sale-express/';

    const { storeId } = state.settings;
    let results = await ClaretyApi.post(endpoint, postData, { storeId });
    let result = results[0];

    if (result.status === 'error') {
      dispatch(registrationCreateFailure(result));
      dispatch(setErrors(result.validationErrors));
      return false; 
    } else {
      dispatch(registrationCreateSuccess(result));
      return true;
    }
  };
};

export const submitRegistration = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const postData = getSubmitRegistrationPostData(state);

    dispatch(registrationSubmitRequest(postData));

    const { storeId } = state.settings;
    const results = await ClaretyApi.post('registration-payment-express/', postData, { storeId });
    const result = results[0];

    if (result && result.status !== 'error') {
      // Redirect on success.
      window.location.href = result.redirect;
    } else {
      dispatch(registrationSubmitFailure(result));
      dispatch(setErrors(result.validationErrors));
      return false;
    }
  };
};

export const makePayment = (paymentData, paymentMethod) => {
  return async (dispatch, getState) => {
    const state = getState();

    const postData = getMakePaymentPostData(state, paymentData);

    dispatch(registrationSubmitRequest(postData));

    const endpoint = getIsLoggedIn(state)
      ? 'registration-payment/'
      : 'registration-payment-express/';

    const { storeId } = state.settings;
    const results = await ClaretyApi.post(endpoint, postData, { storeId });
    const result = results[0];

    if (result && result.status !== 'error') {
      // Redirect on success.
      window.location.href = result.redirect;
    } else {
      dispatch(registrationSubmitFailure(result));
      dispatch(setErrors(result.validationErrors));
      return false;
    }
  };
};


// Create

const registrationCreateRequest = postData => ({
  type: types.registrationCreateRequest,
  postData: postData,
});

const registrationCreateSuccess = result => ({
  type: types.registrationCreateSuccess,
  result,
});

const registrationCreateFailure = result => ({
  type: types.registrationCreateFailure,
  result,
});

// Fetch

const registrationFetchRequest = id => ({
  type: types.registrationFetchRequest,
  id: id,
});

const registrationFetchSuccess = result => ({
  type: types.registrationFetchSuccess,
  result,
});

// Submit

const registrationSubmitRequest = postData => ({
  type: types.registrationSubmitRequest,
  postData: postData,
});

const registrationSubmitFailure = result => ({
  type: types.registrationSubmitFailure,
  result,
});
