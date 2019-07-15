import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import { ClaretyApi } from 'shared/services';
import { statuses } from 'shared/actions';
import { scrollIntoView } from 'shared/utils';
import { TextInput, SubmitButton, BackButton, ErrorMessages, FormElement } from '../../form/components';
import { StepIndicator } from '../components';
import { connectDetailsPanel } from '../utils';
import 'react-block-ui/style.css';

export class _DetailsPanel extends React.Component {
  componentDidMount() {
    scrollIntoView(this);
  }

  onPrev = () => this.props.history.goBack();

  onSubmit = async event => {
    const { status, setStatus, clearErrors, setErrors } = this.props;
    const { formData, updateFormData, saleline, history } = this.props;

    event.preventDefault();

    if (status !== statuses.ready) return;
    setStatus(statuses.busy);
    clearErrors();

    const postData = { ...formData, saleline };
    
    const result = await ClaretyApi.post('donations', postData);
    setStatus(statuses.ready);

    if (result) {
      if (result.validationErrors) {
        setErrors(result.validationErrors);
      } else {
        updateFormData('uid', result.uid);
        updateFormData('jwt', result.jwt);
        history.push('/payment');
      }
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} data-testid="details-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { forceMd, isBusy } = this.props;

    return (
      <Card>
        <Card.Header className="text-center">
          <StepIndicator currentStep="details" />
        </Card.Header>
    
        <Card.Body>
          <Row className="justify-content-center">
            <Col lg={forceMd ? null : 8}>

              <ErrorMessages />

              <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
            
                <Form.Row>
                  <Col sm>
                    <Form.Group controlId="firstName">
                      <Form.Label>First Name</Form.Label>
                      <TextInput field="customer.firstName" testId="first-name-input" />
                    </Form.Group>
                  </Col>
                  <Col sm>
                    <Form.Group controlId="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <TextInput field="customer.lastName" testId="last-name-input" />
                    </Form.Group>
                  </Col>
                </Form.Row>
        
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <TextInput field="customer.email" type="email" testId="email-input" />
                </Form.Group>

                <Form.Row>
                  <Col sm>
                    <Form.Group controlId="street">
                      <Form.Label>Street</Form.Label>
                      <TextInput field="customer.billing.address1" type="street" testId="street-input" />
                    </Form.Group>
                  </Col>
                  <Col sm>
                    <Form.Group controlId="suburb">
                      <Form.Label>Suburb</Form.Label>
                      <TextInput field="customer.billing.suburb" testId="suburb-input" />
                    </Form.Group>
                  </Col>
                </Form.Row>

                <Form.Row>
                  <Col sm>
                    <Form.Group controlId="state">
                      <Form.Label>State</Form.Label>
                      <TextInput field="customer.billing.state" testId="state-input" />
                    </Form.Group>
                  </Col>
                  <Col sm>
                    <Form.Group controlId="postcode">
                      <Form.Label>Postcode</Form.Label>
                      <TextInput field="customer.billing.postcode" testId="postcode-input" />
                    </Form.Group>
                  </Col>
                </Form.Row>

                <FormElement field="customer.billing.country" value="AU" />

              </BlockUi>

            </Col>
          </Row>
        </Card.Body>
    
        <Card.Footer>
          <Form.Row className="justify-content-center">
            <Col xs={4} lg={forceMd ? null : 2}>
              <BackButton title="Back" block onClick={this.onPrev} />
            </Col>
            <Col xs={8} lg={forceMd ? null : 3}>
              <SubmitButton title="Next" block testId="next-button" />
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }
}

export const DetailsPanel = connectDetailsPanel(_DetailsPanel);
