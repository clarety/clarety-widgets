import ReactDOM from 'react-dom';
import ClaretyConfig from '../utils/clarety-config';

function render(elementId, component) {
  const element = document.getElementById(elementId);
  if (element) {
    ReactDOM.render(component, element);
  } else {
    if (ClaretyConfig.get('env') === 'dev') {
      console.log(`[Clarety] Not rendering widget, element id '${elementId}' not found.`);
    }
  }
};

export default render;
