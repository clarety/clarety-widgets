import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import ReactPhoneNumberInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Config } from 'clarety-utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';
import { updateFormData } from 'checkout/actions';

class _RxPhoneInput extends React.Component {
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
    const { field, placeholder, error } = this.props;
    const country = Config.get('phoneCountry');

    const className = error ? 'form-control is-invalid' : 'form-control';

    return (
      <Form.Group controlId={field}>
        <ReactPhoneNumberInput
          value={this.state.value}
          onChange={this.onChange}
          onBlur={this.updateFormData}
          onKeyDown={this.onKeyDown}
          placeholder={placeholder}
          limitMaxLength={true}
          inputClassName={className}
          country={country}
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
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

export const RxPhoneInput = connect(mapStateToProps, actions)(_RxPhoneInput);
