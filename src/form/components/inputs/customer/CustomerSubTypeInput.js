import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { getCustomerSubTypeOptions } from 'shared/selectors';
import { getFormData } from 'shared/selectors';
import { SelectInput } from 'form/components';

export const _CustomerSubTypeInput = ({ options, formData, customerSubTypeField = 'customer.subtype', readOnly }) => {
  return (
    <React.Fragment>
      <Form.Row>
        <Col>
          <Form.Group controlId="customerSubType">
            <Form.Label>{t('subType', 'Sub Type')}</Form.Label>
            <SelectInput
              field={customerSubTypeField}
              options={options}
              initialValue={options[0].value}
              testId="customer-sub-type-input"
              disabled={readOnly}
              required
            />
          </Form.Group>
        </Col>
      </Form.Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state, ownProps) => ({
  formData: getFormData(state),
  options: getCustomerSubTypeOptions(state)
});

export const CustomerSubTypeInput = connect(mapStateToProps)(_CustomerSubTypeInput);


