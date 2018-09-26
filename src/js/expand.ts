// @ts-ignore
import CustomEvent from 'custom-event';
import queryAll from './query-all';
import {
  isOrContains,
  updateAndDispatch,
  generateCaughtError,
  switchAElementToButton
} from './utils';

interface ExpandData {
  controllerElements: Element[];
  controlledElement: Element;
  controlledID: string;
  defaultState: boolean;
  expanded: boolean;
  clickOutside: string;
}

const expandObjects: ExpandData[] = [];

const setIsInitialState = (element: Element, initialState = false) => {
  updateAndDispatch(
    element,
    'data-initial-state',
    initialState ? 'true' : 'false'
  );
};

const refreshState = (expandObj: ExpandData, initialState = false) => {
  expandObj.controllerElements.forEach(controllerElement => {
    updateAndDispatch(
      controllerElement,
      'aria-pressed',
      expandObj.expanded ? 'true' : 'false'
    );
    setIsInitialState(controllerElement, initialState);
  });

  updateAndDispatch(
    expandObj.controlledElement,
    'aria-expanded',
    expandObj.expanded ? 'true' : 'false'
  );

  if (expandObj.controlledElement.nodeName === 'DIALOG') {
    updateAndDispatch(
      expandObj.controlledElement,
      'open',
      expandObj.expanded ? 'true' : null
    );
  }

  setIsInitialState(expandObj.controlledElement, initialState);

  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('resize'));
    });
  }
};

const preventScrollToAnchor = (expandObj: ExpandData) => {
  const { controlledID } = expandObj;

  if (expandObj.expanded === false) {
    expandObj.controlledElement.setAttribute('id', '');
    window.requestAnimationFrame(() => {
      expandObj.controlledElement.setAttribute('id', controlledID);
    });
  }
};

const changeExpandedState = (expandObj: ExpandData) => {
  expandObj.expanded = !expandObj.expanded;

  refreshState(expandObj);

  preventScrollToAnchor(expandObj);
};

const deselect = (expandObj: ExpandData) => {
  expandObj.expanded = false;

  refreshState(expandObj);

  preventScrollToAnchor(expandObj);
};

const addController = (expandObj: ExpandData, element: Element) => {
  element = switchAElementToButton(element);

  expandObj.controllerElements.push(element);
  element.setAttribute('aria-controls', expandObj.controlledID);

  if (element.nodeName !== 'BUTTON') {
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');

    element.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') {
        sendEventUpward(event);
      }
    });
  }
};

const expandIfAnchored = (expandObj: ExpandData) => {
  try {
    // Will not work on old IEs
    if (
      window.document.querySelector(':target') === expandObj.controlledElement
    ) {
      changeExpandedState(expandObj);
    }
  }
  catch (error) {
    // Todo
  }
};

const sendEventUpward = (event: Event) => {
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });

  if (event.target === null) {
    return generateCaughtError('event target is null', null);
  }

  event.target.dispatchEvent(clickEvent);
};

const createExpand = (controllerElement: Element): ExpandData | null => {
  const controlledID = controllerElement.getAttribute('data-controls');
  if (controlledID === null) {
    return generateCaughtError('data-controls attribute error', null);
  }
  const controlledElement = window.document.getElementById(controlledID);

  if (controlledElement === null) {
    return generateCaughtError(
      `element with ID ${controlledID} cannot be found`,
      null
    );
  }

  const defaultState
    = controllerElement.getAttribute('data-expand-default-state') === 'true';
  const controlledRole = controlledElement.getAttribute('role');

  const clickOutside
    = controlledElement.getAttribute('data-click-outside') || '';

  const expandObj: ExpandData = {
    controllerElements: [],
    controlledElement,
    controlledID,
    defaultState,
    expanded: defaultState,
    clickOutside
  };

  const controllerElements = expandObj.controllerElements;

  expandObj.controlledElement.setAttribute(
    'role',
    controlledRole ? controlledRole : 'region'
  );

  window.document.documentElement.addEventListener('click', event => {
    const controllerElem = controllerElements.reduce(
      (prev, curr) =>
        (isOrContains(curr, event.target as Element) ? curr : prev),
      null
    );

    if (controllerElem) {
      changeExpandedState(expandObj);
    }

    const isControlledElm = isOrContains(
      controlledElement,
      event.target as Element
    );

    if (!controllerElem && !isControlledElm && clickOutside === 'deselect') {
      deselect(expandObj);
    }
  });

  refreshState(expandObj, true);

  addController(expandObj, controllerElement);

  refreshState(expandObj, false);

  expandIfAnchored(expandObj);

  return expandObj;
};

export const getExpandObj = (id: string, list: ExpandData[]) =>
  list.reduce((acc, val) => {
    if (acc) {
      return acc;
    }
    if (val.controlledID === id) {
      return val;
    }
    return null;
  }, null);

export const addExpand = (controllerElement: Element) => {
  const ID = controllerElement.getAttribute('data-controls');

  if (ID === null) {
    return generateCaughtError('no data-controls attribute', null);
  }

  const expandObj = getExpandObj(ID, expandObjects);

  if (expandObj) {
    addController(expandObj, controllerElement);
  }
  else {
    const newExpand = createExpand(controllerElement);
    if (newExpand) {
      expandObjects.push(newExpand);
    }
  }
};

queryAll('[data-expand]').forEach(addExpand);
