/* ==========================================================================
   analytics.js
   The analytics dashboard: overall mastery, lesson/reading progress, quiz
   accuracy, lab problems solved, flashcards reviewed, study time, study
   streak, mock examination results, a module-by-module breakdown, and the
   full achievements grid. Every figure is derived from App.Storage - none
   of it is hard-coded or simulated.
   ========================================================================== */

(function (App) {
  'use strict';

  var UI = App.UI;

  function container() { return UI.qs('#app-main'); }

  function mount() {
    var state = App.Storage.getState();
    var totalLessons = App.Achievements.totalLessonCount();
    var completed = App.Achievements.completedLessonCount(state);
    var openedCount = Object.keys(state.lessonProgress).filter(function (id) { return state.lessonProgress[id].opened; }).length;
    var readingPct = totalLessons ? Math.round((openedCount / totalLessons) * 100) : 0;
    var completionPct = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;

    var quizAttempts = state.quiz.attempts;
    var quizAcc = quizAttempts.length ? Math.round(quizAttempts.reduce(function (a, b) { return a + b.percentage; }, 0) / quizAttempts.length) : null;

    var labsCompleted = App.Achievements.completedLabCount(state);
    var totalLabs = App.Data.LAB_PROBLEMS.length;

    var reviewedCount = Object.keys(state.flashcards).filter(function (id) { return state.flashcards[id].seen; }).length;
    var totalFlashcards = App.Data.getAllFlashcards().length;

    var overallMastery = quizAcc !== null ? Math.round((completionPct + quizAcc) / 2) : completionPct;

    var statCards = [
      { icon: 'trending-up', value: overallMastery + '%', label: 'Overall Mastery' },
      { icon: 'book-open', value: completed + ' / ' + totalLessons, label: 'Lessons Completed' },
      { icon: 'zap', value: readingPct + '%', label: 'Reading Progress' },
      { icon: 'clipboard-check', value: quizAcc === null ? '\u2014' : quizAcc + '%', label: 'Quiz Accuracy' },
      { icon: 'puzzle', value: labsCompleted + ' / ' + totalLabs, label: 'Lab Problems Solved' },
      { icon: 'layers', value: reviewedCount + ' / ' + totalFlashcards, label: 'Flashcards Reviewed' },
      { icon: 'clock', value: UI.formatDuration(state.meta.studyTimeSeconds), label: 'Study Time' },
      { icon: 'flame', value: state.streak.current + ' day' + (state.streak.current === 1 ? '' : 's') + ' (best ' + state.streak.longest + ')', label: 'Study Streak' },
      { icon: 'file-check', value: state.exam.attempts.length, label: 'Mock Exam Attempts' },
      { icon: 'star', value: state.exam.attempts.length ? Math.round(state.exam.bestPercentage) + '%' : '\u2014', label: 'Best Exam Score' }
    ].map(function (s) {
      return '<div class="stat-card"><div class="stat-card__icon">' + UI.icon(s.icon) + '</div><div><div class="stat-card__value">' + s.value + '</div><div class="stat-card__label">' + s.label + '</div></div></div>';
    }).join('');

    var moduleRows = App.Data.MODULES.map(function (mod) {
      var prog = App.Views.moduleLessonProgress(state, mod);
      var quizBest = state.quiz.bestByModule[mod.id];
      var labList = App.Data.LAB_PROBLEMS.filter(function (p) { return p.moduleId === mod.id; });
      var labDone = labList.length && state.lab[labList[0].id] && state.lab[labList[0].id].completed;
      var fcList = App.Data.getFlashcardsByModule(mod.id);
      var fcKnown = fcList.filter(function (c) { return state.flashcards[c.id] && state.flashcards[c.id].known; }).length;
      return '' +
        '<div class="analytics-module-row">' +
          '<div class="analytics-module-row__head">' +
            '<span>' + UI.icon(mod.icon) + ' <a href="#/module/' + mod.id + '">' + UI.escapeHtml(mod.title) + '</a></span>' +
            (labDone ? UI.badge('Lab complete', 'success') : UI.badge('Lab in progress', 'neutral')) +
          '</div>' +
          '<div class="analytics-module-row__bars">' +
            '<div class="mini-bar-row"><span>Lessons</span>' + UI.progressBar(prog.pct) + '<span>' + prog.done + '/' + prog.total + '</span></div>' +
            '<div class="mini-bar-row"><span>Quiz Best</span>' + UI.progressBar(quizBest || 0) + '<span>' + (quizBest !== undefined ? Math.round(quizBest) + '%' : '\u2014') + '</span></div>' +
            '<div class="mini-bar-row"><span>Flashcards</span>' + UI.progressBar(fcList.length ? (fcKnown / fcList.length) * 100 : 0) + '<span>' + fcKnown + '/' + fcList.length + '</span></div>' +
          '</div>' +
        '</div>';
    }).join('');

    container().innerHTML = '' +
      '<div class="page-header">' +
        '<p class="eyebrow">Your Learning Data</p>' +
        '<h1>Analytics</h1>' +
        '<p class="muted">Every statistic below is calculated from your real activity on this device.</p>' +
      '</div>' +
      '<div class="stat-grid">' + statCards + '</div>' +
      '<h3 class="section-title">Module-by-Module Performance</h3>' +
      '<div class="analytics-module-list">' + moduleRows + '</div>' +
      '<h3 class="section-title">Achievements</h3>' +
      App.Views.achievementsGrid(state);
  }

  App.Analytics = { mount: mount };

})(window.App = window.App || {});
