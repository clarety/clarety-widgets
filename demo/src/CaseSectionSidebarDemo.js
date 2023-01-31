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
        showSectionSidebar: true,
        showPhoneCountrySelect: true,
        submitBtnText: props.submitBtnText,
        saveBtnText: props.saveBtnText,
        initialValues: {
          'customer.firstName': 'Test'
        },
        reorderCustomerFields: [
          // { move: 'customer.email', after: 'customer.firstName' },
          // { move: 'customer.mobile', before: 'customer.lastName' },
        ],
      },
    },
  ]);

  renderWidget(props.elementId,
    <CaseWidget {...props} />
  );
};

export default class CaseSectionSidebarDemo extends React.Component {
  componentDidMount() {
    renderCaseWidget({
      elementId: 'case-widget-demo',

      // allowSave: true,
      // saveStage: '0',
      // saveBtnText: 'Save For Later',

      submitStage: '1',
      // submitBtnText: 'Send Enquiry',

      // baseline
      caseTypeUid: 'ctp_q0lq', // Case Widget Section List Test
      shownFields: [
        'customer.type',
        'customer.firstName',
        'customer.lastName',
        'customer.email',
        'customer.mobile',
        'extendFields.casewidgetsectiontestformhelloinput1',
        'extendFields.casewidgetsectiontestformhelloinput2',
      ],
      requiredFields: [
        'customer.firstName',
      ],
      fieldTypes: {
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
