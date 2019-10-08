import React from 'react';

export const OverrideContext = React.createContext();

export function withOverrides(Component, overrides) {
  class Wrapper extends React.Component {
    // Pass through the static set panels function.
    static setPanels(panels) {
      Component.setPanels(panels);
    }

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
