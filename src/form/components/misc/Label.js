import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { t } from 'shared/translations';
import { getSetting } from 'shared/selectors';

function _Label({ required, htmlFor, children, requiredLabelType }) {
  let requiredLabel = null;
  if (requiredLabelType === '*' && required) {
    requiredLabel = ' *';
  } else if (requiredLabelType === 'optional' && !required) {
    requiredLabel = <span className="optional"> ({t('optional', 'Optional')})</span>;
  }

  return (
    <Form.Label htmlFor={htmlFor}>
      {children}{requiredLabel}
    </Form.Label>
  );
}

const mapStateToProps = (state, ownProps) => ({
  requiredLabelType: getSetting(state, 'requiredLabelType'),
});

export const Label = connect(mapStateToProps)(_Label);
