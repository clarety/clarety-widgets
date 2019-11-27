import { ClaretyApi } from 'clarety-utils';
import { setStatus, removePanels, insertPanels, setPanelStatus, setPanelSettings, updateAppSettings } from 'shared/actions';
import { getSetting, getFormData } from 'shared/selectors';
import { saveState } from 'shared/utils';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getCustomerPanelSettingsFromWidgetProps } from 'lead-gen/utils';
import { getQuizPostData } from 'quiz/selectors';
import { QuestionPanel, QuestionConnect } from 'quiz/components';
import { types } from './types';

export const setupPanels = (props, resultsOnly) => {
  return async (dispatch, getState) => {
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
        dispatch(updateVoteCounts());

        const stateKey = getSetting(state, 'stateKey');
        saveState(stateKey, {
          settings: state.settings,
          formData: state.formData,
          cart:     state.cart,
        });
        
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

export const updateVoteCounts = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const formData = getFormData(state);
    const questions = getSetting(state, 'questions');

    // Increment vote count of questions and selected options.
    questions.forEach(question => {
      question.totalVotes++;

      const selectedValue = formData[`answers.${question.id}`];
      const selectedOption = question.options.find(option => option.value === selectedValue);
      selectedOption.votes++;
    });

    dispatch(updateAppSettings({ questions }));
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
