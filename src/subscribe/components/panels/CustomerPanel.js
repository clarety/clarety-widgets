import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { requiredField, emailField } from 'shared/utils';
import { InputGroup } from 'react-bootstrap';
import { TextInput, ErrorMessages, SubmitButton } from 'form/components';

export class CustomerPanel extends BasePanel {
  onClickSubmit = async (event) => {
    event.preventDefault();

    const didValidate = this.validate();
    if (!didValidate) return;
    
    const didSubmit = await this.props.onSubmit();
    if (!didSubmit) return;

    this.props.nextPanel();
  };

  validate() {
    const { formData, setErrors, settings } = this.props;
    const errors = [];

    requiredField(errors, formData, 'customer.email');
    emailField(errors, formData, 'customer.email');

    if (settings.nameOption === 'firstandlast') {
      requiredField(errors, formData, 'customer.firstName');
      requiredField(errors, formData, 'customer.lastName');
    }

    if (settings.nameOption === 'full') {
      requiredField(errors, formData, 'customer.fullName');
    }

    setErrors(errors);
    return errors.length === 0;
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title="Personal Details"
          intlId="customerPanel.waitTitle"
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index, isBusy, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={settings.title}
          subtitle={settings.subtitle}
          intlId="customerPanel.editTitle"
        />

        <PanelBody status="edit" layout={layout} isBusy={isBusy}>
          <ErrorMessages />
          {this.renderCustomerForm()}
        </PanelBody>
      </PanelContainer>
    );
  }

  renderCustomerForm() {
    const { isBusy, settings } = this.props;
    const { nameOption, buttonText } = settings;

    return (
      <Form onSubmit={this.onClickSubmit}>
        
        <ErrorMessages />

        <InputGroup>
          {(nameOption === 'firstandlast' || !nameOption) &&
            <React.Fragment>
              <TextInput field="customer.firstName" placeholder="First Name" />
              <TextInput field="customer.lastName" placeholder="Last Name" />
            </React.Fragment>
          }

          {nameOption === 'full' &&
            <TextInput field="customer.fullName" placeholder="Full Name" />
          }
          
          <TextInput field="customer.email" type="email" placeholder="Email" />

          <InputGroup.Append>
            <SubmitButton title={buttonText || 'Sign Up'} />
          </InputGroup.Append>
        </InputGroup>

      </Form>
    );
  }

  renderDone() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
