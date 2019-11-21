import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

export function configureStore(reducer, loadFromLocalStorage) {
  const preloadedState = loadFromLocalStorage ? loadState() : undefined;

  const composeWithDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

  return createStore(reducer, preloadedState, enhancer);
}

// TODO: need to uniquely identify each app on a domain...
const stateKey = 'state';

function loadState() {
  try {
    const state = localStorage.getItem(stateKey);
    return state ? JSON.parse(state) : undefined;
  } catch (err) {
    return undefined;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(stateKey, JSON.stringify(state));
  } catch (err) {
    // ignore...
  }
}

export function clearState() {
  try {
    localStorage.removeItem(stateKey);
  } catch (err) {
    // ignore...
  }
}
