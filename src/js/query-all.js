export const queryAll = (selectorString, context) => {
  var element = context || document;
  return Array.prototype.slice.call(element.querySelectorAll(selectorString));
};
