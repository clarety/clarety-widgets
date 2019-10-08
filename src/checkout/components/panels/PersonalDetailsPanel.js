import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { statuses } from 'shared/actions';
import { setFormData } from 'form/actions';
import { BasePanel, TextInput, PhoneInput, DobInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { FormContext } from 'checkout/utils';

class _PersonalDetailsPanel extends BasePanel {
  onPressContinue = event => {
    event.preventDefault();

    if (this.validate()) {
      this.props.setFormData(this.state.formData);
      this.props.nextPanel();
    }
  };

  validate() {
    const errors = [];

    this.validateRequired('customer.firstName', errors);
    this.validateRequired('customer.lastName', errors);

    this.validateRequired('customer.dateOfBirthDay', errors);
    this.validateRequired('customer.dateOfBirthMonth', errors);
    this.validateRequired('customer.dateOfBirthYear', errors);

    this.validateRequired('sale.source', errors);

    this.setState({ errors });
    return errors.length === 0;
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);

    if (this.props.customer !== prevProps.customer) {
      this.prefillCustomerData(this.props.customer);
    }

    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors });
      this.checkForErrors();
    }
  }

  checkForErrors() {
    let foundError = false;

    if (this.hasError('customer.firstName'))        foundError = true;
    if (this.hasError('customer.lastName'))         foundError = true;
    if (this.hasError('customer.phone1'))           foundError = true;
    if (this.hasError('customer.phone2'))           foundError = true;
    if (this.hasError('customer.mobile'))           foundError = true;
    if (this.hasError('customer.dateOfBirthDay'))   foundError = true;
    if (this.hasError('customer.dateOfBirthMonth')) foundError = true;
    if (this.hasError('customer.dateOfBirthYear'))  foundError = true;

    if (foundError) {
      this.props.editPanel();
    }
  }

  prefillCustomerData(customer) {
    let formData = {};

    if (customer) {
      formData = {
        'customer.firstName':        customer.firstName,
        'customer.lastName':         customer.lastName,
        'customer.phone1':           customer.phone1,
        'customer.phone2':           customer.phone2,
        'customer.mobile':           customer.mobile,
        'customer.dateOfBirthDay':   customer.dateOfBirthDay,
        'customer.dateOfBirthMonth': customer.dateOfBirthMonth,
        'customer.dateOfBirthYear':  customer.dateOfBirthYear,
      };
    }

    this.setState({ formData });
  }

  renderWait() {
    const { index } = this.props;
    
    return (
      <WaitPanelHeader number={index + 1} title="Personal Details" />
    );
  }

  renderEdit() {
    const { isBusy, index } = this.props;

    return (
      <div className="panel">
        <EditPanelHeader number={index + 1} title="Personal Details" />
        
        <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
          <FormContext.Provider value={this.state}>
            <Form onSubmit={this.onPressContinue}>
              <Form.Row>
                <Col sm={6}>
                  <TextInput field="customer.firstName" placeholder="First Name *" />
                </Col>
                <Col sm={6}>
                  <TextInput field="customer.lastName" placeholder="Last Name *" />
                </Col>
              </Form.Row>

              <Form.Row>
                <Col sm={6}>
                  <PhoneInput field="customer.phone1" placeholder="Home Phone" />
                </Col>
                <Col sm={6}>
                  <PhoneInput field="customer.phone2" placeholder="Work Phone" />
                </Col>
              </Form.Row>

              <Form.Row>
                <Col sm={6}>
                  <PhoneInput field="customer.mobile" placeholder="Mobile Phone" />
                </Col>
                <Col sm={6}>
                </Col>
              </Form.Row>

              <Form.Row>
                <Col>Date of Birth *</Col>
              </Form.Row>

              <DobInput
                field="customer.dateOfBirth"
                dayField="customer.dateOfBirthDay"
                monthField="customer.dateOfBirthMonth"
                yearField="customer.dateOfBirthYear"
              />

              <Form.Row>
                <Col>
                  <TextInput field="sale.source" placeholder="How did you hear about us? *" />
                </Col>
              </Form.Row>

              <div className="text-right mt-3">
                <Button title="Continue" type="submit" />
              </div>
            </Form>
          </FormContext.Provider>
        </BlockUi>
      </div>
    );
  }

  renderDone() {
    const { index } = this.props;
    const { formData } = this.state;
    const firstName = formData['customer.firstName'];
    const lastName = formData['customer.lastName'];
    const phone = formData['customer.phone1'] || formData['customer.phone2'] || formData['customer.mobile'];

    let title = `${firstName} ${lastName}`;
    if (phone) title += `, ${phone}`;

    return (
      <DonePanelHeader
        number={index + 1}
        title={title}
        onPressEdit={this.onPressEdit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.status === statuses.busy,
    customer: state.cart.customer,
    errors: state.errors,
  };
};

const actions = {
  setFormData: setFormData,
};

export const PersonalDetailsPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_PersonalDetailsPanel);
