import React from 'react';
import { connect } from 'react-redux';
import { updateData } from '../actions/formDataActions';

class FormElement extends React.Component {
  componentWillMount() {
    const { property, value, updateData } = this.props;
    updateData(property, value);
  }

  render() {
    return null;
  }
}

const actions = {
  updateData: updateData,
};

export default connect(null, actions)(FormElement);
