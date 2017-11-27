export const isOrContains = (container, element) =>
  container === element || container.contains(element);

export const updateState = (element, attribute, targetState, callback = undefined) => {
  if (element.getAttribute(attribute) !== targetState) {
    element.setAttribute(attribute, targetState);
    if (callback) {
      callback();
    }
  }
};

export const updateAndDispatch = (element, attribute, targetState) => {
  const stateUpdateEvent = new CustomEvent('clic-clac-state-update', {
    detail: {
      element: element,
      attribute: attribute,
      prevState: element.getAttribute(attribute),
      newState: targetState
    }
  });
  updateState(element, attribute, targetState, () => element.dispatchEvent(stateUpdateEvent));
};
