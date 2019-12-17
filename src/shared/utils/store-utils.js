import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

export function configureStore(reducer, stateKey = undefined) {
  const preloadedState = stateKey ? loadState(stateKey) : undefined;

  const composeWithDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

  return createStore(reducer, preloadedState, enhancer);
}

function loadState(stateKey) {
  try {
    const serializedState = sessionStorage.getItem(stateKey);
    if (!serializedState) return undefined;

    const state = JSON.parse(serializedState);

    // Add 'isResumed' setting.
    state.settings = state.settings || {};
    state.settings.isResumed = true;
    
    return state;
  } catch (err) {
    return undefined;
  }
}

export function saveState(stateKey, state) {
  try {
    sessionStorage.setItem(stateKey, JSON.stringify(state));
  } catch (err) {
    // ignore...
  }
}

export function clearState(stateKey) {
  try {
    sessionStorage.removeItem(stateKey);
  } catch (err) {
    // ignore...
  }
}
