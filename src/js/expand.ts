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

let resizeRequested = false;
const requestResize = () => {
  if (!resizeRequested) {
    resizeRequested = true;
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('resize'));
        resizeRequested = false;
      });
    }
  }
};

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

  requestResize();
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

  // preventScrollToAnchor(expandObj);
};

const deselect = (expandObj: ExpandData) => {
  expandObj.expanded = false;

  refreshState(expandObj);

  // preventScrollToAnchor(expandObj);
};

const keypressEvent = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    sendEventUpward(event);
  }
};

const addController = (expandObj: ExpandData, element: Element) => {
  element = switchAElementToButton(element);

  expandObj.controllerElements.push(element);
  const previousAriaControls = element.getAttribute('aria-controls')
    ? `${element.getAttribute('aria-controls')} `
    : '';
  element.setAttribute(
    'aria-controls',
    `${previousAriaControls}${expandObj.controlledID}`
  );

  if (element.nodeName !== 'BUTTON') {
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');

    element.addEventListener('keypress', keypressEvent);
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
  } catch (error) {
    // Todo
    console.error(error);
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

const createExpand = (
  controllerElement: Element,
  controlledID: string
): ExpandData | null => {
  const controlledElement = window.document.getElementById(controlledID);

  if (controlledElement === null) {
    return generateCaughtError(
      `element with ID ${controlledID} cannot be found`,
      null
    );
  }

  const defaultState =
    controllerElement.getAttribute('data-expand-default-state') === 'true';
  const controlledRole = controlledElement.getAttribute('role');

  const clickOutside =
    controlledElement.getAttribute('data-click-outside') || '';

  const expandObj: ExpandData = {
    controllerElements: [],
    controlledElement,
    controlledID,
    defaultState,
    expanded: defaultState,
    clickOutside
  };

  // const controllerElements = expandObj.controllerElements;

  expandObj.controlledElement.setAttribute(
    'role',
    controlledRole ? controlledRole : 'region'
  );

  refreshState(expandObj, true);

  addController(expandObj, controllerElement);

  refreshState(expandObj, false);

  expandIfAnchored(expandObj);

  return expandObj;
};

window.document.documentElement.addEventListener('click', event => {
  expandObjects.forEach(expandObj => {
    const controllerElem = expandObj.controllerElements.reduce(
      (prev, curr) =>
        isOrContains(curr, event.target as Element) ? curr : prev,
      null
    );

    if (controllerElem) {
      changeExpandedState(expandObj);
    }

    const isControlledElm = isOrContains(
      expandObj.controlledElement,
      event.target as Element
    );

    if (
      !controllerElem &&
      !isControlledElm &&
      expandObj.clickOutside === 'deselect'
    ) {
      deselect(expandObj);
    }
  });
});

const getControlledIDS = (controllerElement: Element) => {
  const IDString = controllerElement.getAttribute('data-controls');

  if (IDString === null) {
    console.log(controllerElement);
    return generateCaughtError('no data-controls attribute', []);
  }

  const IDs = IDString.split(' ');

  return IDs;
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

export const removeExpandObject = (expandObject: ExpandData) => {
  expandObject.controlledElement.removeAttribute('aria-expanded');
  expandObjects.splice(expandObjects.indexOf(expandObject), 1);
};

export const addExpandObject = (newExpand: ExpandData) => {
  expandObjects.push(newExpand);
};

export const removeExpandController = (controllerElement: Element) => {
  const IDs = getControlledIDS(controllerElement);

  IDs.forEach(ID => {
    const expandObj = getExpandObj(ID, expandObjects);

    if (expandObj) {
      expandObj.controllerElements = expandObj.controllerElements.filter(
        curr => curr !== controllerElement
      );

      controllerElement.removeEventListener('keypress', keypressEvent);
      controllerElement.removeAttribute('aria-controls');
      controllerElement.removeAttribute('aria-pressed');
      if (controllerElement.getAttribute('role') === 'button') {
        controllerElement.removeAttribute('role');
        controllerElement.removeAttribute('tabindex');
      }

      if (expandObj.controllerElements.length === 0) {
        removeExpandObject(expandObj);
      }
    }
  });
};

export const removeExpand = (controlledElement: Element) => {
  const expandObj = getExpandObj(controlledElement.id, expandObjects);
  if (expandObj) {
    [...expandObj.controllerElements].forEach(removeExpandController);
  }
};

export const addExpand = (controllerElement: Element) => {
  const IDs = getControlledIDS(controllerElement);

  IDs.forEach(ID => {
    const expandObj = getExpandObj(ID, expandObjects);

    if (expandObj) {
      addController(expandObj, controllerElement);
    } else {
      const newExpand = createExpand(controllerElement, ID);
      if (newExpand) {
        expandObjects.push(newExpand);
      }
    }
  });
};

export const init = (selector: string = '[data-expand]') => {
  queryAll(selector).forEach(addExpand);
};
