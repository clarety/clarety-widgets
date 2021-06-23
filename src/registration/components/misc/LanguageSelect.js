import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { t } from 'shared/translations';
import { getSetting, getIsEditingFirstPanel } from 'shared/selectors';

const _LanguageSelect = ({ languages, isEditingFirstPanel }) => {
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
          <Dropdown.Item key={code} onClick={() => i18next.changeLanguage(code)}>
            {language}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const mapStateToProps = (state, ownProps) => ({
  languages: getSetting(state, 'languages'),
  isEditingFirstPanel: getIsEditingFirstPanel(state),
});

export const LanguageSelect = connect(mapStateToProps, null)(_LanguageSelect);
