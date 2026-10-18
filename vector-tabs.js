/* Shared tab behaviour for the VECTOR pages.
   Each button carries data-tab="<panel id>" and each panel has that id.
   Call VectorTabs.init after the tab markup, once per tab group. */
(function () {
  'use strict';

  function init(options) {
    var opts = Object.assign({
      buttonSelector: '.tab-button[data-tab]',
      panelSelector: '.tab-content',
      activeClass: 'active',
      useHash: false
    }, options || {});

    var buttons = Array.prototype.slice.call(document.querySelectorAll(opts.buttonSelector));
    var panels = Array.prototype.slice.call(document.querySelectorAll(opts.panelSelector));
    if (!buttons.length) return null;

    var tablist = buttons[0].parentElement;
    tablist.setAttribute('role', 'tablist');

    buttons.forEach(function (button) {
      var name = button.getAttribute('data-tab');
      button.setAttribute('role', 'tab');
      if (!button.id) button.id = 'tab-' + name;
      button.setAttribute('aria-controls', name);
    });

    panels.forEach(function (panel) {
      var button = buttons.find(function (b) { return b.getAttribute('data-tab') === panel.id; });
      panel.setAttribute('role', 'tabpanel');
      if (button) panel.setAttribute('aria-labelledby', button.id);
    });

    function findPanel(name) {
      return panels.find(function (p) { return p.id === name; });
    }

    function switchTo(name, pushHistory) {
      var panel = findPanel(name);
      var button = buttons.find(function (b) { return b.getAttribute('data-tab') === name; });
      if (!panel || !button) return false;

      buttons.forEach(function (b) {
        var selected = b === button;
        b.classList.toggle(opts.activeClass, selected);
        b.setAttribute('aria-selected', selected ? 'true' : 'false');
        b.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(function (p) {
        p.classList.toggle(opts.activeClass, p === panel);
      });

      if (opts.useHash && pushHistory && location.hash !== '#' + name) {
        // pushState does not scroll to the element whose id matches the hash.
        history.pushState(null, '', '#' + name);
      }
      return true;
    }

    function onKeydown(event) {
      var current = buttons.indexOf(document.activeElement);
      if (current === -1) return;
      var target = null;
      if (event.key === 'ArrowRight') target = buttons[(current + 1) % buttons.length];
      if (event.key === 'ArrowLeft') target = buttons[(current - 1 + buttons.length) % buttons.length];
      if (event.key === 'Home') target = buttons[0];
      if (event.key === 'End') target = buttons[buttons.length - 1];
      if (!target) return;
      event.preventDefault();
      switchTo(target.getAttribute('data-tab'), true);
      target.focus();
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        switchTo(button.getAttribute('data-tab'), true);
      });
    });
    tablist.addEventListener('keydown', onKeydown);

    if (opts.useHash) {
      window.addEventListener('popstate', function () {
        var name = location.hash.slice(1);
        if (name) switchTo(name, false);
      });
      var initial = location.hash.slice(1);
      if (initial) switchTo(initial, false);
    }

    // Start with the first tab if nothing is selected yet.
    var selected = buttons.find(function (b) { return b.classList.contains(opts.activeClass); }) || buttons[0];
    switchTo(selected.getAttribute('data-tab'), false);

    return { switchTo: function (name) { return switchTo(name, true); } };
  }

  window.VectorTabs = { init: init };
})();
