import React from 'react';
import { connect } from 'react-redux';
import { Col, Form } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { TextInput, Button } from 'checkout/components';
import { statuses, applyPromoCode } from 'checkout/actions';

class _PromoCodeForm extends React.Component {
  onPressApplyDiscount = event => {
    event.preventDefault();

    const { promoCode } = this.props.formData;
    this.props.applyPromoCode(promoCode);
  };

  render() {
    const { isBusy } = this.props;

    return (
      <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
        <Form onSubmit={this.onPressApplyDiscount} className="promo-code-form">
          <Form.Row>
            <Col>
              <TextInput field="promoCode" placeholder="Discount Code" />
            </Col>
            <Col xs="auto">
              <Button
                title="Apply"
                type="submit"
                isBusy={isBusy}
              />
            </Col>
          </Form.Row>
        </Form>
      </BlockUi>
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.status === statuses.busyPromoCode,
    formData: state.formData,
    errors: state.errors,
  };
};

const actions = {
  applyPromoCode: applyPromoCode,
};

export const PromoCodeForm = connect(mapStateToProps, actions)(_PromoCodeForm);
