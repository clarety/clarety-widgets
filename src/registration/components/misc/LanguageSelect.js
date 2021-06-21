import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { t } from 'shared/translations';
import { getLanguages, getIsEditingFirstPanel } from 'shared/selectors';
import { changeLanguage } from 'shared/actions';

const _LanguageSelect = ({ languages, changeLanguage, isEditingFirstPanel }) => {
  if (!languages) return null;

  // Only show when on the first panel.
  if (!isEditingFirstPanel) return null;

  return (
    <Dropdown className="language-select">
      <Dropdown.Toggle size="sm">
        {t('label.changeLanguage', 'Change Language')}
      </Dropdown.Toggle>

      <Dropdown.Menu alignRight>
        {Object.entries(languages).map(([code, language]) =>
          <Dropdown.Item key={code} onClick={() => changeLanguage(code)}>
            {language}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const mapStateToProps = (state, ownProps) => ({
  languages: getLanguages(state),
  isEditingFirstPanel: getIsEditingFirstPanel(state),
});

const actions = { changeLanguage };

export const LanguageSelect = connect(mapStateToProps, actions)(_LanguageSelect);
