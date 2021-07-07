import React from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FrequencySelect } from 'shared/components';
import { currency } from 'shared/utils';
import { ErrorMessages, Button } from 'form/components';
import { PriceHandlesStandard, PriceHandlesPriceOnly } from 'donate/components';

export class DonationPanel extends BasePanel {
  constructor(props) {
    super(props);

    const defaults = this.getDefaults(props.priceHandles);
    this.state = { ...defaults };
  }

  onShowPanel() {
    if (this.props.onShowPanel) {
      this.props.onShowPanel();
    }
  }

  onChangeFrequency = (frequency) => {
    this.setState({ frequency });
  };

  onSelectAmount = (frequency, amount, isVariableAmount = false) => {
    this.setState(prevState => ({
      selections: {
        ...prevState.selections,
        [frequency]: {
          ...prevState.selections[frequency],
          amount,
          isVariableAmount,
          variableAmount: isVariableAmount ? amount : '',
        },
      },
    }));
  };

  onSelectSchedule = (offerPaymentUid) => {
    this.setState(prevState => ({
      selections: {
        ...prevState.selections,
        recurring: {
          ...prevState.selections.recurring,
          offerPaymentUid,
        },
      },
    }));
  };

  onClickNone = (event) => {
    event.preventDefault();

    this.onChangeFrequency('single');
    this.onSelectAmount('single', 0, false);

    this.props.nextPanel();
  };

  onClickNext = async (event) => {
    event.preventDefault();

    const { addToCart, nextPanel, layout } = this.props;
    const { frequency, selections } = this.state;

    if (layout === 'page') return;

    const selection = selections[frequency];

    this.setState({ isBusy: true });
    await addToCart({
      type:            'donation',
      offerUid:        selection.offerUid,
      offerPaymentUid: selection.offerPaymentUid,
      price:           selection.amount,
    });
    this.setState({ isBusy: false });

    nextPanel();
  };

  onPressEdit = (event) => {
    event.preventDefault();
    this.props.removeItemsWithType('donation');
    this.props.editPanel();
  }

  componentDidUpdate(prevProps) {
    const { priceHandles } = this.props;

    if (prevProps.priceHandles !== priceHandles) {
      const defaults = this.getDefaults(priceHandles);
      this.setState({ ...defaults });
    }
  }

  getDefaults(priceHandles) {
    const result = {
      frequency: null,
      selections: {},
    };

    if (priceHandles && priceHandles.length) {
      const defaultFrequency = priceHandles[0].frequency;
      const defaultSelections = {};

      for (let offer of priceHandles) {
        const defaultAmount = offer.amounts.find(amount => amount.default);
        const defaultOfferPaymentUid = offer.schedules ? offer.schedules[0].offerPaymentUid : undefined;

        defaultSelections[offer.frequency] = {
          offerUid:         offer.offerUid,
          offerPaymentUid:  defaultOfferPaymentUid,
          amount:           defaultAmount ? defaultAmount.amount : 0,
          isVariableAmount: false,
        };
      }

      result.frequency = defaultFrequency;
      result.selections = defaultSelections;
    }

    return result;
  }

  reset() {
    this.props.removeItemsWithType('donation');
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="donation-panel">
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
    const { layout, index, priceHandles } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="donation-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={t('donationPanel.editTitle', 'Make A Donation')}
        />
        <PanelBody layout={layout} status="edit">
          {priceHandles
            ? this.renderContent()
            : this.renderSpinner()
          }
        </PanelBody>
      </PanelContainer>
    );
  }

  renderContent() {
    const { settings } = this.props;
    const { frequency } = this.state;
    
    const offer = this.getOffer(frequency);
    if (!offer) return null;

    return (
      <Form onSubmit={this.onClickNext}>
        <p className="message-text">{t('donationPanel.message', settings.messageText || '')}</p>

        <ErrorMessages />

        {settings.showFrequencySelect &&
          <FrequencySelect
            value={frequency}
            onChange={this.onChangeFrequency}
          />
        }

        {this.renderPriceHandles()}

        <div className="panel-actions">
          {settings.showNoneButton &&
            <Button
              variant="secondary"
              onClick={this.onClickNone}
              isBusy={this.state.isBusyNone}
              disabled={this.state.isBusy}
            >
              {t(['donationPanel.btn.none', 'btn.none'], 'None')}
            </Button>
          }
          
          <Button
            type="submit"
            isBusy={this.state.isBusy}
            disabled={this.state.isBusyNone}
          >
            {t(['donationPanel.btn.next', 'btn.next'], 'Next')}
          </Button>
        </div>
      </Form>
    );
  }

  renderPriceHandles() {
    const { layout, settings, resources, errors } = this.props;
    const { frequency, selections } = this.state;

    const offer = this.getOffer(frequency);

    let PriceHandlesComponent;
    switch (settings.priceHandleStyle) {
      case 'price-only': PriceHandlesComponent = PriceHandlesPriceOnly; break;
      default:           PriceHandlesComponent = PriceHandlesStandard;  break;
    }

    return (
      <PriceHandlesComponent
        offer={offer}
        frequency={frequency}
        selections={selections}
        errors={errors}
        layout={layout}
        style={settings.priceHandleStyle}
        resources={resources}
        selectAmount={this.onSelectAmount}
        hideCents={settings.hideCents}
      />
    );
  }

  renderSpinner() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  renderDone() {
    const { layout, index } = this.props;
    const selectedAmount = this.getSelectedAmount();

    return (
      <PanelContainer layout={layout} status="done" className="donation-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={t('donationPanel.doneTitle', 'Your Donation')}
          onPressEdit={this.onPressEdit}
        />
        <PanelBody layout={layout} status="done">

          <p>{selectedAmount}</p>

          <Button onClick={this.onPressEdit}>
            {t('btn.edit', 'Edit')}
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }

  getOffer(frequency) {
    return this.props.priceHandles.find(offer => offer.frequency === frequency);
  }

  getSelectedAmount() {
    const { frequency, selections } = this.state;
  
    const selection = selections[frequency];
  
    if (!selection || !selection.amount || selection.amount === '0') return 'None';

    return currency(Number(selection.amount));
  }
}
