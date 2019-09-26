// @ts-ignore
import CustomEvent from 'custom-event';

export const isOrContains = (container: Element, element: Element) =>
  container === element || container.contains(element);

export const updateState = (
  element: Element,
  attribute: string,
  targetState: string | null,
  callback: (() => void) | null = null
) => {
  if (element.getAttribute(attribute) !== targetState) {
    if (targetState === null) {
      element.removeAttribute(attribute);
    } else {
      element.setAttribute(attribute, targetState);
    }
    if (callback) {
      callback();
    }
  }
};

export const findFirstFocusableDescendant = (container: Element) =>
  container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

export const htmlCollectionToArray = (
  list: HTMLCollection
): Element[] => {
  const toReturn = [];

  /* tslint:disable:prefer-for-of */
  for (let index = 0; index < list.length; index++) {
    /* tslint:enable*/
    const element = list[index];
    toReturn.push(element);
  }

  return toReturn;
};

export const attributesToArray = (map: NamedNodeMap) => {
  const results: Attr[] = [];
  /* tslint:disable */
  for (let i = 0; i < map.length; i++) {
    /* tslint:enable */
    results.push(map[i]);
  }

  return results;
};

export const updateAndDispatch = (
  element: Element,
  attribute: string,
  targetState: string | null
) => {
  const stateUpdateEvent = new CustomEvent('clic-clac-state-update', {
    detail: {
      element,
      attribute,
      prevState: element.getAttribute(attribute),
      newState: targetState
    }
  });
  updateState(element, attribute, targetState, () =>
    element.dispatchEvent(stateUpdateEvent)
  );
};

export const switchAElementToButton = (tabElement: Element) => {
  if (tabElement.nodeName === 'A') {
    const buttonElement = document.createElement('button');
    const attributes = attributesToArray(tabElement.attributes);
    attributes.forEach(attr =>
      buttonElement.setAttributeNode(attr.cloneNode(true) as Attr)
    );
    buttonElement.innerHTML = tabElement.innerHTML;
    buttonElement.removeAttribute('href');
    buttonElement.setAttribute('type', 'button');
    const tabParent = tabElement.parentElement as HTMLElement;
    tabParent.insertBefore(buttonElement, tabElement);
    tabParent.removeChild(tabElement);
    return buttonElement;
  } else {
    return tabElement;
  }
};

export const generateCaughtError = <T>(message: string, defaultData: T) => {
  try {
    throw new Error(message);
  } catch (e) {
    /* tslint:disable */
    console.error(`Caught error : ${message}`);
    /* tslint:enable */
    return defaultData;
  }
};
