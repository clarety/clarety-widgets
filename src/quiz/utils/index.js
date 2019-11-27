export const settingsMap = (result) => {
  // convert each option.isCorrect from "1" or "0" to true or false.

  return {
    ...result,
    questions: result.questions.map(question => {
      return {
        ...question,
        options: question.options.map(option => ({
          ...option,
          isCorrect: option.isCorrect === '1',
        })),
      };
    }),
  };
};
