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

export const updateAndDispatch = (element: Element, attribute: string, targetState: string) => {
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
