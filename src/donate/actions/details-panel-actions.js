import { push as pushRoute } from 'connected-react-router';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, setCustomer, updateCartData } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { setErrors, clearErrors } from 'form/actions';
import { updateCartRequest, updateCartSuccess, updateCartFailure } from 'donate/actions';

export const submitDetailsPanel = () => {
  return async (dispatch, getState) => {
    const { status, formData } = getState();

    if (status !== statuses.ready) return;

    dispatch(setStatus(statuses.busy));
    dispatch(clearErrors());

    const formDataObjs = parseNestedElements(formData);
    dispatch(setCustomer(formDataObjs.customer));

    const { cart } = getState();

    const postData = {
      store: cart.store,
      uid: cart.uid,
      jwt: cart.jwt,
      customer: cart.customer,
      saleline: cart.items[0],
    };

    dispatch(updateCartRequest(postData));
    
    const results = await ClaretyApi.post('donations/', postData);
    const result = results[0];

    dispatch(setStatus(statuses.ready));

    if (result.validationErrors) {
      dispatch(setErrors(result.validationErrors));
      dispatch(updateCartFailure(result));
    } else {
      dispatch(updateCartSuccess(result));
      dispatch(updateCartData({
        uid: result.uid,
        jwt: result.jwt,
        status: result.status,
        customer: result.customer,
        items: result.salelines,
      }));
      dispatch(pushRoute('/payment'));
    }
  };
};
