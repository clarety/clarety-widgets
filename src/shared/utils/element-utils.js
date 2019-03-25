export const getNestedElement = (propertyName, elements) => {
  const properties = propertyName.split('.');

  let element = elements;
  for (let property of properties) {
    element = element[property];
  }

  return element;
};

export const parseNestedElements = (data) => {
  const result = {};

  for (let property in data) {
    let value = data[property];
    let properties = property.split('.');
    _addNestedElement(properties, value, result);
  }

  return result;
};

const _addNestedElement = (properties, value, output) => {
  for (let [index, property] of properties.entries()) {
    if (!output[property]) output[property] = {};

    if (index < properties.length - 1) {
      output = output[property];
    } else {
      output[property] = value;
    }
  }
}
