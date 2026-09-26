'use strict';

// Hover reveals the controls; buttons provide equivalent touch and keyboard access.
const PondControls = (() => {
  let pinned = false;
  let keyboardMode = false;
  let groups = [];
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

  function show(group, expanded) {
    group.zone.dataset.expanded = String(expanded);
    group.toggle.setAttribute('aria-expanded', String(expanded));
    group.panel.inert = !expanded;
    group.panel.setAttribute('aria-hidden', String(!expanded));
  }

  function refresh(group) {
    const focused = keyboardMode && group.zone.contains(document.activeElement);
    show(group, pinned || group.hovered || group.locked || focused);
  }

  function later(group) {
    clearTimeout(group.timer);
    group.timer = setTimeout(() => refresh(group), 420);
  }

  function init() {
    groups = ['care', 'navigation'].map(name => {
      const group = {
        zone: document.getElementById(name + '-zone'),
        panel: document.getElementById(name + '-panel'),
        toggle: document.getElementById(name + '-toggle'),
        hovered: false, locked: false, timer: null,
      };
      group.zone.addEventListener('pointerenter', event => {
        if (event.pointerType !== 'mouse' || !finePointer.matches) return;
        group.hovered = true;
        clearTimeout(group.timer);
        refresh(group);
      });
      group.zone.addEventListener('pointerleave', () => {
        group.hovered = false;
        later(group);
      });
      group.zone.addEventListener('focusin', () => {
        if (keyboardMode) refresh(group);
      });
      group.zone.addEventListener('focusout', () => later(group));
      group.toggle.addEventListener('click', () => {
        group.locked = !group.locked;
        refresh(group);
      });
      return group;
    });
    document.addEventListener('keydown', event => {
      if (event.defaultPrevented) return;
      if (event.key === 'Tab') keyboardMode = true;
      if (event.key === 'Escape' && document.getElementById('overlay').hidden) {
        groups.forEach(group => {
          group.locked = false;
          if (group.panel.contains(document.activeElement)) group.toggle.focus();
          // Keep the focused keyboard entry visible; the panel collapses after Tab leaves it.
          refresh(group);
        });
      }
    });
    document.addEventListener('pointerdown', () => {
      keyboardMode = false;
      groups.forEach(later);
    }, true);
    groups.forEach(refresh);
  }

  function setPinned(value) {
    pinned = value;
    groups.forEach(refresh);
  }

  function revealFor(element) {
    const group = groups.find(item => item.panel.contains(element));
    if (group) { show(group, true); later(group); }
  }

  return { init, setPinned, revealFor };
})();
