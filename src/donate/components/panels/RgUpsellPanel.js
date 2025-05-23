import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter, Currency } from 'shared/components';
import { BackButton } from 'form/components';

export class RgUpsellPanel extends BasePanel {
  onPressBack = (event) => {
    event.preventDefault();
    this.props.prevPanel();
  };

  onSelectUpsell = (amount) => {
    const { rgUpsell, selectRgUpsell, nextPanel } = this.props;

    selectRgUpsell({
      offerUid: rgUpsell.offerUid,
      scheduleUid: rgUpsell.scheduleUid,
      scheduleName: rgUpsell.scheduleName,
      amount: amount,
    });

    nextPanel();
  };

  onSkipUpsell = () => {
    const { skipRgUpsell, nextPanel } = this.props;
    skipRgUpsell();
    nextPanel();
  };

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="rg-upsell-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={settings.title}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, settings, rgUpsell, currentAmount } = this.props;

    return (
      <form onSubmit={this.onPressNext} data-testid="rg-upsell-panel">
        <PanelContainer layout={layout} status="edit" className="rg-upsell-panel">
          {this.renderHeader()}

          <PanelBody layout={layout} status="edit" isBusy={isBusy}>
            <div className="upsell-description">
              {rgUpsell.description}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              {this.props.amounts.map((amount, index) => (
                <Button key={index} variant="primary" onClick={() => this.onSelectUpsell(amount)}>
                  <Currency amount={amount} hideCents={settings.hideCents} /> {rgUpsell.scheduleName}
                </Button>
              ))}

              <Button variant="outline-primary" onClick={this.onSkipUpsell}>
                {t('keep-my-one-time-donation', 'Keep my one-time {{amount}} donation', { amount: currentAmount })}
              </Button>
            </div>
          </PanelBody>

          {this.renderFooter()}
        </PanelContainer>
      </form>
    );
  }

  renderHeader() {
    const { layout, index, settings } = this.props;
    if (settings.hideHeader) return null;

    return (
      <PanelHeader
        status="edit"
        layout={layout}
        number={index + 1}
        title={settings.title}
      />
    );
  }

  renderFooter() {
    const { layout, isBusy, settings, index } = this.props;
    if (layout === 'page') return null;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Form.Row className="justify-content-center">
          {index !== 0 &&
            <Col xs={6}>
              <BackButton
                title={settings.backBtnText || t('back', 'Back')}
                onClick={this.onPressBack}
              />
            </Col>
          }

          <Col xs={index !== 0 ? 6 : 12}>
            {/* no next button */}
          </Col>
        </Form.Row>
      </PanelFooter>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="rg-upsell-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={settings.title}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
