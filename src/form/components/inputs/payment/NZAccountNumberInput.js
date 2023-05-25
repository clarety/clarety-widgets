import React from 'react';
import { connect } from 'react-redux';
import { TextInput, FieldError } from 'form/components';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';

export class _NZAccountNumberInput extends React.Component {
  onPaste = (event) => {
    event.preventDefault();
    const value = event.clipboardData.getData('text').replace(/[^0-9]/g, '');

    const bankCode = value.substr(0, 2);
    const branchCode = value.substr(2, 4);
    const accountNumber = value.substr(6, 7);
    const suffixCode = value.substr(13, 3);

    const { updateFormData } = this.props;
    updateFormData(this.props.bankCodeField, bankCode);
    updateFormData(this.props.branchCodeField, branchCode);
    updateFormData(this.props.accountNumberField, accountNumber);
    updateFormData(this.props.suffixCodeField, suffixCode);
  };

  render() {
    return (
      <React.Fragment>
        <div className="nz-dd-input">
          <TextInput
            field={this.props.bankCodeField}
            className="nz-dd-input__bank-code"
            placeholder="00"
            maxLength={2}
            type="tel"
            required
            onPaste={this.onPaste}
            hideErrors
          />

          <TextInput
            field={this.props.branchCodeField}
            className="nz-dd-input__branch-code"
            placeholder="0000"
            maxLength={4}
            type="tel"
            required
            hideErrors
          />

          <TextInput
            field={this.props.accountNumberField}
            className="nz-dd-input__account-number"
            placeholder="0000000"
            maxLength={7}
            type="tel"
            required
            hideErrors
          />

          <TextInput
            field={this.props.suffixCodeField}
            className="nz-dd-input__suffix-code"
            placeholder="000"
            maxLength={3}
            type="tel"
            required
            hideErrors
          />
        </div>

        <FieldError error={this.props.error} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const bankCodeError      = getValidationError(ownProps.bankCodeField, state.errors);
  const branchCodeError    = getValidationError(ownProps.branchCodeField, state.errors);
  const accountNumberError = getValidationError(ownProps.accountNumberField, state.errors);
  const suffixCodeError    = getValidationError(ownProps.suffixCodeField, state.errors);

  const error = (bankCodeError || branchCodeError || accountNumberError || suffixCodeError)
    ? { message: 'Please enter a valid account number.' }
    : undefined;

  return { error };
};

const actions = {
  updateFormData: updateFormData,
};

export const NZAccountNumberInput = connect(mapStateToProps, actions)(_NZAccountNumberInput);
