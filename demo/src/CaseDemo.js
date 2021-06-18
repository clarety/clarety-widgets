import React from 'react';
import { renderWidget, CaseWidget, initTranslations } from '../../src/';
import { CaseFormPanel, CaseFormConnect } from '../../src/case/components';
import '../../src/case/style.scss';

const renderCaseWidget = async (props) => {
  await initTranslations({
    translationsPath: 'translations/{{lng}}.json',
    defaultLanguage: 'en',
  });

  CaseWidget.init();
  
  CaseWidget.setPanels([
    {
      component: CaseFormPanel,
      connect: CaseFormConnect,
      settings: {
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
      caseStage: 0,
      
      shownFields: [
        'customer.firstname',
        'customer.lastname',
        'customer.email',
        'customer.billingid',
        // 'customer.churchattended',
        'extendFields.testcaseformformfileupload',
        'extendFields.testcaseformformtextone',
        'extendFields.testcaseformformtexttwo',
        'extendFields.testcaseformformtextthree',
        'extendFields.testcaseformformtextfour',
      ],
      requiredFields: [
        // 'customer.firstname',
        // 'extendFields.testcaseformformtexttwo',
      ],

      fieldTypes: {
        'customer.billingid': 'country',
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
