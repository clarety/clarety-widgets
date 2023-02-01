export const findElement = (field, elements) => {
  const element = recursiveFindElement(field, elements);
  if (!element) throw new Error(`[Clarety] element for field "${field}" not found.`);
  return element;
};

const recursiveFindElement = (field, elements) => {
  for (let element of elements) {
    if (element.field && element.field === field) {
      return element;
    }

    if (element.elements) {
      const nestedElement = recursiveFindElement(field, element.elements);
      if (nestedElement) return nestedElement;
    }
  }

  return null;
};

export const parseNestedElements = (data) => {
  const result = {};

  for (let property in data) {
    let value = data[property];
    let properties = property.split('.');
    addNestedElement(properties, value, result);
  }

  return result;
};

const addNestedElement = (properties, value, output) => {
  for (let [index, property] of properties.entries()) {
    if (index < properties.length - 1) {
      // This property is in the middle of the chain, create it if we haven't already.
      if (!output[property]) {
        // This property is an array if the next property contains only numbers (ie an array index),
        // otherwise it's an object.
        const isArray = /^\d+$/.test(properties[index + 1]);
        output[property] = isArray ? [] : {};
      }

      // step along the property chain.
      output = output[property];
    } else {
      // this is the last property in the chain, set the value.
      output[property] = value;
    }
  }
};

export const getElementOptions = (field, settings) => {
  if (!settings.elements) return null;

  const element = findElement(field, settings.elements);
  return element.options;
};
