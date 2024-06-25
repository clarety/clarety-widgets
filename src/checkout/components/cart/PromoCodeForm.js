import React from 'react';
import { connect } from 'react-redux';
import { Col, Form } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { t } from 'shared/translations';
import { statuses } from 'shared/actions';
import { FormContext } from 'shared/utils';
import { TextInput, Button } from 'checkout/components';
import { applyPromoCode } from 'checkout/actions';

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

  onPressApplyDiscount = (event) => {
    event.preventDefault();

    const { promoCode } = this.state.formData;
    this.props.applyPromoCode(promoCode);
  };

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  onKeyDown = (event) => {
    // enter/return key
    if (event.keyCode === 13 || event.keyCode === 169) {
      this.onPressApplyDiscount(event);
    }
  };

  render() {
    const { promoCode } = this.state.formData;
    const { isBusy, isDisabled } = this.props;

    return (
      <BlockUi tag="div" blocking={isDisabled} loader={<span></span>}>
        <FormContext.Provider value={this.state}>
          <div className="form promo-code-form">
            <Form.Row>
              <Col>
                <TextInput
                  field="promoCode"
                  label={t('promo-code', 'Discount Code')}
                  onKeyDown={this.onKeyDown}
                  hideLabel
                  required
                />
              </Col>
              <Col xs="auto">
                <Button
                  title={t('apply', 'Apply')}
                  isBusy={isBusy}
                  disabled={!promoCode}
                  onClick={this.onPressApplyDiscount}
                  type="button"
                />
              </Col>
            </Form.Row>
          </div>
        </FormContext.Provider>
      </BlockUi>
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.status === statuses.busyPromoCode,
    isDisabled: state.status !== statuses.ready,
    errors: state.errors,
  };
};

const actions = {
  applyPromoCode: applyPromoCode,
};

export const PromoCodeForm = connect(mapStateToProps, actions)(_PromoCodeForm);
