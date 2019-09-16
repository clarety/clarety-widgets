import React from 'react';
import { FormattedMessage } from 'react-intl';

export const Qty = ({ type, qty }) => {
  if (!qty) return null;

  return (
    <React.Fragment>
      <FormattedMessage
        id={`qtys.${type}`}
        values={{ qty }}
      />
      <br />
    </React.Fragment>
  );
};
