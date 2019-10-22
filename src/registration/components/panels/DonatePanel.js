import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Form } from 'react-bootstrap';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { clearItems } from 'shared/actions';
import { _AmountPanel } from 'donate/components/panels/widget/AmountPanel';
import { selectAmount, submitAmountPanel } from 'donate/actions';
import { getSelectedAmount } from 'donate/selectors';

export class _DonatePanel extends _AmountPanel {
  onClickNext = event => {
    event.preventDefault();

    this.props.nextPanel();
  };

  onClickEdit = event => {
    event.preventDefault();
    this.props.editPanel();
  }

  // TODO: remove once _AmountPanel extends BasePanel
  reset() {}

  // TODO: remove once _AmountPanel extends BasePanel
  render() {
    switch (this.props.status) {
      case 'wait': return this.renderWait();
      case 'edit': return this.renderEdit();
      case 'done': return this.renderDone();
    }
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
        />
        
        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index, frequency } = this.props;
    
    const offer = this._getOffer(frequency);
    const variableAmount = this._getVariableAmount(offer);

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          intlId="donatePanel.editTitle"
        />

        <PanelBody layout={layout} status="edit">
          <Form onSubmit={this.onClickNext}>

            <div className="card-deck flex-column mt-3 mx-n3 text-left flex-lg-row">
              {offer.amounts.map(this.renderSuggestedAmount)}
              {this.renderVariableAmount(variableAmount)}
            </div>

            <div className="panel-actions">
              <Button type="submit"> 
                <FormattedMessage id="btn.next" />
              </Button>
            </div>
            
          </Form>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index, selectedAmount } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          intlId="donatePanel.doneTitle"
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">

          <FormattedMessage
            id="donatePanel.summaryText"
            values={{ amount: selectedAmount }}
          >
            {text => <p className="lead">{text}</p>}
          </FormattedMessage>

          <Button onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </Button>

        </PanelBody>
      </PanelContainer>
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
