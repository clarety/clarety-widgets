import React from 'react';
import { connect } from 'react-redux';
import { updateFormData } from 'form/actions';

class _FormElement extends React.Component {
  componentDidMount() {
    const { field, value, updateFormData } = this.props;
    updateFormData(field, value);
  }

  render() {
    return null;
  }
}

const actions = {
  updateFormData: updateFormData,
};

export const FormElement = connect(null, actions)(_FormElement);
