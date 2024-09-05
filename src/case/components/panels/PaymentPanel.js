import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { _PaymentPanel as BasePaymentPanel, PanelBody, PanelFooter, injectStripe } from 'shared/components';
import { SubmitButton } from 'form/components';
import { CartSummary, PromoCodeForm } from 'checkout/components';

export class _PaymentPanel extends BasePaymentPanel {
  onShowPanel() {
    super.onShowPanel();

    const { cartStatus, offerUid } = this.props;
    if (!cartStatus) {
      this.createSale(offerUid);
    }
  }

  async createSale(offerUid) {
    const { createCart, fetchPaymentMethods, fetchAllowedPaymentMethods } = this.props;
    await createCart({ offerUid, quantity: 1 });
    await fetchAllowedPaymentMethods();
    await fetchPaymentMethods();
  }

  renderContent() {
    const { layout, isBusy } = this.props;
    const paymentMethod = this.getSelectedPaymentMethod();
    if (!paymentMethod) return null;

    return (
      <React.Fragment>
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <Row>
            <Col lg={6} className="order-lg-2">
              {this.renderCartSummary()}
            </Col>
            <Col lg={6}>
              {this.renderErrorMessages()}
              {this.renderPaymentMethodOptions()}
              {this.renderPaymentFields(paymentMethod)}
              {this.renderTermsCheckbox()}
            </Col>
          </Row>
        </PanelBody>

        {this.renderFooter()}
      </React.Fragment>
    );
  }

  renderCartSummary() {
    return (
      <React.Fragment>
        <div className="cart-summary">
          <CartSummary allowEdit={false} />
        </div>

        <PromoCodeForm
          onPromoCodeApplied={this.props.fetchAllowedPaymentMethods}
        />
      </React.Fragment>
    );
  }

  renderFooter() {
    const { layout, isBusy } = this.props;
    if (layout === 'page') return null;

    const paymentType = this.props.formData['payment.type'];

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Row className="justify-content-center">
          <Col>
            {paymentType !== 'wallet--paypal' &&
              <SubmitButton
                title={this.getSubmitBtnText()}
              />
            }
          </Col>
        </Row>

        {this.renderTerms()}
      </PanelFooter>
    );
  }
}

export const PaymentPanel = injectStripe(_PaymentPanel);
