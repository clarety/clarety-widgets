import { ClaretyApi } from 'clarety-utils';

export const mapCaseSettings = (settings) => {
  if (settings.extendForm) {
    const { extendForm } = settings;

    extendForm.name = '';

    if (extendForm.extendFields && extendForm.extendFields[0].type === 'section') {
      extendForm.sections = splitFormIntoSections(extendForm);
    }
  } else {
    // Case types might not have an extend form,
    // if so, provide an empty one with no fields.
    settings.extendForm = {
      id: null,
      name: '',
      extendFields: [],
    };
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

export async function findAndAttemptCaseActionAuth() {
  // Check for action auth url param.
  const urlParams = new URLSearchParams(window.location.search);
  const actionKey = urlParams.get('clarety_action');
  if (actionKey) {
    const response = await ClaretyApi.get('cases/action-auth', { actionKey });
    const actionAuth = response[0] || null;

    if (actionAuth) {
      if (actionAuth.jwtCustomer) ClaretyApi.setJwtCustomer(actionAuth.jwtCustomer);
      if (actionAuth.jwtSession)  ClaretyApi.setJwtSession(actionAuth.jwtSession);
      return actionAuth;
    }
  }

  return null;
}
