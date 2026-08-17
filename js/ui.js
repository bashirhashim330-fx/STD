/* ==========================================================================
   ui.js
   Shared UI primitives used across the whole app: DOM helpers, icons,
   toast notifications, the modal/confirm dialog system, and small reusable
   render widgets (progress bars, progress rings, badges). No page-specific
   view logic lives here - see views.js, quiz.js, exam.js, etc.
   ========================================================================== */

(function (App) {
  'use strict';

  /* ---------------------------------------------------------------- */
  /* DOM helpers                                                        */
  /* ---------------------------------------------------------------- */
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      if (key === 'class') node.className = attrs[key];
      else if (key === 'html') node.innerHTML = attrs[key];
      else if (key.indexOf('on') === 0 && typeof attrs[key] === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
      } else if (attrs[key] !== null && attrs[key] !== undefined) {
        node.setAttribute(key, attrs[key]);
      }
    });
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      if (typeof child === 'string') node.appendChild(document.createTextNode(child));
      else node.appendChild(child);
    });
    return node;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* Converts a small set of markdown-ish tokens (**bold**, \n paragraphs)
     into safe HTML. Everything is escaped first, so this never introduces
     unescaped user/content HTML. */
  function richText(str) {
    if (!str) return '';
    var escaped = escapeHtml(str);
    var bolded = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    var withBreaks = bolded.replace(/\n/g, '<br>');
    return withBreaks;
  }

  function paragraphs(arr) {
    return (arr || []).map(function (p) { return '<p>' + richText(p) + '</p>'; }).join('');
  }

  function uid(prefix) {
    return (prefix || 'id') + '_' + Math.random().toString(36).slice(2, 10);
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function formatDuration(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(totalSeconds));
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = totalSeconds % 60;
    if (h > 0) return h + 'h ' + m + 'm';
    if (m > 0) return m + 'm ' + s + 's';
    return s + 's';
  }

  function formatClock(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(totalSeconds));
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function formatDate(iso) {
    if (!iso) return '\u2014';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '\u2014';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  /* ---------------------------------------------------------------- */
  /* Icons - small hand-built line-icon set (no external dependency)   */
  /* ---------------------------------------------------------------- */
  var ICONS = {
    home: '<circle cx="12" cy="12" r="9.5"/><path d="M8 12l4-4 4 4M9 12v5h6v-5"/>',
    compass: '<circle cx="12" cy="12" r="9.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8 18h5a3 3 0 0 0 3-3v-2a3 3 0 0 1 3-3h-3"/>',
    workflow: '<rect x="4" y="4" width="6" height="4.5" rx="1"/><rect x="14" y="15.5" width="6" height="4.5" rx="1"/><path d="M7 8.5V13a3 3 0 0 0 3 3h4"/>',
    terminal: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M7.5 9l3 3-3 3M13 15h4"/>',
    database: '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
    'git-branch': '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="9" r="2.2"/><path d="M6 8.2V15.8M6 8.2C6 12 10.5 11 18 11.2"/>',
    'book-open': '<path d="M12 6.5c-1.7-1.3-4-2-6.5-2-1 0-1.5.3-1.5 1v11c0 .7.5 1 1.5 1 2.5 0 4.8.7 6.5 2 1.7-1.3 4-2 6.5-2 1 0 1.5-.3 1.5-1v-11c0-.7-.5-1-1.5-1-2.5 0-4.8.7-6.5 2z"/><path d="M12 6.5V19"/>',
    'clipboard-check': '<rect x="5.5" y="4.5" width="13" height="16" rx="2"/><path d="M9 4.5V3.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 13l2 2 4-4.5"/>',
    puzzle: '<path d="M9 4.5h3.5a1.5 1.5 0 0 1 0 3H16v3.5a1.5 1.5 0 0 1 0 3v3.5H12.5a1.5 1.5 0 0 0 0-3H9a1.5 1.5 0 0 1 0-3V6a1.5 1.5 0 0 1 0-1.5z"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9z"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M9 13.5L7.5 20.5 12 18l4.5 2.5-1.5-7"/>',
    'file-check': '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4"/><path d="M9.5 13l2 2 3.5-4"/>',
    flame: '<path d="M12 3s4 3.5 4 8a4 4 0 1 1-8 0c0-1 .5-1.8 1-2.5.3 1.3 1.2 1.5 1.2 1.5-.5-3 .5-5 1.8-7z"/>',
    layers: '<path d="M12 3.5l8 4.5-8 4.5-8-4.5z"/><path d="M4 12.5l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5"/>',
    'trending-up': '<path d="M4 16l6-6 4 4 6-7"/><path d="M15 6.5h5V11.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    'chevron-left': '<path d="M15 5l-7 7 7 7"/>',
    'chevron-right': '<path d="M9 5l7 7-7 7"/>',
    'chevron-down': '<path d="M5 9l7 7 7-7"/>',
    bookmark: '<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.4-3.8 4.4-5.8 7.5-5.8s6.1 2 7.5 5.8"/>',
    settings: '<circle cx="12" cy="12" r="3.2"/><path d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6M17.7 17.7l-1.6-1.6M7.9 7.9L6.3 6.3"/>',
    'bar-chart': '<path d="M5 20V11M12 20V4M19 20v-7"/><path d="M3 20h18"/>',
    refresh: '<path d="M4 12a8 8 0 0 1 13.5-5.8L20 8.5M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.5 5.8L4 15.5M4 20v-4.5h4.5"/>',
    download: '<path d="M12 4v11.5M7.5 11.5l4.5 4.5 4.5-4.5"/><path d="M5 19.5h14"/>',
    trash: '<path d="M5.5 7h13M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M7 7l1 13h8l1-13"/>',
    'alert-triangle': '<path d="M12 4l9 16H3z"/><path d="M12 10v4.2M12 17.2v.1"/>',
    flag: '<path d="M6 3.5v17"/><path d="M6 4.5c2-1 4.5-1 6.5 0s4.5 1 6.5 0v9c-2 1-4.5 1-6.5 0s-4.5-1-6.5 0"/>',
    'message-circle': '<path d="M4 12a8 8 0 1 1 3.4 6.5L4 20l1.3-3.6A7.9 7.9 0 0 1 4 12z"/>',
    play: '<path d="M8 5.5v13l11-6.5z"/>',
    pause: '<rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M19.5 19.5l-4.3-4.3"/>',
    'arrow-right': '<path d="M4 12h15M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H5M11 18l-6-6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    lightbulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    zap: '<path d="M12.5 3l-7 11h5.5l-1 7 7-11h-5.5z"/>',
    'help-circle': '<circle cx="12" cy="12" r="9.5"/><path d="M9.3 9a2.7 2.7 0 1 1 4 2.3c-.9.6-1.3 1.1-1.3 2.2"/><path d="M12 17.2v.1"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.2M12 18.8V21M4.5 4.5l1.6 1.6M17.9 17.9l1.6 1.6M3 12h2.2M18.8 12H21M4.5 19.5l1.6-1.6M17.9 6.1l1.6-1.6"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z"/>'
  };

  function icon(name, cls) {
    var body = ICONS[name] || ICONS['help-circle'];
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }

  /* ---------------------------------------------------------------- */
  /* Toasts                                                             */
  /* ---------------------------------------------------------------- */
  function ensureToastContainer() {
    var c = qs('#toast-container');
    if (!c) {
      c = el('div', { id: 'toast-container', class: 'toast-container', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(c);
    }
    return c;
  }

  function toast(message, type, opts) {
    opts = opts || {};
    var container = ensureToastContainer();
    var iconName = type === 'success' ? 'check' : type === 'error' ? 'x' : type === 'warning' ? 'alert-triangle' : 'zap';
    var node = el('div', { class: 'toast toast--' + (type || 'info') }, []);
    node.innerHTML =
      '<span class="toast__icon">' + icon(iconName) + '</span>' +
      '<span class="toast__msg">' + escapeHtml(message) + '</span>' +
      '<button class="toast__close" aria-label="Dismiss notification" type="button">' + icon('x') + '</button>';
    container.appendChild(node);
    requestAnimationFrame(function () { node.classList.add('is-visible'); });

    var duration = opts.duration || 4200;
    var timer = setTimeout(function () { dismiss(); }, duration);

    function dismiss() {
      clearTimeout(timer);
      node.classList.remove('is-visible');
      node.classList.add('is-leaving');
      setTimeout(function () { node.remove(); }, 220);
    }
    qs('.toast__close', node).addEventListener('click', dismiss);
    return dismiss;
  }

  /* ---------------------------------------------------------------- */
  /* Modal system                                                       */
  /* ---------------------------------------------------------------- */
  var activeModalStack = [];

  function ensureModalRoot() {
    var root = qs('#modal-root');
    if (!root) {
      root = el('div', { id: 'modal-root' });
      document.body.appendChild(root);
    }
    return root;
  }

  function modal(config) {
    config = config || {};
    var root = ensureModalRoot();
    var overlay = el('div', { class: 'modal-overlay', role: 'presentation' });
    var dialog = el('div', {
      class: 'modal-dialog' + (config.size === 'lg' ? ' modal-dialog--lg' : ''),
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': config.title || 'Dialog'
    });

    var headerHtml = '<div class="modal-header">' +
      '<h3 class="modal-title">' + escapeHtml(config.title || '') + '</h3>' +
      (config.dismissible === false ? '' : '<button class="modal-close" type="button" aria-label="Close dialog">' + icon('x') + '</button>') +
      '</div>';

    dialog.innerHTML = headerHtml + '<div class="modal-body">' + (config.bodyHtml || '') + '</div>' + '<div class="modal-footer"></div>';

    var footer = qs('.modal-footer', dialog);
    (config.actions || []).forEach(function (action) {
      var btn = el('button', {
        class: 'btn ' + (action.variant === 'primary' ? 'btn--primary' : action.variant === 'danger' ? 'btn--danger' : 'btn--ghost'),
        type: 'button'
      }, [action.label]);
      btn.addEventListener('click', function () {
        if (action.onClick) action.onClick();
        if (action.closeOnClick !== false) close();
      });
      footer.appendChild(btn);
    });

    overlay.appendChild(dialog);
    root.appendChild(overlay);
    activeModalStack.push(overlay);
    document.body.classList.add('modal-open');
    requestAnimationFrame(function () { overlay.classList.add('is-visible'); });

    if (config.dismissible !== false) {
      var closeBtn = qs('.modal-close', dialog);
      if (closeBtn) closeBtn.addEventListener('click', close);
      overlay.addEventListener('mousedown', function (e) {
        if (e.target === overlay) close();
      });
    }

    function onKeydown(e) {
      if (e.key === 'Escape' && config.dismissible !== false) close();
    }
    document.addEventListener('keydown', onKeydown);

    var firstFocusable = qs('button, [href], input, select, textarea, [tabindex]', dialog);
    if (firstFocusable) firstFocusable.focus();

    function close() {
      document.removeEventListener('keydown', onKeydown);
      overlay.classList.remove('is-visible');
      setTimeout(function () {
        overlay.remove();
        var idx = activeModalStack.indexOf(overlay);
        if (idx !== -1) activeModalStack.splice(idx, 1);
        if (activeModalStack.length === 0) document.body.classList.remove('modal-open');
        if (config.onClose) config.onClose();
      }, 180);
    }

    return { close: close, dialog: dialog };
  }

  function confirmDialog(config) {
    config = config || {};
    return new Promise(function (resolve) {
      var settled = false;
      var m = modal({
        title: config.title || 'Are you sure?',
        bodyHtml: '<p>' + escapeHtml(config.message || '') + '</p>',
        dismissible: true,
        onClose: function () { if (!settled) { settled = true; resolve(false); } },
        actions: [
          {
            label: config.cancelLabel || 'Cancel',
            variant: 'ghost',
            onClick: function () { settled = true; resolve(false); }
          },
          {
            label: config.confirmLabel || 'Confirm',
            variant: config.danger ? 'danger' : 'primary',
            onClick: function () { settled = true; resolve(true); }
          }
        ]
      });
      return m;
    });
  }

  /* ---------------------------------------------------------------- */
  /* Small render widgets                                              */
  /* ---------------------------------------------------------------- */
  function progressBar(percent, opts) {
    opts = opts || {};
    percent = clamp(Math.round(percent), 0, 100);
    return '<div class="progress-bar' + (opts.cls ? ' ' + opts.cls : '') + '" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100">' +
      '<div class="progress-bar__fill" style="width:' + percent + '%"></div>' +
      '</div>';
  }

  function progressRing(percent, size, label) {
    percent = clamp(Math.round(percent), 0, 100);
    size = size || 120;
    var stroke = Math.max(6, Math.round(size * 0.09));
    var radius = (size - stroke) / 2;
    var circumference = 2 * Math.PI * radius;
    var offset = circumference * (1 - percent / 100);
    var center = size / 2;
    return '' +
      '<svg class="progress-ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="' + escapeHtml(label || (percent + ' percent')) + '">' +
      '<circle class="progress-ring__track" cx="' + center + '" cy="' + center + '" r="' + radius + '" stroke-width="' + stroke + '"/>' +
      '<circle class="progress-ring__fill" cx="' + center + '" cy="' + center + '" r="' + radius + '" stroke-width="' + stroke + '" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" transform="rotate(-90 ' + center + ' ' + center + ')"/>' +
      '<text x="50%" y="50%" class="progress-ring__text" text-anchor="middle" dominant-baseline="central">' + percent + '%</text>' +
      '</svg>';
  }

  function badge(text, variant) {
    return '<span class="badge badge--' + (variant || 'neutral') + '">' + escapeHtml(text) + '</span>';
  }

  function emptyState(iconName, title, message, actionHtml) {
    return '<div class="empty-state">' +
      '<div class="empty-state__icon">' + icon(iconName) + '</div>' +
      '<h3>' + escapeHtml(title) + '</h3>' +
      '<p>' + escapeHtml(message) + '</p>' +
      (actionHtml || '') +
      '</div>';
  }

  App.UI = {
    qs: qs,
    qsa: qsa,
    el: el,
    escapeHtml: escapeHtml,
    richText: richText,
    paragraphs: paragraphs,
    uid: uid,
    clamp: clamp,
    shuffle: shuffle,
    formatDuration: formatDuration,
    formatClock: formatClock,
    formatDate: formatDate,
    icon: icon,
    toast: toast,
    modal: modal,
    confirmDialog: confirmDialog,
    progressBar: progressBar,
    progressRing: progressRing,
    badge: badge,
    emptyState: emptyState
  };

})(window.App = window.App || {});
