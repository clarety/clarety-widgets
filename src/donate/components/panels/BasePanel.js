import React from 'react';
import { scrollIntoView } from 'shared/utils';

export class BasePanel extends React.Component {
  fields = [];

  hasError() {
    const { errors } = this.props;

    for (let field of this.fields) {
      if (errors.find(error => error.field === field)) {
        return true;
      }
    }

    return false;
  }

  scrollIntoView() {
    scrollIntoView(this);
  }
}
