import React from 'react';
import { connect } from 'react-redux';
import { Col, Form } from 'react-bootstrap';
import { TextInput, Button } from 'checkout/components';
import { updateFormData, updateCheckout } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _DiscountCodeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      errors: [],
      onChange: this.onChangeField,
    };
  }

  onChangeField = (field, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
    }));
  };

  onPressApplyDiscount = event => {
    event.preventDefault();

    const { promoCode } = this.state.formData;
    this.props.updateFormData({ promoCode });
    this.props.updateCheckout({ isDiscountCode: true });
  };

  render() {
    const { promoCode } = this.state.formData;

    return (
      <FormContext.Provider value={this.state}>
        <Form onSubmit={this.onPressApplyDiscount}>
          <Form.Row>
            <Col>
              <TextInput field="promoCode" placeholder="Discount Code" />
            </Col>
            <Col xs="auto">
              <Button
                title="Apply"
                type="submit"
                isBusy={this.props.isBusy}
                disabled={!promoCode}
              />
            </Col>
          </Form.Row>
        </Form>
      </FormContext.Provider>
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.checkout.isBusyDiscountCode,
  };
};

const actions = {
  updateFormData: updateFormData,
  updateCheckout: updateCheckout,
};

export const DiscountCodeForm = connect(mapStateToProps, actions)(_DiscountCodeForm);
