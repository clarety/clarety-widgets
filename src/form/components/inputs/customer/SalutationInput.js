import React from 'react';
import { connect } from 'react-redux';
import { t } from 'shared/translations';
import { getSalutationOptions } from 'shared/selectors';
import { SelectInput } from 'form/components';

const _SalutationInput = ({ field, placeholder, ...props }) => (
  <SelectInput
    field={field || 'customer.salutation'}
    placeholder={placeholder || t('salutation', 'Salutation')}
    {...props}
  />
);

const mapStateToProps = (state, ownProps) => ({
  options: getSalutationOptions(state),
});

export const SalutationInput = connect(mapStateToProps)(_SalutationInput);
