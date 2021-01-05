import React from 'react';
import { connect } from 'react-redux';
import { t } from 'shared/translations';
import { getTitleOptions } from 'shared/selectors';
import { SelectInput } from 'form/components';

const _TitleInput = ({ field, placeholder, ...props }) => (
  <SelectInput
    field={field || 'customer.title'}
    placeholder={placeholder || t('title', 'Title')}
    {...props}
  />
);

const mapStateToProps = (state, ownProps) => ({
  options: getTitleOptions(state),
});

export const TitleInput = connect(mapStateToProps)(_TitleInput);
