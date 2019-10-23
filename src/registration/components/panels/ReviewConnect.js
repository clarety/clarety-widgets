import { createRegistration, submitRegistration } from 'registration/actions';

export class ReviewConnect {
  static mapStateToProps = (state) => {
    return {
      hasErrors: state.errors.length > 0,
      registration: state.cart.items,
    };
  };

  static actions = {
    createRegistration: createRegistration,
    submitRegistration: submitRegistration,
  };
}
