export const isOrContains = (container, element) =>
    container === element || container.contains(element);

export const updateState = (element, attribute, targetState) => {
  if (element.getAttribute(attribute) !== targetState) {
    element.setAttribute(attribute, targetState);
  }
};
