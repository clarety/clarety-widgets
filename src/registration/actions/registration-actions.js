import { setErrors, clearErrors } from 'form/actions';
import { getCreateRegistrationPostData, getSubmitRegistrationPostData, getIsLoggedIn } from 'registration/selectors';
import { types, updateAuthCustomer } from 'registration/actions';
import { RegistrationApi } from 'registration/utils';

export const createRegistration = () => {
  return async (dispatch, getState) => {
    const state = getState();

    const postData = getCreateRegistrationPostData(state);
    const forceExpress = !getIsLoggedIn(state);

    dispatch(clearErrors());
    dispatch(registrationCreateRequest(postData));
    
    const result = await RegistrationApi.createRegistration(postData, { forceExpress });

    if (result.status !== 'error') {
      // If we have merch, update the delivery address of logged-in customer.
      if (postData.merchandise.length) dispatch(updateAuthCustomer());

      dispatch(registrationCreateSuccess(result));
      return true;
    } else {
      dispatch(registrationCreateFailure(result));
      dispatch(setErrors(result.validationErrors));
      return false;
    }
  };
};

export const submitRegistration = (paymentData) => {
  return async (dispatch, getState) => {
    const state = getState();
    const postData = getSubmitRegistrationPostData(state, paymentData);

    dispatch(registrationSubmitRequest(postData));

    const result = await RegistrationApi.submitRegistration(postData);

    if (result.status !== 'error') {
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

// Submit

const registrationSubmitRequest = postData => ({
  type: types.registrationSubmitRequest,
  postData: postData,
});

const registrationSubmitFailure = result => ({
  type: types.registrationSubmitFailure,
  result,
});
