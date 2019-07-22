import ReactDOM from 'react-dom';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { ClaretyConfig } from 'shared/services';

export function renderWidget(elementId, component) {
  const element = document.getElementById(elementId);
  if (element) {
    ReactDOM.render(component, element);
  } else {
    if (ClaretyConfig.get('env') === 'dev') {
      console.log(`[Clarety] Not rendering widget, element id '${elementId}' not found.`);
    }
  }
};

export function scrollIntoView(component) {
  const node = ReactDOM.findDOMNode(component);
  scrollIntoViewIfNeeded(node, {
    scrollMode: 'if-needed',
    block: 'start',
    behavior: 'smooth',
  });
}
