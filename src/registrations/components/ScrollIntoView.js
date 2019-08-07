import React from 'react';
import { scrollIntoView } from 'registrations/utils';

export class ScrollIntoView extends React.PureComponent {
  ref = React.createRef();

  componentDidMount() {
    if (this.props.isActive) scrollIntoView(this.ref);
  }

  componentDidUpdate() {
    if (this.props.isActive) scrollIntoView(this.ref);
  }

  render() {
    return (
      <div ref={ref => this.ref = ref} className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}
