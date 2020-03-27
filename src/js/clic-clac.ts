/**
 * @license MIT
 * @author mynameislau
 * @url http://github.com/mynameislau/clic-clac
 */
import * as expandInner from './expand';
import * as tablistInner from './tablist';

export const expand = expandInner;
export const tablist = tablistInner;

export const init = () => {
  expand.init();
  tablist.init();
};
