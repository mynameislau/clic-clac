'use strict';

var selector = function selector(selectorString, context) {
  var element = context || document;
  return element.querySelector(selectorString);
};

var selectorAll = function selectorAll(selectorString, context) {
  var element = context || document;
  return Array.prototype.slice.call(element.querySelectorAll(selectorString));
};

var expandFunc = function expandFunc($, $$) {
  'use strict';

  var expand = {
    init: function init(controller) {
      var inst = Object.create(expand);
      var mediaQueryList;
      inst.controller = controller;
      inst.controlledID = inst.controller.getAttribute('aria-controls');
      inst.controlled = $('[id="' + inst.controlledID + '"]');
      inst.controlled.setAttribute('role', 'region');
      var expandedState = controller.getAttribute('data-expand-default-state');
      if (expandedState) {
        inst.controlled.setAttribute('aria-expanded', expandedState);
      }

      inst.controller.addEventListener('click', function () {
        inst.setExpanded();
      });

      var beforePrint = function beforePrint() {
        inst.setExpanded(true);
      };

      if (window.matchMedia) {
        mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function (mql) {
          if (mql.matches) {
            beforePrint();
          }
        });
      }

      window.onbeforeprint = beforePrint;

      return inst;
    },

    setExpanded: function setExpanded(forcedState) {
      var oldState = this.controlled.getAttribute('aria-expanded') === 'true';
      var newState = forcedState !== undefined ? forcedState : !oldState;
      this.controlled.setAttribute('aria-expanded', newState ? 'true' : 'false');
    }
  };

  $$('[data-expand]').forEach(function (item) {
    expand.init(item);
  });
};

var stateCheck = setInterval(function () {
  if (document.readyState === 'complete') {
    console.log('document is ready');
    clearInterval(stateCheck);

    // selectorAll('.page-recherche-garants .sidebar div[class*="facetapi"]').forEach(function (item) {

    // });

    expandFunc(selector, selectorAll);
  }
}, 100);