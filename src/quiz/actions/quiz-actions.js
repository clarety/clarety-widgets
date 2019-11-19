import { ClaretyApi } from 'clarety-utils';
import { setStatus, updateAppSettings } from 'shared/actions';
import { removePanels, insertPanels, setPanelStatus } from 'shared/actions';
import { setErrors } from 'form/actions';
import { executeRecaptcha } from 'form/components';
import { getQuizPostData } from 'quiz/selectors';
import { QuestionPanel, QuestionConnect } from 'quiz/components';
import { types } from './types';

export const setQuestions = (questions) => {
  return async (dispatch, getState) => {
    dispatch(updateAppSettings({ questions }));

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
          // TODO: set 'jwtConfirm' cookie.
          window.location.href = settings.confirmPageUrl;
        } else {
          // TODO: show results...

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
