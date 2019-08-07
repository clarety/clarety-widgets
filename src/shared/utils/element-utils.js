import mem from 'mem';

export const findElement = (field, elements) => {
  const element = _recursiveFindElement(field, elements);
  if (!element) throw new Error(`[Clarety] element for field "${field}" not found.`);
  return element;
};

const _recursiveFindElement = (field, elements) => {
  for (let element of elements) {
    if (element.field && element.field === field) {
      return element;
    }

    if (element.elements) {
      const nestedElement = _recursiveFindElement(field, element.elements);
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

export const getElementOptions = mem((field, init) => {
  const element = findElement(field, init.elements);
  return element.options;
});
