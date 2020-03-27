/**
 * @module Set a *data-tablist* attribute on the element that will be the tablist,
 * the value of the attribute
 * is the name of the tablist, you can leave it blank and use
 * the id attribute (used to fill the aria-owns attribute later)
 * You can specify if the tablist is multiselectable with the
 * data-multiselectable* attribute.
 * On each tab button, set a *data-tab-for* attribute which value is the id
 * of the controlled tab panel. Set a *data-owner* attribute
 * to specify the tablist that owns the tab.
 * Set a *data-expand-default-state* attribtue to true or false if you want
 * to specify a default state for this tab
 */

import 'core-js/fn/array/includes';
import queryAll from './query-all';
import {
  isOrContains,
  updateAndDispatch,
  attributesToArray,
  generateCaughtError,
  switchAElementToButton,
  htmlCollectionToArray
} from './utils';

// @ts-ignore
import CustomEvent from 'custom-event';

interface TabData {
  tabElement: Element;
  tabPanelElement: Element;
  defaultState: boolean;
  tablistID: string;
  tabID: string;
  tabPanelID: string;
  selected: boolean;
}

interface TablistData {
  tablistID: string;
  tabs: TabData[];
  keepOneTabSelected: boolean;
  multiselectable: boolean;
  tablistElement: Element;
  clickOutside: string | null;
}

const tablistArray: TablistData[] = [];

const anotherTabIsSelected = (tablist: TablistData, tab: TabData) => {
  return (
    tablist.tabs.filter(curr => {
      return (
        curr !== tab && curr.selected && curr.tabPanelID !== tab.tabPanelID
      );
    }).length > 0
  );
};

const tabIsRelated = (tab: TabData, tabPanelID: string) => {
  return tab.tabPanelID === tabPanelID;
};

const changeSelectedState = (targetTab: TabData, tablist: TablistData) => {
  const selected = !targetTab.selected;
  const shouldPreventDeselection =
    selected === false &&
    !anotherTabIsSelected(tablist, targetTab) &&
    tablist.keepOneTabSelected;

  const relatedTabs = tablist.tabs.filter(curr => {
    return tabIsRelated(curr, targetTab.tabPanelID);
  });

  if (shouldPreventDeselection) {
    return;
  }

  tablist.tabs.forEach(tab => {
    const isRelated = relatedTabs.indexOf(tab) !== -1;
    const shouldDeselect = !isRelated && !tablist.multiselectable;

    if (shouldDeselect) {
      tab.selected = false;
    }
    if (isRelated) {
      tab.selected = selected;
    }
  });
};

const setIsInitialState = (element: Element, initialState = false) => {
  updateAndDispatch(
    element,
    'data-initial-state',
    initialState ? 'true' : 'false'
  );
};

const getContainingElement = (parents: Element[], element: Element) =>
  parents.reduce(
    (prev, curr) => (isOrContains(curr, element) ? curr : prev),
    null
  );

const getContainingTab = (tabs: TabData[], element: Element) =>
  tabs.reduce(
    (prev, curr) => (isOrContains(curr.tabElement, element) ? curr : prev),
    null
  );

const refreshTabList = (tablist: TablistData, initialState = false) => {
  const isTabSelected = tablist.tabs.some(tab => tab.selected);

  updateAndDispatch(
    tablist.tablistElement,
    'aria-multiselectable',
    tablist.multiselectable ? 'true' : 'false'
  );
  updateAndDispatch(
    tablist.tablistElement,
    'data-has-selected-tab',
    isTabSelected ? 'true' : 'false'
  );

  tablist.tabs.forEach(tab => {
    const targetState = tab.selected ? 'true' : 'false';

    updateAndDispatch(tab.tabPanelElement, 'aria-expanded', targetState);
    updateAndDispatch(tab.tabElement, 'aria-selected', targetState);
    updateAndDispatch(
      tab.tabPanelElement,
      'data-tablist-has-tab-selected',
      isTabSelected ? 'true' : 'false'
    );

    setIsInitialState(tab.tabPanelElement, initialState);
    setIsInitialState(tab.tabElement, initialState);

    tab.tabPanelElement.className = tab.tabPanelElement.className;

    // Fix ie8 reflow bug
    tab.tabElement.className = tab.tabElement.className;
  });
};

const deselectAll = (tablist: TablistData) => {
  tablist.tabs.forEach(tab => {
    tab.selected = false;
  });
  refreshTabList(tablist);
};

const concatWithSpace = (prev: string, val: string) => `${prev} ${val}`;

const addAttributesToTab = (tab: TabData) => {
  tab.tabElement.setAttribute('role', 'tab');
  tab.tabElement.setAttribute('id', tab.tabID);
  tab.tabElement.setAttribute('aria-controls', tab.tabPanelID);
  tab.tabPanelElement.setAttribute('aria-labelledby', tab.tabID);
  tab.tabPanelElement.setAttribute('role', 'tabpanel');

  /*
   * Tab.tabElement.addEventListener('click', () => {
   *   changeSelectedState(tab, tablist);
   *   refreshTabList(tablist);
   * });
   */
};

const delegateClickHandler = (
  tabElements: Element[],
  tablist: TablistData,
  tabPanelElements: Element[]
) => (event: MouseEvent) => {
  const eventTarget = event.target as Element;

  const containingTabElement = getContainingElement(tabElements, eventTarget);
  const containingPanelElement = getContainingElement(
    tabPanelElements,
    eventTarget
  );
  const containingTab = getContainingTab(tablist.tabs, eventTarget) as TabData;
  const isInTabElements = containingTabElement !== null;
  const isInPanelElements = containingPanelElement !== null;
  const isOutside = !isInTabElements && !isInPanelElements;

  if (isInTabElements) {
    changeSelectedState(containingTab, tablist);
    refreshTabList(tablist);
  }

  if (isOutside && tablist.clickOutside === 'deselect') {
    deselectAll(tablist);
  }
};

