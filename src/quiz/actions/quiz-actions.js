import { ClaretyApi } from 'clarety-utils';
import { setStatus, removePanels, insertPanels, setPanelStatus, setPanelSettings, updateAppSettings, setRecaptcha } from 'shared/actions';
import { getSetting, getFormData } from 'shared/selectors';
import { saveState, getCustomerPanelSettingsFromWidgetProps } from 'shared/utils';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { createLeadRequest, createLeadSuccess, createLeadFailure } from 'lead-gen/actions';
import { getLeadPostData } from 'lead-gen/selectors';
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
    dispatch(setStatus('busy'));

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    const state = getState();
    const { settings } = state;

    const postData = getQuizPostData(state);
    dispatch(submitQuizRequest(postData));

    const results = await ClaretyApi.post(`forms/quizzes/${settings.quizUid}/answers/`, postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(submitQuizFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(submitQuizSuccess(result));
      dispatch(updateVoteCounts());

      const caseUid = settings.caseTypeUid
        ? await dispatch(createLead(result.answersUid))
        : undefined;

      const stateKey = getSetting(state, 'stateKey');
      saveState(stateKey, {
        settings: state.settings,
        formData: state.formData,
        cart:     state.cart,
      });
      
      if (settings.confirmPageUrl) {
        // Redirect.
        // TODO: replace url param with jwt session cookie.
        const redirect = caseUid
          ? settings.confirmPageUrl + `?caseUid=${caseUid}`
          : settings.confirmPageUrl;
        window.location.href = redirect;
      } else {
        return true;
      }
    }
  };
};

export const updateVoteCounts = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const formData = getFormData(state);
    const questions = [...getSetting(state, 'questions')];

    // Increment vote count of questions and selected options.
    questions.forEach(question => {
      // Update total votes.
      question.totalVotes++;

      // Update vote count of selected option.
      const selectedValue = formData[`answers.${question.id}`];
      const selectedOption = question.options.find(option => option.value === selectedValue);
      selectedOption.votes++;

      // Calculate percentages.
      const percentages = [];

      for (let index = 0; index < question.options.length; index++) {
        const option = question.options[index];

        if (index < question.options.length - 1) {
          option.percentage = Math.floor(option.votes / question.totalVotes * 100).toFixed(0);
          percentages.push(option.percentage);
        } else {
          // To ensure percentages add up to 100, use the remainder as the last percentage.
          const sum = percentages.reduce((sum, percentage) => sum += Number(percentage), 0);
          option.percentage = (100 - sum).toFixed(0);
        }
      }
    });

    dispatch(updateAppSettings({ questions }));
  };
};

export const createLead = (answersUid) => {
  return async (dispatch, getState) => {
    const state = getState();

    const postData = getLeadPostData(state);
    postData.variant = 'quiz';
    postData.answersUid = answersUid;

    dispatch(createLeadRequest(postData));

    const results = await ClaretyApi.post('cases/leads/', postData);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(createLeadFailure(result));
      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus('ready'));
      return false;
    } else {
      dispatch(createLeadSuccess(result));
      return result.caseUid;
    }
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
