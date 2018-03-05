export const isOrContains = (container: Element, element: Element) =>
  container === element || container.contains(element);

export const updateState = (
  element: Element,
  attribute: string,
  targetState: string,
  callback: (() => void) | null = null
) => {
  if (element.getAttribute(attribute) !== targetState) {
    element.setAttribute(attribute, targetState);
    if (callback) {
      callback();
    }
  }
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
  targetState: string
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
