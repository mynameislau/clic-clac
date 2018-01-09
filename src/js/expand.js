import queryAll from './query-all';
import 'events-polyfill';
import { isOrContains, updateAndDispatch } from './utils';

const expandObjectsMap = {};

const setIsInitialState = (element, initialState = false) => {
  updateAndDispatch(element, 'data-initial-state', initialState ? 'true' : 'false');
};

const refreshState = (expandObj, initialState = false) => {
  expandObj.controllerElements.forEach(controllerElement => {
    updateAndDispatch(controllerElement, 'aria-pressed', expandObj.expanded ? 'true' : 'false');
    setIsInitialState(controllerElement, initialState);
  });

  updateAndDispatch(expandObj.controlledElement, 'aria-expanded', expandObj.expanded ? 'true' : 'false');

  setIsInitialState(expandObj.controlledElement, initialState);

  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }
};

const preventScrollToAnchor = expandObj => {
  const { controlledID } = expandObj;

  if (expandObj.expanded === false) {
    expandObj.controlledElement.setAttribute('id', '');
    window.requestAnimationFrame(() => {
      expandObj.controlledElement.setAttribute('id', controlledID);
    });
  }
};

const changeExpandedState = expandObj => {
  expandObj.expanded = !expandObj.expanded;

  refreshState(expandObj);

  preventScrollToAnchor(expandObj);
};

const addController = (expandObj, element) => {
  expandObj.controllerElements.push(element);

  element.setAttribute('aria-controls', expandObj.controlledID);
};

const expandIfAnchored = expandObj => {
  try {
    // Will not work on old IEs
    if (window.document.querySelector(':target') === expandObj.controlledElement) {
      changeExpandedState(expandObj);
    }
  }
  catch (error) {
    // Todo
  }
};

const createExpand = controllerElement => {
  const controlledID = controllerElement.getAttribute('data-controls');
  const controlledElement = window.document.getElementById(controlledID);
  const defaultState = controllerElement.getAttribute('data-expand-default-state') === 'true';
  const controlledRole = controlledElement.getAttribute('role');

  const expandObj = {
    controllerElements: [],
    controlledElement: controlledElement,
    controlledID: controlledID,
    defaultState: defaultState,
    expanded: defaultState
  };

  const controllerElements = expandObj.controllerElements;

  expandObj.controlledElement.setAttribute('role', controlledRole ? controlledRole : 'region');

  window.document.documentElement.addEventListener('click', event => {
    const controllerElem = controllerElements.reduce(
      (prev, curr) => isOrContains(curr, event.target) ? curr : prev,
      null
    );

    if (controllerElem) {
      changeExpandedState(expandObj);
    }
  });

  refreshState(expandObj, true);

  addController(expandObj, controllerElement);

  refreshState(expandObj, false);

  expandIfAnchored(expandObj);

  return expandObj;
};

export const addExpand = controllerElement => {
  const ID = controllerElement.getAttribute('data-controls');

  if (expandObjectsMap[ID]) {
    addController(expandObjectsMap[ID], controllerElement);
  }
  else {
    expandObjectsMap[ID] = createExpand(controllerElement);
  }
};

queryAll('[data-expand]').forEach(addExpand);
