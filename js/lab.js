/* ==========================================================================
   lab.js
   Practice Lab: a list of guided problem-solving exercises (one per
   module), each walking the student through Input, Output, Conditions,
   Algorithm, Pseudocode and Testing. Each step can be checked off; once
   every step is checked the problem is marked complete and tracked in
   App.Storage, feeding the "Problem Solver" achievement and Analytics.
   ========================================================================== */

(function (App) {
  'use strict';

  var UI = App.UI;

  function container() { return UI.qs('#app-main'); }

  function mountList() {
    var state = App.Storage.getState();
    var cards = App.Data.LAB_PROBLEMS.map(function (p) {
      var mod = App.Data.getModule(p.moduleId);
      var entry = state.lab[p.id];
      var doneCount = entry ? Object.keys(entry.steps).filter(function (k) { return entry.steps[k]; }).length : 0;
      var pct = Math.round((doneCount / p.steps.length) * 100);
      return '' +
        '<a href="#/lab/' + p.id + '" class="module-card">' +
          '<div class="module-card__top"><div class="module-card__icon">' + UI.icon('puzzle') + '</div><span class="module-card__number">' + UI.escapeHtml(mod.title) + '</span></div>' +
          '<h3>' + UI.escapeHtml(p.title) + '</h3>' +
          '<p>' + UI.escapeHtml(p.description) + '</p>' +
          '<div class="module-card__meta"><span>' + doneCount + ' / ' + p.steps.length + ' steps</span>' + (entry && entry.completed ? UI.badge('Completed', 'success') : UI.badge('Not started', 'neutral')) + '</div>' +
          UI.progressBar(pct) +
        '</a>';
    }).join('');

    container().innerHTML = '' +
      '<div class="page-header">' +
        '<p class="eyebrow">Practice Lab</p>' +
        '<h1>Guided Problem-Solving Labs</h1>' +
        '<p class="muted">Work through Input, Output, Conditions, Algorithm, Pseudocode and Testing for one guided problem per module.</p>' +
      '</div>' +
      '<div class="module-grid">' + cards + '</div>';
  }

  function mount(id) {
    var problem = App.Data.getLabProblem(id);
    if (!problem) { App.Views.notFound(); return; }
    render(problem);
  }

  function render(problem) {
    var mod = App.Data.getModule(problem.moduleId);
    var state = App.Storage.getState();
    var entry = state.lab[problem.id] || { steps: {}, completed: false };
    var allKeys = problem.steps.map(function (s) { return s.key; });
    var doneCount = allKeys.filter(function (k) { return entry.steps[k]; }).length;
    var pct = Math.round((doneCount / allKeys.length) * 100);

    var stepsHtml = problem.steps.map(function (s, i) {
      var done = !!entry.steps[s.key];
      return '' +
        '<div class="lab-step' + (done ? ' is-done' : '') + '">' +
          '<div class="lab-step__head">' +
            '<span class="lab-step__node">' + (done ? UI.icon('check') : (i + 1)) + '</span>' +
            '<h3>' + UI.escapeHtml(s.label) + '</h3>' +
          '</div>' +
          '<p>' + UI.richText(s.content) + '</p>' +
          '<label class="lab-step__toggle"><input type="checkbox" data-key="' + s.key + '"' + (done ? ' checked' : '') + '> Mark this step as done</label>' +
        '</div>';
    }).join('');

    container().innerHTML = '' +
      '<div class="lab-layout">' +
        '<p class="eyebrow"><a href="#/module/' + mod.id + '">' + UI.escapeHtml(mod.title) + '</a> &rsaquo; Practice Lab</p>' +
        '<h1>' + UI.escapeHtml(problem.title) + '</h1>' +
        '<p class="muted">' + UI.escapeHtml(problem.description) + '</p>' +
        UI.progressBar(pct) +
        '<p class="muted small">' + doneCount + ' of ' + allKeys.length + ' steps complete</p>' +
        (entry.completed ? '<div class="alert alert--success">' + UI.icon('check') + ' Lab problem completed! You have walked through the full problem-solving process.</div>' : '') +
        '<div class="lab-steps">' + stepsHtml + '</div>' +
        '<div class="results-actions">' +
          '<a href="#/lab" class="btn btn--ghost">' + UI.icon('arrow-left') + ' All Lab Problems</a>' +
          '<a href="#/module/' + mod.id + '" class="btn btn--outline">' + UI.icon('grid') + ' Back to Module</a>' +
        '</div>' +
      '</div>';

    UI.qsa('.lab-step__toggle input', container()).forEach(function (input) {
      input.addEventListener('change', function () {
        var wasComplete = App.Storage.setLabStep(problem.id, input.getAttribute('data-key'), allKeys, input.checked);
        App.Achievements.checkAll();
        if (input.checked && wasComplete) UI.toast('Lab problem completed!', 'success');
        render(problem);
      });
    });
  }

  App.Lab = {
    mountList: mountList,
    mount: mount
  };

})(window.App = window.App || {});
