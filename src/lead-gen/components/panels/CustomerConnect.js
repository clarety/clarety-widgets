import { getIsBusy } from 'donate/selectors';
import { createLead } from 'lead-gen/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      errors: state.errors,
    };
  };

  static actions = {
    onSubmit: createLead,
  };
}
