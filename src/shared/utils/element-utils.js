export const findElement = (propertyName, elements) => {
  const properties = propertyName.split('.');

  let resultElement = { elements };

  for (let property of properties) {
    const testElements = resultElement.elements;
    let found = false;

    for (let testElement of testElements) {
      if (testElement.property === property) {
        resultElement = testElement;
        found = true;
        break;
      }
    }

    if (!found) throw new Error(`[Clarety] property "${propertyName}" not found.`);
  }

  return resultElement;
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
