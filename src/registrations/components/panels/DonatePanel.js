import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form } from 'react-bootstrap';
import { clearItems } from 'shared/actions';
import { _AmountPanel } from 'donate/components';
import { selectAmount, submitAmountPanel } from 'donate/actions';
import { getSelectedAmount } from 'donate/selectors';

export class _DonatePanel extends _AmountPanel {
  onClickNext = event => {
    event.preventDefault();

    this.props.nextPanel();
  };

  onClickEdit = event => {
    event.preventDefault();
    this.props.popToPanel();
  }

  // TODO: remove once _AmountPanel extends BasePanel
  render() {
    switch (this.props.status) {
      case 'wait': return this.renderWait();
      case 'edit': return this.renderEdit();
      case 'done': return this.renderDone();
    }
  }

  renderWait() {
    return null;
  }

  renderEdit() {
    const { frequency } = this.props;
    
    const offer = this._getOffer(frequency);
    const variableAmount = this._getVariableAmount(offer);

    return (
      <Container>
        <FormattedMessage id="donatePanel.editTitle" tagName="h2" />

        <Form onSubmit={this.onClickNext} className="panel-body panel-body-donate">

          <div className="card-deck flex-column mt-3 mx-n3 text-left flex-lg-row">
            {offer.amounts.map(this.renderSuggestedAmount)}
            {this.renderVariableAmount(variableAmount)}
          </div>

          <div className="text-center mt-5">
            <Button type="submit"> 
              <FormattedMessage id="btn.next" />
            </Button>
          </div>

        </Form>
      </Container>
    );
  }

  renderDone() {
    return (
      <Container>
        <FormattedMessage id="donatePanel.doneTitle" tagName="h4" />

        <FormattedMessage
          id="donatePanel.summaryText"
          values={{ amount: this.props.selectedAmount }}
        >
          {text => <p className="lead">{text}</p>}
        </FormattedMessage>

        <Button onClick={this.onClickEdit}>
          <FormattedMessage id="btn.edit" />
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { amountPanel } = state.panels;

  return {
    offers: state.settings.priceHandles,
    frequency: amountPanel.frequency,
    selections: amountPanel.selections,
    selectedAmount: getSelectedAmount(state),
    errors: state.cart.errors,
  };
};

const actions = {
  selectAmount: selectAmount,
  submitAmountPanel: submitAmountPanel,
  clearItems: clearItems,
};

export const connectDonatePanel = connect(mapStateToProps, actions, null, { forwardRef: true });
export const DonatePanel = connectDonatePanel(_DonatePanel);
