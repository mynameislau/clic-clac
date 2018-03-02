export default (
  selector: string,
  context: HTMLElement | Document = window.document
) => {
  const elements = [];
  const results = context.querySelectorAll(selector);
  /* tslint:disable */
  for (let i = 0; i < results.length; i++) {
  /* tslint:enable */
    elements.push(results[i]);
  }

  return elements;
};