const addTablistAttributes = (tablist: TablistData) => {
  tablist.tablistElement.setAttribute('id', tablist.tablistID);
  tablist.tablistElement.setAttribute('role', 'tablist');
  tablist.tablistElement.setAttribute(
    'aria-multiselectable',
    tablist.multiselectable ? 'true' : 'false'
  );
  tablist.tablistElement.setAttribute(
    'aria-owns',
    tablist.tabs.map(tab => tab.tabID).reduce(concatWithSpace)
  );

  // if the tablist element has descendant <li> elements, add a presentation role to them
  htmlCollectionToArray(tablist.tablistElement.children).forEach(element => {
    if (element.tagName === 'LI') {
      element.setAttribute('role', 'presentation');
    }
  });
};

const initTablist = (tablist: TablistData) => {
  addTablistAttributes(tablist);

  tablist.tabs.forEach(addAttributesToTab);

  const tabElements = tablist.tabs.map(tab => tab.tabElement);
  const tabPanelElements = tablist.tabs.map(tab => tab.tabPanelElement);

  window.document.body.addEventListener(
    'click',
    delegateClickHandler(tabElements, tablist, tabPanelElements)
  );

  const noTabIsSelected =
    tablist.tabs.filter(curr => {
      return curr.selected;
    }).length === 0;

  if (tablist.keepOneTabSelected && noTabIsSelected) {
    changeSelectedState(tablist.tabs[0], tablist);
  }

  refreshTabList(tablist, true);

  return tablist;
};

const getTabPanelID = (tabElement: Element) =>
  tabElement.getAttribute('data-tab-for');

const createTab = (
  tabElement: Element,
  tablistID: string,
  index: number
): TabData | null => {
  const selected =
    tabElement.getAttribute('data-expand-default-state') === 'true';
  const defaultState = selected;
  const tabPanelID = getTabPanelID(tabElement);

  if (tabPanelID === null) {
    return generateCaughtError(
      'data-tab-for attribute missing or href value is incorrect',
      null
    );
  }

  const tabPanelElement = window.document.getElementById(tabPanelID);

  if (tabPanelElement === null) {
    return generateCaughtError('tab panel could not be found', null);
  }

  return {
    tabElement,
    tabPanelElement,
    defaultState,
    tablistID,
    tabID: tabElement.getAttribute('id') || `${tablistID}-tab-${index}`,
    tabPanelID,
    selected
  };
};

const createTablist = (tablistElement: Element): TablistData | null => {
  const tablistID = tablistElement.getAttribute('id');

  const tabElements = queryAll(`[data-owner="${tablistID}"]`);
  tabElements.forEach(element => {
    const tabPanelID = getTabPanelID(element);
    if (tabPanelID === null) {
      const hrefVal = element.getAttribute('href');
      const result = hrefVal ? /^#(.*)/.exec(hrefVal) : null;
      if (result && result[1]) {
        element.setAttribute('data-tab-for', result[1]);
      }
    }
  });

  const replacedElements: Element[] = [];
  tabElements.forEach(element => {
    const replaced = switchAElementToButton(element);
    replacedElements.push(replaced);
  });

  if (tablistID === null) {
    return generateCaughtError('tablist id could not be determined', null);
  }

  const tabs = replacedElements.reduce((acc, tabElement, index) => {
    const maybeTab = createTab(tabElement, tablistID, index);
    if (maybeTab === null) {
      return acc;
    } else {
      return [...acc, maybeTab];
    }
  }, [] as TabData[]);

  return {
    tablistID,
    tabs,
    keepOneTabSelected:
      tablistElement.getAttribute('data-at-least-one') === 'false'
        ? false
        : true,
    multiselectable:
      tablistElement.getAttribute('data-multiselectable') === 'true',
    tablistElement,
    clickOutside: tablistElement.getAttribute('data-click-outside')
  };
};

const getTablist = (tablistID: string) => {
  const tablistData = tablistArray.reduce(
    (prev, currValue) => (currValue.tablistID === tablistID ? currValue : prev),
    null
  );

  if (tablistData === null) {
    throw new Error('wrong id');
  } else {
    return tablistData;
  }
};

/**
 * Adds a new tablist. You have to specify the correct attributes on the element.
 */
export const addTablist = (tablistElement: Element) => {
  const newTablist = createTablist(tablistElement);
  if (newTablist !== null) {
    tablistArray.push(initTablist(newTablist));
  }
};

/**
 * Changes the keepOneTabSelected property of a tablist, given its id.
 */
export const setKeepOneTabSelected = (
  tablistID: string,
  keepOneTabSelected: boolean
) => {
  const tablist = getTablist(tablistID);

  tablist.keepOneTabSelected = keepOneTabSelected;
  refreshTabList(tablist);
};

/**
 * Changes the multiselectable property of a tablist, given its id.
 */
export const setMultiselectable = (tablistID: string, multi: boolean) => {
  const tablist = getTablist(tablistID);

  tablist.multiselectable = multi;
  refreshTabList(tablist);
};

export const init = (selector: string = '[data-tablist]') => {
  queryAll(selector).forEach(addTablist);
};
