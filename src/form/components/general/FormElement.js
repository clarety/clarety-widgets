import React from 'react';
import { connect } from 'react-redux';
import { updateFormData } from '../../actions';

class FormElement extends React.Component {
  componentWillMount() {
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

export default connect(null, actions)(FormElement);
