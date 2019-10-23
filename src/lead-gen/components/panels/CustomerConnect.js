import { getIsBusy } from 'donate/selectors';
import { createLead } from 'lead-gen/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      errors: state.errors,


      // TODO: get these from the store...

      title: 'Save the Northern Quoll',
      subtitle: 'YES, I agree we need more Indigenous Rangers to protect the Northern Quoll',

      showOptIn: true,
      optInText: 'Yes, I want to hear updates from The Nature Conservancy on how this petition is progressing and their other work',

      submitBtnText: 'ACT NOW',

      addressType: 'postcode-only',
    };
  };

  static actions = {
    onSubmit: createLead,
  };
}
