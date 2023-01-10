import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter, Currency } from 'shared/components';
import { SubmitButton, ErrorMessages } from 'form/components';

export class MembershipPanel extends BasePanel {
  state = {
    selectedMembershipUid: null,
  };

  onShowPanel() {
    const { layout, membershipOffers } = this.props;

    if (layout === 'tabs') {
      this.scrollIntoView();
    }

    // Pre-select the first membership option.
    if (!this.state.selectedMembershipUid && membershipOffers && membershipOffers.length) {
      this.onSelectMembership(membershipOffers[0]);
    }
  }

  onEditPanel() {
    this.props.removeAllMembershipsFromCart();
  }

  onPressBack = (event) => {
    event.preventDefault();
    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, layout } = this.props;

    if (layout === 'page') return;

    const isValid = this.validate();
    if (!isValid) return;
    
    const selectedOffer = this.getSelectedOffer();
    const didSubmit = await onSubmit(selectedOffer);
    if (!didSubmit) return;

    nextPanel();
  };

  onSelectMembership = (offer) => {
    this.setState({ selectedMembershipUid: offer.offerUid });
  };

  getSelectedOffer = () => this.props.membershipOffers.find(offer => offer.offerUid === this.state.selectedMembershipUid);

  validate() {
    const errors = [];
    this.validateFields(errors);
    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    if (!this.state.selectedMembershipUid) {
      errors.push({ message: 'Please select a membership option' });
    }
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="membership-panel">
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
    return (
      <form onSubmit={this.onPressNext}>
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { layout, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="membership-panel">
        {this.renderHeader()}

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          {this.renderErrorMessages()}
          {this.renderMembershipSelect()}
        </PanelBody>

        {this.renderFooter()}
      </PanelContainer>
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

  renderErrorMessages() {
    if (this.props.layout === 'page') return null;
    return <ErrorMessages />;
  }

  renderMembershipSelect() {
    return (
      <div className="membership-options">
        {this.props.membershipOffers.map(this.renderMembershipOption)}
      </div>
    );
  }

  renderMembershipOption = (offer) => {
    const isSelected = this.state.selectedMembershipUid === offer.offerUid;
    const className = `membership-option ${isSelected ? 'selected' : ''}`;

    return (
      <Button
        key={offer.offerUid}
        onClick={() => this.onSelectMembership(offer)}
        variant="outline-primary"
        className={className}
      >
        <span className="name">{offer.name}</span>
        <br />
        <span className="amount"><Currency amount={offer.amount} /></span>
      </Button>
    );
  }

  renderFooter() {
    const { layout, isBusy, settings } = this.props;
    if (layout === 'page') return null;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Form.Row className="justify-content-center">
          <Col xs={12}>
            <SubmitButton
              title={settings.submitBtnText || t('next', 'Next')}
              isDisabled={!this.state.selectedMembershipUid}
            />
          </Col>
        </Form.Row>
      </PanelFooter>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="membership-panel">
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
