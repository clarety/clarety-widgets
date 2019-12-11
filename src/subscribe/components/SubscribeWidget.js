import React from 'react';
import { InputGroup } from 'react-bootstrap';
import { _FormWidget, TextInput, ErrorMessages, SubmitButton } from 'form/components';
import { connectFormToStore } from 'form/utils';
import { subscribe } from 'subscribe/actions';

export class _SubscribeWidget extends _FormWidget {
  className = 'clarety-subscribe-widget';
  endpoint = 'subscriptions/';

  async componentDidMount() {
    super.componentDidMount();

    const { updateAppSettings, setTrackingData } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      storeCode: this.props.storeCode,
      caseTypeUid: this.props.caseTypeUid,
      confirmPageUrl: this.props.confirmPageUrl,
      nameOption: this.props.nameOption,
    });

    const { sourceUid, responseId, emailResponseId } = this.props;
    setTrackingData({ sourceUid, responseId, emailResponseId });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.props.submitForm();
  };

  renderForm() {
    const { caseTypeUid, nameOption, buttonText } = this.props;
    if (!caseTypeUid) throw new Error('[Clarety] caseTypeUid prop is required');

    return (
      <div>
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
      </div>
    );
  }

  renderSuccess() {
    // TODO: show cms confirm content...
    return (
      <div>
        Thanks for subscribing!
      </div>
    );
  }
}

export const SubscribeWidget = connectFormToStore(_SubscribeWidget, subscribe);
