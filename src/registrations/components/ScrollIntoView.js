import React from 'react';

export class ScrollIntoView extends React.PureComponent {
  ref = React.createRef();

  scrollIntoView = () => {
    if (this.props.isActive) {
      // TODO: querySelector isn't very react-y...
      // Can we get a ref from the MiniCart component or something?
      const navbarElement = document.querySelector('.navbar');
      const navbarHeight = navbarElement ? navbarElement.offsetHeight : 0;

      var scrollTarget = this.ref.offsetTop - navbarHeight;
      window.scroll({ top: scrollTarget, behavior: 'smooth' });
    }
  };

  componentDidMount() {
    this.scrollIntoView();
  }

  componentDidUpdate() {
    this.scrollIntoView();
  }

  render() {
    return (
      <div ref={ref => this.ref = ref} className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}
