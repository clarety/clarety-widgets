import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { t } from 'shared/translations';
import { getLanguages } from 'shared/selectors';
import { changeLanguage } from 'shared/actions';

const _LanguageSelect = ({ languages, changeLanguage }) => {
  if (!languages) return null;

  return (
    <Dropdown className="language-select">
      <Dropdown.Toggle size="sm">
        {t('label.changeLanguage', 'Change Language')}
      </Dropdown.Toggle>

      <Dropdown.Menu alignRight>
        {Object.entries(languages).map(([code, language]) =>
          <Dropdown.Item key={code} onClick={() => changeLanguage(code)}>
            {getLanguageName(language)}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

function getLanguageName(language) {
  return language
      && language.translation
      && language.translation.app
      && language.translation.app.language;
}

const mapStateToProps = (state, ownProps) => ({
  languages: getLanguages(state),
});

const actions = { changeLanguage };

export const LanguageSelect = connect(mapStateToProps, actions)(_LanguageSelect);
