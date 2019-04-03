import React from 'react';
import { connect } from 'react-redux';
import { updateFormData } from '../actions';

class FormElement extends React.Component {
  componentWillMount() {
    const { property, value, updateFormData } = this.props;
    updateFormData(property, value);
  }

  render() {
    return null;
  }
}

const actions = {
  updateFormData: updateFormData,
};

export default connect(null, actions)(FormElement);
