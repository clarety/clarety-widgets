import React from 'react';
import { TextInput } from 'form/components';

const BACKSPACE_KEY =  8;
const TAB_KEY       =  9;
const SHIFT_KEY     = 16;

export class NZAccountNumberInput extends React.Component {
  onKeyUp = (event) => {
    const input = event.target;

    // Ignore tabbing and backspace.
    if (event.keyCode === TAB_KEY || event.keyCode === SHIFT_KEY || event.keyCode === BACKSPACE_KEY) {
      return;
    }

    // Focus next input.
    if (input.value.length === input.maxLength) {
      if (input.nextSibling) input.nextSibling.focus();
    }
  }

  onKeyDown = (event) => {
    const input = event.target;

    // Ignore tabbing.
    if (event.keyCode === TAB_KEY || event.keyCode === SHIFT_KEY) {
      return;
    }

    // Focus previous input.
    if (event.keyCode === BACKSPACE_KEY && input.value.length === 0) {
      event.preventDefault();
      if (input.previousSibling) input.previousSibling.focus();
    }
  };

  render() {
    return (
      <div className="nz-dd-input">
        <TextInput
          field={this.props.bankCodeField}
          className="nz-dd-input__bank-code"
          placeholder="00"
          maxLength={2}
          type="tel"
          required
          onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyDown}
        />

        <TextInput
          field={this.props.branchCodeField}
          className="nz-dd-input__branch-code"
          placeholder="0000"
          maxLength={4}
          type="tel"
          required
          onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyDown}
        />

        <TextInput
          field={this.props.accountNumberField}
          className="nz-dd-input__account-number"
          placeholder="0000000"
          maxLength={7}
          type="tel"
          required
          onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyDown}
        />

        <TextInput
          field={this.props.suffixCodeField}
          className="nz-dd-input__suffix-code"
          placeholder="000"
          maxLength={3}
          type="tel"
          required
          onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }
}
