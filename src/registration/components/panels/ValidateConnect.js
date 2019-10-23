import { createRegistration } from 'registration/actions';

export class ValidateConnect {
  static mapStateToProps = (state) => {
    return {
      hasErrors: state.errors.length > 0,
    };
  };
  
  static actions = {
    createRegistration: createRegistration,
  };
}
