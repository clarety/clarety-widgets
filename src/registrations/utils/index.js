import React from 'react';

export const FormContext = React.createContext();
export const OverrideContext = React.createContext();

export const currentYear = new Date().getFullYear();

export function withOverrides(Component, overrides) {
  class Wrapper extends React.Component {
    render() {
      return (
        <OverrideContext.Provider value={overrides}>
          <Component {...this.props} />
        </OverrideContext.Provider>
      );
    }
  };

  Wrapper.displayName = `withOverrides(${Component.name})`;

  return Wrapper;
}

export function iterate(from, to, callback) {
  const results = [];

  if (from < to) {
    // Count upwards.
    for (let index = from; index <= to; index++) {
      results.push(callback(index));
    }
  } else {
    // Count downwards.
    for (let index = from; index >= to; index--) {
      results.push(callback(index));
    }
  }

  return results;
}

export function calcProgress(participantCount, participantIndex) {
  return 40 + (40 / participantCount) * (participantIndex + 1);
}
