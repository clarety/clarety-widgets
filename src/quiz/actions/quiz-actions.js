import { ClaretyApi } from 'clarety-utils';
import { setStatus, removePanels, insertPanels, setPanelStatus, setPanelSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getCustomerPanelSettingsFromWidgetProps } from 'lead-gen/utils';
import { getQuizPostData } from 'quiz/selectors';
import { QuestionPanel, QuestionConnect } from 'quiz/components';
import { types } from './types';

export const setupPanels = (props) => {
  return async (dispatch, getState) => {
    const state = getState();

    const resultsOnly = getSetting(state, 'resultsOnly');
    if (resultsOnly) {
      // Remove question and customer panels.
      // TODO: what about other panels?
      dispatch(removePanels({ withComponent: 'QuestionPanel' }));
      dispatch(removePanels({ withComponent: 'CustomerPanel' }));
      dispatch(setPanelStatus(0, 'edit'));
    } else {
      // Setup question and customer panels.
      dispatch(setupQuestionPanels());
      dispatch(setupCustomerPanel(props));
    }

  };
};

const setupQuestionPanels = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const questions = getSetting(state, 'questions');

    dispatch(removePanels({ withComponent: 'QuestionPanel' }));

      const questionPanels = questions.map(question => ({
        component: QuestionPanel,
        connect: QuestionConnect,
        data: { question },
      }));

      dispatch(insertPanels({
        atIndex: 0,
        panels: questionPanels,
      }));

      dispatch(setPanelStatus(0, 'edit'));
  };
};

const setupCustomerPanel = (props) => {
  return async (dispatch, getState) => {
    if (props.caseTypeUid) {
      const panelSettings = getCustomerPanelSettingsFromWidgetProps(props);
      dispatch(setPanelSettings('CustomerPanel', panelSettings));
    } else {
      // Remove customer panel if we don't have a case type.
      dispatch(removePanels({ withComponent: 'CustomerPanel' }));
    }
  };
};

export const submitQuiz = () => {
  return async (dispatch, getState) => {
    // executeRecaptcha(async () => {
      const state = getState();
      const { settings } = state;

      dispatch(setStatus('busy'));

      const postData = getQuizPostData(state);
      dispatch(submitQuizRequest(postData));

      const results = await ClaretyApi.post(`quizes/${settings.formId}/answers/`, postData);
      const result = results[0];

      if (result.status === 'error') {
        dispatch(submitQuizFailure(result));
        dispatch(setErrors(result.validationErrors));
        dispatch(setStatus('ready'));
        return false;
      } else {
        dispatch(submitQuizSuccess(result));
        
        if (settings.confirmPageUrl) {
          // Redirect.
          // TODO: set 'jwtConfirm' cookie?
          window.location.href = settings.confirmPageUrl;
        } else {
          return true;
        }
      }
    // });
  };
};


export const submitQuizRequest = (postData) => ({
  type: types.submitQuizRequest,
  postData: postData,
});

export const submitQuizSuccess = (result) => ({
  type: types.submitQuizSuccess,
  result: result,
});

export const submitQuizFailure = (result) => ({
  type: types.submitQuizFailure,
  result: result,
});
