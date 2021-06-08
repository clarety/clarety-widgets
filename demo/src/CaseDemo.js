import React from 'react';
import { renderWidget, CaseWidget, initTranslations } from '../../src/';
import { CaseFormPanel, CaseFormConnect } from '../../src/case/components';

const renderCaseWidget = async (props) => {
  await initTranslations({
    translationsPath: 'translations/{{lng}}.json',
    defaultLanguage: 'th',
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
    <CaseWidget {...props} />
  );
};

export default class CaseDemo extends React.Component {
  componentDidMount() {
    renderCaseWidget({
      elementId: 'case-widget-demo',
      caseTypeUid: 'ctp_7lvr', // baseline
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
