import React from 'react';
import { connect } from 'react-redux';
import { Col, Form } from 'react-bootstrap';
import { TextInput, Button } from 'checkout/components';
import { applyPromoCode } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _PromoCodeForm extends React.Component {
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
    this.props.applyPromoCode(promoCode);
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
    isBusy: state.checkout.isBusyPromoCode,
  };
};

const actions = {
  applyPromoCode: applyPromoCode,
};

export const PromoCodeForm = connect(mapStateToProps, actions)(_PromoCodeForm);
