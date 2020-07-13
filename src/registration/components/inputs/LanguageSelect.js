import React from 'react';
import { Form } from 'react-bootstrap';

export const LanguageSelect = ({ languages, onChange }) => (
  <Form.Control
    as="select"
    onChange={event => onChange(event.target.value)}
    className="language-select"
  >
    <option>Select Language</option>

    {languages && Object.entries(languages).map(([code, language]) =>
      <option key={code} value={code}>{getLanguageName(language)}</option>
    )}
  </Form.Control>
);

function getLanguageName(language) {
  return language
      && language.translation
      && language.translation.app
      && language.translation.app.language;
}
