import React from 'react';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { setRecaptchaResponse } from 'shared/actions';

const recaptchaRef = React.createRef();
let _callback = null;

export function executeRecaptcha(callback) {
  _callback = callback;

  if (recaptchaRef.current) {
    recaptchaRef.current.execute();
  } else {
    callback();
  }
}

export class _Recaptcha extends React.Component {
  onResponse = response => {
    this.props.setRecaptchaResponse(response);
    if (_callback) _callback();
  };

  render() {
    if (!this.props.siteKey) return null;

    return (
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={this.props.siteKey}
        onChange={this.onResponse}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
  };
};

const actions = {
  setRecaptchaResponse: setRecaptchaResponse,
};

export const connectRecaptcha = connect(mapStateToProps, actions);
export const Recaptcha = connectRecaptcha(_Recaptcha);
