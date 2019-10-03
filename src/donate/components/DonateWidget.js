import React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from 'react-router-dom';
import { statuses, setVariant, setStore, setConfirmPageUrl, setTracking, fetchExplain } from 'shared/actions';
import { OverrideContext } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { AmountPanel, DetailsPanel, PaymentPanel, SuccessPanel } from 'donate/components';

export class _DonateWidget extends React.Component {
  componentWillMount() {
    const { setVariant, setStore, setConfirmPageUrl, setTracking, fetchExplain } = this.props;
    const { storeCode, singleOfferId, recurringOfferId, variant, confirmPageUrl, reCaptchaKey } = this.props;
    const { sourceId, responseId, emailResponseId } = this.props;

    if (!singleOfferId && !recurringOfferId) throw new Error('[Clarety] Either a singleOfferId or recurringOfferId prop is required');
    if (!reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');
    if (!window.Stripe) throw new Error('[Clarety] Stripe not found');

    setVariant(variant);
    setStore(storeCode);
    setConfirmPageUrl(confirmPageUrl);
    setTracking({ sourceId, responseId, emailResponseId });

    fetchExplain('donations/', {
      store: storeCode,
      offerSingle: singleOfferId,
      offerRecurring: recurringOfferId,
    });
  }

  render() {
    const { status, forceMdLayout, variant, reCaptchaKey } = this.props;

    const AmountPanelComponent  = this.context.AmountPanel  || AmountPanel;
    const DetailsPanelComponent = this.context.DetailsPanel || DetailsPanel;
    const PaymentPanelComponent = this.context.PaymentPanel || PaymentPanel;
    const SuccessPanelComponent = this.context.SuccessPanel || SuccessPanel;

    // Show a loading indicator while we init.
    if (status === statuses.initializing) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className="clarety-donate-widget h-100">
        <ConnectedRouter history={this.props.history}>
          <Switch>
            <Route exact path="/" render={props => (
              <AmountPanelComponent {...props} forceMd={forceMdLayout} variant={variant} />
            )}/>
            <Route path="/details" render={props => (
              <DetailsPanelComponent {...props} forceMd={forceMdLayout} variant={variant} />
            )}/>
            <Route path="/payment" render={props => (
              <PaymentPanelComponent {...props} forceMd={forceMdLayout} variant={variant} />
            )}/>
            <Route path="/success" render={props => (
              <SuccessPanelComponent {...props} forceMd={forceMdLayout} variant={variant} />
            )}/>
          </Switch>
        </ConnectedRouter>

        <Recaptcha siteKey={reCaptchaKey} />
      </div>
    );
  }
}

_DonateWidget.contextType = OverrideContext;

const mapStateToProps = state => {
  return {
    status: state.status,
  };
};

const actions = {
  setVariant: setVariant,
  setStore: setStore,
  setConfirmPageUrl: setConfirmPageUrl,
  setTracking: setTracking,
  fetchExplain: fetchExplain,
};

export const connectDonateWidget = connect(mapStateToProps, actions);
export const DonateWidget = connectDonateWidget(_DonateWidget);
