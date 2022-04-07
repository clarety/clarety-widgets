import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { getCustomerTypeOptions } from 'shared/utils';
import { getFormData } from 'shared/selectors';
import { TextInput, SelectInput } from 'form/components';

export const _CustomerTypeInput = ({ formData, customerTypeField = 'customer.type', businessNameField = 'customer.businessName', readOnly }) => {
  const showBusinessName = formData[customerTypeField] === 'business';
  const customerTypeOptions = getCustomerTypeOptions();

  return (
    <React.Fragment>
      <Form.Row>
        <Col>
          <Form.Group controlId="customerType">
            <Form.Label>{t('type', 'Type')}</Form.Label>
            <SelectInput
              field={customerTypeField}
              options={customerTypeOptions}
              initialValue={customerTypeOptions[0].value}
              testId="customer-type-input"
              disabled={readOnly}
              required
            />
          </Form.Group>
        </Col>
      </Form.Row>

      {showBusinessName &&
        <Form.Row>
          <Col>
            <Form.Group controlId="businessName">
              <Form.Label>{t('business-name', 'Business Name')}</Form.Label>
              <TextInput
                field={businessNameField}
                testId="business-name-input"
                readOnly={readOnly}
                required
              />
            </Form.Group>
          </Col>
        </Form.Row>
      }
    </React.Fragment>
  );
};

const mapStateToProps = (state, ownProps) => ({
  formData: getFormData(state)
});

export const CustomerTypeInput = connect(mapStateToProps)(_CustomerTypeInput);
