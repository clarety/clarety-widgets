import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { t } from 'shared/translations';
import { getLanguages } from 'shared/selectors';
import { changeLanguage } from 'shared/actions';

const _LanguageSelect = ({ languages, changeLanguage }) => (
  <Select
    value=""
    placeholder={t('label.changeLanguage', 'Change Language')}
    onChange={([code, language]) => changeLanguage(code)}
    options={Object.entries(languages)}
    getOptionValue={([code, language]) => code}
    getOptionLabel={([code, language]) => getLanguageName(language)}
    className="language-select"
    classNamePrefix="react-select"
  />
);

const mapStateToProps = (state, ownProps) => ({
  languages: getLanguages(state),
});

const actions = { changeLanguage };

export const LanguageSelect = connect(mapStateToProps, actions)(_LanguageSelect);

function getLanguageName(language) {
  return language
      && language.translation
      && language.translation.app
      && language.translation.app.language;
}
