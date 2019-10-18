import React from 'react';

export const OverrideContext = React.createContext();

export function withOverrides(Component, overrides) {
  class Wrapper extends React.Component {
    // Pass through static functions.
    static setPanels(panels) { Component.setPanels(panels); }
    static setClientIds(ids) { Component.setClientIds(ids); }
    static setShowAddress(showAddress) { Component.setShowAddress(showAddress); }

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
