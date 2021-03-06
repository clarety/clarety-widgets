export const mapCaseSettings = (settings) => {
  const { extendForm } = settings;
  if (extendForm) {
    extendForm.name = '';

    if (extendForm.extendFields && extendForm.extendFields[0].type === 'section') {
      extendForm.sections = splitFormIntoSections(extendForm);
    }
  }

  return settings;
};

function splitFormIntoSections(form) {
  const sections = [];

  let currentSection = null;
  for (const field of form.extendFields) {
    if (field.type === 'section') {
      currentSection = {
        name: field.question || field.label,
        explanation: field.explanation,
        extendFields: [],
      };
      sections.push(currentSection);
    } else {
      currentSection.extendFields.push(field);
    }
  }

  return sections;
}

export function walkFlattenedKeys(obj, callback, keyPrefix = '') {
  for (const [key, value] of Object.entries(obj)) {
    if (isObject(value)) {
      walkFlattenedKeys(value, callback, keyPrefix + key + '.');
    } else {
      callback(keyPrefix + key, value);
    }
  }
}

function isObject(obj) {
  return obj && obj.constructor.name === 'Object';
}
