import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentData } from '../../../form/actions';
import { formatExpiry, cleanExpiry } from '../../utils/payment-utils';
import { getValidationError } from '../../../form/utils/form-utils';
import { FieldError } from '../../../form/components';
import './ExpiryInput.css';

class ExpiryInput extends React.Component {
  onKeyDown = event => {
    const { value } = event.target;

    // Backspace.
    if (event.which === 8) {
      // Remove both the ' / ' and the preceding digit.
      if (value.length === 5) {
        event.preventDefault();
        const newValue = value[0] === '0' ? '' : value.substring(0, 1);
        event.target.value = newValue;
      }

      const position = event.target.selectionStart;
      if (position !== value.length) {
        event.preventDefault();
        event.target.value = '';
      }
    }

    // Space or slash.
    if (event.which === 32 || event.which === 191) {
      // Add the ' / '.
      if (value === '1') {
        event.preventDefault();
        event.target.value = '01 / ';
      }
    }
  };

  render() {
    const { expiry, testId, onChange, error } = this.props;
    return (
      <>
        <Form.Control
          type="text"
          placeholder={'MM / YY'}
          value={expiry}
          onChange={onChange}
          onKeyDown={this.onKeyDown}
          data-testid={testId}
          isInvalid={error !== null}
          className="expiry-input"
        />
        <FieldError error={error} />
      </>
    );
  }
}

const mapStateToProps = state => {
  const { expiryMonth, expiryYear } = state.paymentData;

  return {
    expiry: formatExpiry(expiryMonth, expiryYear),
    error: getValidationError('expiry', state.errors),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: event => {
      const { month, year } = cleanExpiry(event.target.value);
      dispatch(updatePaymentData('expiryMonth', month));
      dispatch(updatePaymentData('expiryYear', year));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpiryInput);
