import React from 'react';
import { connect } from 'react-redux';
import { getValidationError } from 'form/utils';
import { updateFormData } from 'checkout/actions';

export class BaseInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.props.value });
    }
  }

  onChange = event => {
    this.setState({ value: event.target.value });
  };

  onKeyDown = event => {
    if (event.key === 'Enter') this.updateFormData();
  };

  updateFormData = () => {
    const { field, updateFormData } = this.props;
    updateFormData({ [field]: this.state.value });
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.formData[ownProps.field] || '',
    error: getValidationError(ownProps.field, state.errors),
  };
};

const actions = {
  updateFormData: updateFormData,
};

export const connectInput = connect(mapStateToProps, actions);
