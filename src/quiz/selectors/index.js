import { getSetting, getParsedFormData } from 'shared/selectors';

export const getQuestions = (state) => {
  return getSetting(state, 'questions');
};

export const getQuizPostData = (state) => {
  const formData = getParsedFormData(state);

  return {
    answers: formData.answers,
  };
};
