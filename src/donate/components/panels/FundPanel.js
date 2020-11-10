import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { SubmitButton, ErrorMessages, SelectInput } from 'form/components';

export class FundPanel extends BasePanel {
  onShowPanel() {
    if (this.props.layout === 'tabs') {
      this.scrollIntoView();
    }
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
    
    const didSubmit = await onSubmit();
    if (!didSubmit) return;

    nextPanel();
  };

  validate() {
    const errors = [];
    this.validateFields(errors);
    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    //NOTE: no fields require validation yet.
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="fund-panel">
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
      <form onSubmit={this.onPressNext} data-testid="fund-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { layout, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="fund-panel">
        {this.renderHeader()}

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          {this.renderErrorMessages()}
          {this.renderFundSelector()}
          {this.renderFundInfo()}
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

  renderFundSelector() {
    return (
      <SelectInput
        field="fundUid"
        placeholder={t('select-a-fund-placeholder', 'Select a Fund...')}
        options={this.props.fundOptions}
        initialValue={this.props.defaultFundUid}
      />
    );
  }

  renderFundInfo() {
    const { selectedFund } = this.props;
    if (!selectedFund) return null;

    return (
      <Row className="fund-info">
        <Col sm={4}>
          {selectedFund.image &&
            <img src={selectedFund.image} className="fund-info__image" />
          }
          {selectedFund.image2 &&
            <img src={selectedFund.image2} className="fund-info__image" />
          }
        </Col>

        <Col sm={8}>
          <h4 className="fund-info__title">{selectedFund.title}</h4>
          <p className="fund-info__description">{selectedFund.description}</p>
        </Col>
      </Row>
    );
  }

  renderFooter() {
    const { layout, isBusy, settings, selectedFund } = this.props;
    if (layout === 'page') return null;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Form.Row className="justify-content-center">
          <Col>
            <SubmitButton
              title={settings.submitBtnText || t('next', 'Next')}
              testId="next-button"
              isDisabled={!selectedFund}
            />
          </Col>
        </Form.Row>
      </PanelFooter>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="fund-panel">
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
