import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';
import { updateFormData } from 'checkout/actions';

class _RxTextInput extends React.Component {
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

  render() {
    const { field, placeholder, type, error } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          value={this.state.value}
          onChange={this.onChange}
          onBlur={this.updateFormData}
          onKeyDown={this.onKeyDown}
          placeholder={placeholder}
          type={type}
          isInvalid={!!error}
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.formData[ownProps.field] || '',
    error: getValidationError(ownProps.field, state.checkout.errors), // TODO: state.errors...
  };
};

const actions = {
  updateFormData: updateFormData,
};

export const RxTextInput = connect(mapStateToProps, actions)(_RxTextInput);
