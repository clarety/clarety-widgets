import React from 'react';
import { renderWidget, CaseWidget, initTranslations } from '../../src/';
import { CaseFormPanel, CaseFormConnect } from '../../src/case/components';
import '../../src/case/style.scss';

const renderCaseWidget = async (props) => {
  await initTranslations({
    translationsPath: [
      'extra-translations/{{lng}}.json',
      'translations/{{lng}}.json',
    ],
    defaultLanguage: 'en',
  });

  CaseWidget.init();
  
  CaseWidget.setPanels([
    {
      component: CaseFormPanel,
      connect: CaseFormConnect,
      settings: {
        showPhoneCountrySelect: true,
        submitBtnText: props.submitBtnText,
        saveBtnText: props.saveBtnText,
      },
    },
  ]);

  renderWidget(props.elementId,
    <CaseWidget showStepIndicator {...props} />
  );
};

export default class CaseDemo extends React.Component {
  componentDidMount() {
    renderCaseWidget({
      elementId: 'case-widget-demo',
      
      // caseTypeUid: 'ctp_7lvr', // baseline
      caseTypeUid: 'ctp_w5kw', // a21

      allowSave: true,
      saveStage: '0',
      saveBtnText: 'Save For Later',

      submitStage: '1',
      submitBtnText: 'Send Enquiry',
      
      shownFields: [
        'customer.type',
        'customer.firstName',
        'customer.lastName',
        'customer.email',
        'customer.mobile',
        'customer.billingAddress',
        'customer.churchAttended',
        'extendFields.testcaseformformdatefield',
        'extendFields.testcaseformformfileupload',
        'extendFields.testcaseformformtextone',
        'extendFields.testcaseformformtexttwo',
        'extendFields.testcaseformformtextthree',
        'extendFields.testcaseformformtextfour',
        'extendFields.testcaseformformhellorad',
        'extendFields.testcaseformformhellotext',
        'extendFields.testcaseformformcheckboxone',
      ],
      requiredFields: [
        'customer.firstName',
        // 'extendFields.testcaseformformtexttwo',
      ],

      fieldTypes: {
        'customer.billingAddress': 'country',
      },
    });
  }

  render() {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col">
            <div id="case-widget-demo"></div>
          </div>
        </div>
      </div>
    );
  }
}
