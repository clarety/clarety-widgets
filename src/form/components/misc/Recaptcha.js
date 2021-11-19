import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const _ref = React.createRef();
let _resolve = null;

// Execute the reCaptcha programmatically,
// returns a promise that will resolve to a token string or null.
export const executeRecaptcha = () => new Promise(resolve => {
  if (location.hostname === 'localhost') {
    resolve('dev-recaptcha');
  } else {
    _resolve = resolve;
    _ref.current.reset();
    _ref.current.execute();
  }
});

export const Recaptcha = ({ siteKey, language }) => (
  <ReCAPTCHA
    ref={_ref}
    size="invisible"
    sitekey={siteKey}
    hl={language}
    onChange={(value) => _resolve(value)}
    onErrored={() => _resolve(null)}
    onExpired={() => _resolve(null)}
  />
);
