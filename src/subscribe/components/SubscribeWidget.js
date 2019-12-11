import React from 'react';
import { InputGroup } from 'react-bootstrap';
import { _FormWidget, TextInput, FormElement, ErrorMessages, SubmitButton } from 'form/components';
import { connectFormToStore } from 'form/utils';

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
    });

    const { sourceUid, responseId, emailResponseId } = this.props;
    setTrackingData({ sourceUid, responseId, emailResponseId });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const { submitForm, formData, nameOption } = this.props;

    if (nameOption === 'full') {
      // Split full name into first and last.
      const fullName = (formData['fullName'] || '').trim();
      const index = fullName.lastIndexOf(' ') + 1;
      const firstName = (index !== 0) ? fullName.substring(0, index - 1) : fullName;
      const lastName  = (index !== 0) ? fullName.substring(index, fullName.length) : '';

      formData['firstName'] = firstName;
      formData['lastName']  = lastName;
    }

    submitForm(this.endpoint, formData);
  };

  renderForm() {
    const { listCode, nameOption, buttonText } = this.props;
    if (!listCode) throw new Error('[Clarety] listCode prop is required');

    return (
      <div>
        <ErrorMessages />

        <FormElement field="code" value={listCode} />

        <InputGroup>
          {(nameOption === 'firstandlast' || !nameOption) &&
            <React.Fragment>
              <TextInput field="firstName" placeholder="First Name" />
              <TextInput field="lastName" placeholder="Last Name" />
            </React.Fragment>
          }

          {nameOption === 'full' &&
            <TextInput field="fullName" placeholder="Full Name" />
          }
          
          <TextInput field="email" type="email" placeholder="Email" />

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

export const SubscribeWidget = connectFormToStore(_SubscribeWidget);
