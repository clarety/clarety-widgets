import React from 'react';
import { connect } from 'react-redux';
import { CustomerPanel } from 'shared/components/panels/CustomerPanel';
import { getIsBusy } from 'donate/selectors';
import { createLead } from 'lead-gen/actions';

const mapStateToProps = state => {
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

const actions = {
  onSubmit: createLead,
};

export const LeadGenCustomerPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(CustomerPanel);
