/* ==========================================================================
   app.js
   Application shell (top bar + navigation), the hash-based SPA router, and
   the core views: Dashboard/Home, Modules list, Module detail, Lesson
   reader, Profile and Settings, plus the 404 view. This is the entry point
   loaded last - it wires together Data, Storage, UI, Achievements, Quiz,
   Exam, Flashcards, Lab, Tutor and Analytics.
   ========================================================================== */

(function (App) {
  'use strict';

  var UI = App.UI;

  /* ---------------------------------------------------------------- */
  /* Router                                                             */
  /* ---------------------------------------------------------------- */
  var currentUnmount = null;

  var NAV_ITEMS = [
    { hash: '#/home', label: 'Dashboard', icon: 'home', exact: ['#/home', '#/'] },
    { hash: '#/modules', label: 'Modules', icon: 'grid', prefix: ['#/modules', '#/module/', '#/lesson/', '#/quiz/'] },
    { hash: '#/exam', label: 'Mock Examination', icon: 'clipboard-check', prefix: ['#/exam'] },
    { hash: '#/flashcards', label: 'Flashcards', icon: 'layers', prefix: ['#/flashcards'] },
    { hash: '#/lab', label: 'Practice Lab', icon: 'puzzle', prefix: ['#/lab'] },
    { hash: '#/tutor', label: 'Tutor', icon: 'message-circle', prefix: ['#/tutor'] },
    { hash: '#/analytics', label: 'Analytics', icon: 'bar-chart', prefix: ['#/analytics'] },
    { hash: '#/profile', label: 'Profile', icon: 'user', prefix: ['#/profile'] },
    { hash: '#/settings', label: 'Settings', icon: 'settings', prefix: ['#/settings'] }
  ];

  var ROUTES = [
    { pattern: /^#\/?$/, handler: function () { App.Views.home(); } },
    { pattern: /^#\/home$/, handler: function () { App.Views.home(); } },
    { pattern: /^#\/modules$/, handler: function () { App.Views.modules(); } },
    { pattern: /^#\/module\/(\d+)$/, handler: function (m) { App.Views.moduleDetail(m[1]); } },
    { pattern: /^#\/lesson\/([^/]+)$/, handler: function (m) { App.Views.lesson(m[1]); } },
    { pattern: /^#\/quiz\/(\d+)$/, handler: function (m) { App.Quiz.mount(m[1]); } },
    { pattern: /^#\/exam$/, handler: function () { App.Exam.mount(); } },
    { pattern: /^#\/flashcards$/, handler: function () { App.Flashcards.mountPicker(); } },
    { pattern: /^#\/flashcards\/(\d+)$/, handler: function (m) { App.Flashcards.mount(m[1]); } },
    { pattern: /^#\/lab$/, handler: function () { App.Lab.mountList(); } },
    { pattern: /^#\/lab\/([^/]+)$/, handler: function (m) { App.Lab.mount(m[1]); } },
    { pattern: /^#\/tutor$/, handler: function () { App.Tutor.mount(); } },
    { pattern: /^#\/analytics$/, handler: function () { App.Analytics.mount(); } },
    { pattern: /^#\/profile$/, handler: function () { App.Views.profile(); } },
    { pattern: /^#\/settings$/, handler: function () { App.Views.settings(); } }
  ];

  function setUnmount(fn) { currentUnmount = fn; }

  function runUnmount() {
    if (currentUnmount) {
      try { currentUnmount(); } catch (e) { /* no-op */ }
      currentUnmount = null;
    }
  }

  function navigate(hash) { location.hash = hash; }

  function resolve() {
    runUnmount();
    var hash = location.hash || '#/home';
    var matched = false;
    for (var i = 0; i < ROUTES.length; i++) {
      var m = hash.match(ROUTES[i].pattern);
      if (m) {
        ROUTES[i].handler(m);
        matched = true;
        break;
      }
    }
    if (!matched) App.Views.notFound();
    App.Shell.setActive(hash);
    App.Shell.closeDrawer();
    var main = UI.qs('#app-content');
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  App.Router = { setUnmount: setUnmount, navigate: navigate, resolve: resolve };

  /* ---------------------------------------------------------------- */
  /* Shell (top bar + side navigation)                                 */
  /* ---------------------------------------------------------------- */
  function studentDisplayName() {
    var name = App.Storage.getState().profile.name;
    return name && name.trim() ? name.trim() : 'Student';
  }

  function shellTemplate() {
    var navLinks = NAV_ITEMS.map(function (item) {
      return '<a href="' + item.hash + '" class="side-nav__link" data-hash="' + item.hash + '">' +
        UI.icon(item.icon) + '<span>' + item.label + '</span></a>';
    }).join('');

    return '' +
      '<a class="skip-link" href="#app-main">Skip to content</a>' +
      '<header class="app-topbar">' +
        '<button type="button" class="hamburger" id="hamburger-btn" aria-label="Toggle navigation" aria-expanded="false">' + UI.icon('menu') + '</button>' +
        '<a href="#/home" class="app-brand">' +
          '<span class="app-brand__mark">CS</span>' +
          '<span class="app-brand__text"><strong>COS102</strong><small>Problem Solving &middot; IBB University, Lapai</small></span>' +
        '</a>' +
        '<div class="app-topbar__spacer"></div>' +
        '<button type="button" class="theme-toggle" id="theme-toggle-btn" aria-label="Switch to dark mode" title="Switch theme"></button>' +
        '<div class="topbar-streak" title="Current study streak">' + UI.icon('flame') + '<span id="topbar-streak-value">0</span></div>' +
        '<a href="#/profile" class="topbar-user">' + UI.icon('user') + '<span id="topbar-user-name">Student</span></a>' +
      '</header>' +
      '<div class="sidebar-scrim" id="sidebar-scrim"></div>' +
      '<nav class="app-sidebar" id="app-sidebar" aria-label="Primary">' +
        '<div class="side-nav">' + navLinks + '</div>' +
        '<div class="sidebar-footer">' +
          '<p>COS102 &middot; Problem Solving</p>' +
          '<p>Ibrahim Badamasi Babangida<br>University, Lapai</p>' +
        '</div>' +
      '</nav>' +
      '<main class="app-content" id="app-content">' +
        '<div id="app-main" tabindex="-1"></div>' +
      '</main>';
  }

  function refreshTopbar() {
    var state = App.Storage.getState();
    var streakEl = UI.qs('#topbar-streak-value');
    if (streakEl) streakEl.textContent = state.streak.current;
    var nameEl = UI.qs('#topbar-user-name');
    if (nameEl) nameEl.textContent = studentDisplayName();
    refreshThemeToggle();
  }

  function refreshThemeToggle() {
    var btn = UI.qs('#theme-toggle-btn');
    if (!btn) return;
    var isDark = App.Storage.getState().settings.theme === 'dark';
    btn.innerHTML = UI.icon(isDark ? 'sun' : 'moon');
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function toggleTheme() {
    var current = App.Storage.getState().settings.theme === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    App.Storage.updateSettings({ theme: next });
    applySettingsToDocument(App.Storage.getState().settings);
    refreshThemeToggle();
  }

  function setActive(hash) {
    UI.qsa('.side-nav__link').forEach(function (link) {
      var itemHash = link.getAttribute('data-hash');
      var item = NAV_ITEMS.filter(function (n) { return n.hash === itemHash; })[0];
      var isActive = false;
      if (item) {
        isActive = (item.exact || []).indexOf(hash) !== -1 ||
          (item.prefix || []).some(function (p) { return hash.indexOf(p) === 0; });
      } else {
        isActive = hash === itemHash;
      }
      link.classList.toggle('is-active', isActive);
    });
    refreshTopbar();
  }

  function openDrawer() {
    document.body.classList.add('sidebar-open');
    var btn = UI.qs('#hamburger-btn');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    document.body.classList.remove('sidebar-open');
    var btn = UI.qs('#hamburger-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  function toggleDrawer() {
    if (document.body.classList.contains('sidebar-open')) closeDrawer(); else openDrawer();
  }

  function renderShell() {
    var root = UI.qs('#root');
    root.innerHTML = shellTemplate();
    UI.qs('#hamburger-btn').addEventListener('click', toggleDrawer);
    UI.qs('#sidebar-scrim').addEventListener('click', closeDrawer);
    UI.qs('#theme-toggle-btn').addEventListener('click', toggleTheme);
    UI.qsa('.side-nav__link').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });
    refreshTopbar();
  }

  App.Shell = {
    render: renderShell,
    setActive: setActive,
    refreshTopbar: refreshTopbar,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer
  };

  /* ---------------------------------------------------------------- */
  /* Shared helpers                                                     */
  /* ---------------------------------------------------------------- */
  function container() { return UI.qs('#app-main'); }

  function totalLessons() { return App.Achievements.totalLessonCount(); }
  function completedLessons(state) { return App.Achievements.completedLessonCount(state); }

  function overallLessonPercent(state) {
    var total = totalLessons();
    if (total === 0) return 0;
    return Math.round((completedLessons(state) / total) * 100);
  }

  function quizAccuracy(state) {
    var attempts = state.quiz.attempts;
    if (attempts.length === 0) return null;
    var sum = attempts.reduce(function (acc, a) { return acc + a.percentage; }, 0);
    return Math.round(sum / attempts.length);
  }

  function flashcardsReviewedCount(state) {
    return Object.keys(state.flashcards).filter(function (id) { return state.flashcards[id].seen; }).length;
  }

  function moduleLessonProgress(state, mod) {
    var done = mod.lessons.filter(function (l) { return App.Storage.isLessonCompleted(l.id); }).length;
    return { done: done, total: mod.lessons.length, pct: mod.lessons.length ? Math.round((done / mod.lessons.length) * 100) : 0 };
  }

  function findContinueLesson(state) {
    var all = App.Data.getAllLessons();
    for (var i = 0; i < all.length; i++) {
      if (!App.Storage.isLessonCompleted(all[i].lesson.id)) return all[i];
    }
    return null;
  }

  function achievementsGrid(state) {
    var cards = App.Data.ACHIEVEMENTS.map(function (a) {
      var unlocked = state.achievements.unlocked.indexOf(a.id) !== -1;
      var progress = App.Achievements.progressFor(a.id, state);
      return '' +
        '<div class="achievement-card' + (unlocked ? ' is-unlocked' : ' is-locked') + '">' +
          '<div class="achievement-card__icon">' + UI.icon(a.icon) + '</div>' +
          '<div class="achievement-card__body">' +
            '<h4>' + UI.escapeHtml(a.title) + '</h4>' +
            '<p>' + UI.escapeHtml(a.description) + '</p>' +
            (!unlocked && progress ? '<div class="achievement-card__progress">' + UI.progressBar((progress.current / progress.target) * 100) + '<span>' + progress.current + ' / ' + progress.target + '</span></div>' : '') +
          '</div>' +
          (unlocked ? '<div class="achievement-card__check">' + UI.icon('check') + '</div>' : '') +
        '</div>';
    }).join('');
    return '<div class="achievements-grid">' + cards + '</div>';
  }

  App.Views = App.Views || {};
  App.Views.achievementsGrid = achievementsGrid;
  App.Views.overallLessonPercent = overallLessonPercent;
  App.Views.quizAccuracy = quizAccuracy;
  App.Views.flashcardsReviewedCount = flashcardsReviewedCount;
  App.Views.moduleLessonProgress = moduleLessonProgress;

  /* ---------------------------------------------------------------- */
  /* Home / Dashboard                                                   */
  /* ---------------------------------------------------------------- */
  function home() {
    var state = App.Storage.getState();
    var total = totalLessons();
    var done = completedLessons(state);
    var remaining = total - done;
    var overallPct = overallLessonPercent(state);
    var accuracy = quizAccuracy(state);
    var continueItem = findContinueLesson(state);
    var unlockedCount = state.achievements.unlocked.length;

    var statCards = [
      { icon: 'trending-up', value: overallPct + '%', label: 'Overall Progress' },
      { icon: 'book-open', value: done, label: 'Lessons Completed' },
      { icon: 'flag', value: remaining, label: 'Lessons Remaining' },
      { icon: 'clipboard-check', value: accuracy === null ? '\u2014' : accuracy + '%', label: 'Quiz Accuracy' },
      { icon: 'file-check', value: state.exam.attempts.length, label: 'Exam Attempts' },
      { icon: 'star', value: state.exam.attempts.length ? Math.round(state.exam.bestPercentage) + '%' : '\u2014', label: 'Best Exam Score' },
      { icon: 'flame', value: state.streak.current, label: 'Study Streak (days)' },
      { icon: 'layers', value: flashcardsReviewedCount(state), label: 'Flashcards Reviewed' },
      { icon: 'award', value: unlockedCount + ' / ' + App.Data.ACHIEVEMENTS.length, label: 'Achievements' }
    ].map(function (s) {
      return '<div class="stat-card"><div class="stat-card__icon">' + UI.icon(s.icon) + '</div><div><div class="stat-card__value">' + s.value + '</div><div class="stat-card__label">' + s.label + '</div></div></div>';
    }).join('');

    var quickTiles = [
      { hash: '#/modules', icon: 'grid', label: 'Modules', desc: 'Browse all 6 modules' },
      { hash: '#/modules', icon: 'clipboard-check', label: 'Quizzes', desc: 'Pick a module quiz' },
      { hash: '#/exam', icon: 'file-check', label: 'Mock Examination', desc: '25 timed questions' },
      { hash: '#/flashcards', icon: 'layers', label: 'Flashcards', desc: 'Quick recall practice' },
      { hash: '#/lab', icon: 'puzzle', label: 'Practice Lab', desc: 'Guided problems' },
      { hash: '#/tutor', icon: 'message-circle', label: 'Tutor', desc: 'Ask about any topic' },
      { hash: '#/analytics', icon: 'bar-chart', label: 'Analytics', desc: 'Your full progress' },
      { hash: '#/profile', icon: 'user', label: 'Profile', desc: 'Your student details' },
      { hash: '#/settings', icon: 'settings', label: 'Settings', desc: 'Preferences & reset' }
    ].map(function (t) {
      return '<a href="' + t.hash + '" class="quick-tile"><div class="quick-tile__icon">' + UI.icon(t.icon) + '</div><div><h4>' + t.label + '</h4><p>' + t.desc + '</p></div></a>';
    }).join('');

    var continueHtml;
    if (continueItem) {
      continueHtml = '' +
        '<div class="hero-continue">' +
          '<p class="eyebrow">Continue Learning</p>' +
          '<h2>' + UI.escapeHtml(continueItem.module.title) + '</h2>' +
          '<p class="muted">Next up: ' + UI.escapeHtml(continueItem.lesson.title) + '</p>' +
          '<a class="btn btn--primary btn--lg" href="#/lesson/' + continueItem.lesson.id + '">' + UI.icon('play') + ' Continue Learning</a>' +
        '</div>';
    } else {
      continueHtml = '' +
        '<div class="hero-continue">' +
          '<p class="eyebrow">Course Status</p>' +
          '<h2>All lessons complete!</h2>' +
          '<p class="muted">Revisit any module, or head to the mock examination to test your overall mastery.</p>' +
          '<a class="btn btn--primary btn--lg" href="#/exam">' + UI.icon('file-check') + ' Take Mock Examination</a>' +
        '</div>';
    }

    container().innerHTML = '' +
      '<div class="dashboard">' +
        '<div class="dashboard-hero">' +
          UI.progressRing(overallPct, 140) +
          continueHtml +
        '</div>' +
        '<h3 class="section-title">Your Stats</h3>' +
        '<div class="stat-grid">' + statCards + '</div>' +
        '<h3 class="section-title">Quick Access</h3>' +
        '<div class="quick-access-grid">' + quickTiles + '</div>' +
        '<h3 class="section-title">Achievements</h3>' +
        achievementsGrid(state) +
      '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* Modules list                                                       */
  /* ---------------------------------------------------------------- */
  function modules() {
    var state = App.Storage.getState();
    var cards = App.Data.MODULES.map(function (mod) {
      var prog = moduleLessonProgress(state, mod);
      var quizBest = state.quiz.bestByModule[mod.id];
      return '' +
        '<a href="#/module/' + mod.id + '" class="module-card">' +
          '<div class="module-card__top">' +
            '<div class="module-card__icon">' + UI.icon(mod.icon) + '</div>' +
            '<span class="module-card__number">Module ' + mod.id + '</span>' +
          '</div>' +
          '<h3>' + UI.escapeHtml(mod.title) + '</h3>' +
          '<p>' + UI.escapeHtml(mod.description) + '</p>' +
          '<div class="module-card__meta">' +
            '<span>' + prog.done + ' / ' + prog.total + ' lessons</span>' +
            (quizBest !== undefined ? '<span>Best quiz: ' + Math.round(quizBest) + '%</span>' : '<span class="muted">Quiz not attempted</span>') +
          '</div>' +
          UI.progressBar(prog.pct) +
        '</a>';
    }).join('');

    container().innerHTML = '' +
      '<div class="page-header">' +
        '<p class="eyebrow">COS102 &middot; Problem Solving</p>' +
        '<h1>Course Modules</h1>' +
        '<p class="muted">Six modules covering the full COS102 curriculum, from problem-solving fundamentals through control structures.</p>' +
      '</div>' +
      '<div class="module-grid">' + cards + '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* Module detail                                                      */
  /* ---------------------------------------------------------------- */
  function moduleDetail(moduleIdRaw) {
    var mod = App.Data.getModule(moduleIdRaw);
    if (!mod) { App.Views.notFound(); return; }
    var state = App.Storage.getState();
    var prog = moduleLessonProgress(state, mod);
    var lab = App.Data.LAB_PROBLEMS.filter(function (p) { return p.moduleId === mod.id; })[0];
    var labDone = lab && state.lab[lab.id] && state.lab[lab.id].completed;
    var quizBest = state.quiz.bestByModule[mod.id];
    var quizAttempts = state.quiz.attempts.filter(function (a) { return a.moduleId === mod.id; }).length;

    var lessonSteps = mod.lessons.map(function (l, i) {
      var isDone = App.Storage.isLessonCompleted(l.id);
      var isOpened = state.lessonProgress[l.id] && state.lessonProgress[l.id].opened;
      var statusClass = isDone ? 'is-complete' : isOpened ? 'is-in-progress' : 'is-todo';
      return '' +
        '<a href="#/lesson/' + l.id + '" class="lesson-step ' + statusClass + '">' +
          '<span class="lesson-step__node">' + (isDone ? UI.icon('check') : (i + 1)) + '</span>' +
          '<span class="lesson-step__body">' +
            '<strong>' + UI.escapeHtml(l.title) + '</strong>' +
            '<span class="lesson-step__status">' + (isDone ? 'Completed' : isOpened ? 'In progress' : 'Not started') + '</span>' +
          '</span>' +
          UI.icon('chevron-right') +
        '</a>';
    }).join('');

    var objectives = mod.objectives.map(function (o) { return '<li>' + UI.escapeHtml(o) + '</li>'; }).join('');

    container().innerHTML = '' +
      '<div class="page-header">' +
        '<p class="eyebrow"><a href="#/modules">Modules</a> &rsaquo; Module ' + mod.id + '</p>' +
        '<div class="module-detail__title">' + UI.icon(mod.icon) + '<h1>' + UI.escapeHtml(mod.title) + '</h1></div>' +
        '<p class="muted">' + UI.escapeHtml(mod.description) + '</p>' +
        UI.progressBar(prog.pct) +
        '<p class="muted small">' + prog.done + ' of ' + prog.total + ' lessons complete</p>' +
      '</div>' +
      '<div class="module-layout">' +
        '<div class="module-layout__main">' +
          '<h3 class="section-title">Learning Objectives</h3>' +
          '<ul class="objectives-list">' + objectives + '</ul>' +
          '<h3 class="section-title">Lessons</h3>' +
          '<div class="lesson-flow">' + lessonSteps + '</div>' +
        '</div>' +
        '<aside class="module-layout__side">' +
          '<div class="side-card">' +
            '<div class="side-card__icon">' + UI.icon('clipboard-check') + '</div>' +
            '<h4>Module Quiz</h4>' +
            '<p class="muted small">' + App.Data.getQuestionsByModule(mod.id).length + ' questions &middot; ' + quizAttempts + ' attempt' + (quizAttempts === 1 ? '' : 's') + '</p>' +
            (quizBest !== undefined ? '<p class="muted small">Best score: <strong>' + Math.round(quizBest) + '%</strong></p>' : '') +
            '<a href="#/quiz/' + mod.id + '" class="btn btn--primary btn--block">Start Quiz</a>' +
          '</div>' +
          '<div class="side-card">' +
            '<div class="side-card__icon">' + UI.icon('layers') + '</div>' +
            '<h4>Flashcards</h4>' +
            '<p class="muted small">' + App.Data.getFlashcardsByModule(mod.id).length + ' cards for this module</p>' +
            '<a href="#/flashcards/' + mod.id + '" class="btn btn--outline btn--block">Review Flashcards</a>' +
          '</div>' +
          (lab ? '' +
            '<div class="side-card">' +
              '<div class="side-card__icon">' + UI.icon('puzzle') + '</div>' +
              '<h4>Practice Lab</h4>' +
              '<p class="muted small">' + UI.escapeHtml(lab.title) + '</p>' +
              (labDone ? UI.badge('Completed', 'success') : UI.badge('Not started', 'neutral')) +
              '<a href="#/lab/' + lab.id + '" class="btn btn--outline btn--block">Open Lab Problem</a>' +
            '</div>' : '') +
        '</aside>' +
      '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* Lesson reader                                                      */
  /* ---------------------------------------------------------------- */
  function lesson(lessonId) {
    var found = App.Data.getLesson(lessonId);
    if (!found) { App.Views.notFound(); return; }
    var l = found.lesson, mod = found.module;
    App.Storage.markLessonOpened(l.id);
    App.Shell.refreshTopbar();

    var allLessons = App.Data.getAllLessons();
    var flatIndex = -1;
    for (var i = 0; i < allLessons.length; i++) { if (allLessons[i].lesson.id === l.id) { flatIndex = i; break; } }
    var prevItem = flatIndex > 0 ? allLessons[flatIndex - 1] : null;
    var nextItem = flatIndex < allLessons.length - 1 ? allLessons[flatIndex + 1] : null;

    var isCompleted = App.Storage.isLessonCompleted(l.id);
    var isBookmarked = App.Storage.getState().bookmarks.indexOf(l.id) !== -1;

    var objectives = l.objectives.map(function (o) { return '<li>' + UI.escapeHtml(o) + '</li>'; }).join('');
    var examples = l.examples.map(function (ex) { return '<div class="example-block">' + UI.richText(ex) + '</div>'; }).join('');
    var keyPoints = l.keyPoints.map(function (k) { return '<li>' + UI.richText(k) + '</li>'; }).join('');
    var mistakes = l.commonMistakes.map(function (k) { return '<li>' + UI.richText(k) + '</li>'; }).join('');

    render();

    function render() {
      container().innerHTML = '' +
        '<article class="lesson-reader">' +
          '<p class="eyebrow"><a href="#/module/' + mod.id + '">' + UI.escapeHtml(mod.title) + '</a> &rsaquo; Lesson ' + (found.index + 1) + '</p>' +
          '<div class="lesson-reader__title">' +
            '<h1>' + UI.escapeHtml(l.title) + '</h1>' +
            '<button type="button" class="icon-btn' + (isBookmarked ? ' is-active' : '') + '" data-action="bookmark" aria-label="Bookmark this lesson">' + UI.icon('bookmark') + '</button>' +
          '</div>' +
          '<p class="lesson-reader__intro">' + UI.richText(l.intro) + '</p>' +
          '<section class="lesson-section"><h3>' + UI.icon('flag') + ' Learning Objectives</h3><ul>' + objectives + '</ul></section>' +
          '<section class="lesson-section"><h3>' + UI.icon('book-open') + ' Explanation</h3>' + UI.paragraphs(l.explanation) + '</section>' +
          '<section class="lesson-section"><h3>' + UI.icon('zap') + ' Examples</h3>' + examples + '</section>' +
          '<section class="lesson-section lesson-section--split">' +
            '<div><h3>' + UI.icon('star') + ' Key Points</h3><ul>' + keyPoints + '</ul></div>' +
            '<div><h3>' + UI.icon('alert-triangle') + ' Common Mistakes</h3><ul>' + mistakes + '</ul></div>' +
          '</section>' +
          '<section class="lesson-section callout callout--example">' +
            '<h3>' + UI.icon('lightbulb') + ' Practical Example</h3>' +
            '<p>' + UI.richText(l.practicalExample) + '</p>' +
          '</section>' +
          '<section class="lesson-section callout callout--exercise">' +
            '<h3>' + UI.icon('puzzle') + ' Mini Exercise</h3>' +
            '<p>' + UI.richText(l.exercise.prompt) + '</p>' +
            '<button type="button" class="btn btn--outline" data-action="toggle-guidance">Show Guidance</button>' +
            '<div class="exercise-guidance" id="exercise-guidance" hidden><p>' + UI.richText(l.exercise.guidance) + '</p></div>' +
          '</section>' +
          '<div class="lesson-actions">' +
            '<button type="button" class="btn btn--ghost" data-action="prev-lesson"' + (prevItem ? '' : ' disabled') + '>' + UI.icon('chevron-left') + ' Previous Lesson</button>' +
            '<button type="button" class="btn ' + (isCompleted ? 'btn--outline' : 'btn--primary') + '" data-action="complete">' + UI.icon('check') + (isCompleted ? ' Completed' : ' Mark as Completed') + '</button>' +
            '<button type="button" class="btn btn--ghost" data-action="next-lesson"' + (nextItem ? '' : ' disabled') + '>Next Lesson ' + UI.icon('chevron-right') + '</button>' +
          '</div>' +
        '</article>';

      container().onclick = function (e) {
        var t = e.target.closest('[data-action]');
        if (!t) return;
        var action = t.getAttribute('data-action');
        if (action === 'complete') {
          App.Storage.markLessonCompleted(l.id);
          App.Achievements.checkAll();
          isCompleted = true;
          UI.toast('Lesson marked as completed.', 'success');
          render();
        } else if (action === 'toggle-guidance') {
          var g = UI.qs('#exercise-guidance');
          g.hidden = !g.hidden;
          t.textContent = g.hidden ? 'Show Guidance' : 'Hide Guidance';
        } else if (action === 'bookmark') {
          isBookmarked = App.Storage.toggleBookmark(l.id);
          render();
        } else if (action === 'prev-lesson' && prevItem) {
          location.hash = '#/lesson/' + prevItem.lesson.id;
        } else if (action === 'next-lesson' && nextItem) {
          location.hash = '#/lesson/' + nextItem.lesson.id;
        }
      };
    }
  }

  /* ---------------------------------------------------------------- */
  /* Profile                                                            */
  /* ---------------------------------------------------------------- */
  function profile() {
    var state = App.Storage.getState();
    var p = state.profile;
    var accuracy = quizAccuracy(state);

    container().innerHTML = '' +
      '<div class="page-header">' +
        '<p class="eyebrow">Your Account</p>' +
        '<h1>Profile</h1>' +
      '</div>' +
      '<div class="settings-layout">' +
        '<form class="card form-card" id="profile-form">' +
          '<label>Full Name<input type="text" name="name" value="' + UI.escapeHtml(p.name) + '" placeholder="e.g. Amina Yusuf" maxlength="80"></label>' +
          '<label>Matriculation Number<input type="text" name="matric" value="' + UI.escapeHtml(p.matric) + '" placeholder="e.g. IBBUL/CS/23/1234" maxlength="40"></label>' +
          '<label>Department<input type="text" name="department" value="' + UI.escapeHtml(p.department) + '" placeholder="e.g. Computer Science" maxlength="80"></label>' +
          '<button type="submit" class="btn btn--primary">' + UI.icon('check') + ' Save Profile</button>' +
        '</form>' +
        '<div class="card stat-summary-card">' +
          '<h3>Your Progress</h3>' +
          '<div class="stat-summary-row"><span>Overall Progress</span><strong>' + overallLessonPercent(state) + '%</strong></div>' +
          '<div class="stat-summary-row"><span>Study Streak</span><strong>' + state.streak.current + ' day' + (state.streak.current === 1 ? '' : 's') + '</strong></div>' +
          '<div class="stat-summary-row"><span>Quiz Accuracy</span><strong>' + (accuracy === null ? '\u2014' : accuracy + '%') + '</strong></div>' +
          '<div class="stat-summary-row"><span>Best Exam Score</span><strong>' + (state.exam.attempts.length ? Math.round(state.exam.bestPercentage) + '%' : '\u2014') + '</strong></div>' +
          '<div class="stat-summary-row"><span>Achievements</span><strong>' + state.achievements.unlocked.length + ' / ' + App.Data.ACHIEVEMENTS.length + '</strong></div>' +
        '</div>' +
      '</div>' +
      '<h3 class="section-title">Achievements</h3>' +
      achievementsGrid(state);

    UI.qs('#profile-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);
      App.Storage.updateProfile({
        name: (fd.get('name') || '').toString().trim(),
        matric: (fd.get('matric') || '').toString().trim(),
        department: (fd.get('department') || '').toString().trim()
      });
      App.Shell.refreshTopbar();
      UI.toast('Profile saved.', 'success');
    });
  }

  /* ---------------------------------------------------------------- */
  /* Settings                                                           */
  /* ---------------------------------------------------------------- */
  function applySettingsToDocument(settings) {
    document.documentElement.setAttribute('data-text-size', settings.textSize || 'normal');
    document.body.classList.toggle('reduced-motion', !!settings.reducedMotion);
    var theme = settings.theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    var metaTheme = UI.qs('#meta-theme-color');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#10121c' : '#32399b');
  }
  App.Views.applySettingsToDocument = applySettingsToDocument;

  function settings() {
    var state = App.Storage.getState();
    var s = state.settings;

    container().innerHTML = '' +
      '<div class="page-header">' +
        '<p class="eyebrow">Preferences</p>' +
        '<h1>Settings</h1>' +
      '</div>' +
      '<div class="settings-layout">' +
        '<div class="card">' +
          '<h3>Theme</h3>' +
          '<div class="segmented" id="theme-group">' +
            '<button type="button" data-value="light" class="' + (s.theme !== 'dark' ? 'is-active' : '') + '">' + UI.icon('sun') + ' Light</button>' +
            '<button type="button" data-value="dark" class="' + (s.theme === 'dark' ? 'is-active' : '') + '">' + UI.icon('moon') + ' Dark</button>' +
          '</div>' +
          '<h3>Text Size</h3>' +
          '<div class="segmented" id="text-size-group">' +
            '<button type="button" data-value="small" class="' + (s.textSize === 'small' ? 'is-active' : '') + '">Small</button>' +
            '<button type="button" data-value="normal" class="' + (s.textSize === 'normal' ? 'is-active' : '') + '">Normal</button>' +
            '<button type="button" data-value="large" class="' + (s.textSize === 'large' ? 'is-active' : '') + '">Large</button>' +
          '</div>' +
          '<h3>Reduced Motion</h3>' +
          '<label class="switch-row"><input type="checkbox" id="reduced-motion-toggle"' + (s.reducedMotion ? ' checked' : '') + '><span>Minimize animations and transitions throughout the app</span></label>' +
        '</div>' +
        '<div class="card">' +
          '<h3>Your Data</h3>' +
          '<p class="muted small">Everything is stored only in this browser, on this device.</p>' +
          '<button type="button" class="btn btn--outline btn--block" id="export-btn">' + UI.icon('download') + ' Export Learning Record</button>' +
          '<button type="button" class="btn btn--danger btn--block" id="reset-btn">' + UI.icon('trash') + ' Reset All Progress</button>' +
        '</div>' +
      '</div>';

    UI.qsa('#theme-group button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-value');
        App.Storage.updateSettings({ theme: value });
        applySettingsToDocument(App.Storage.getState().settings);
        App.Shell.refreshTopbar();
        settings();
      });
    });

    UI.qsa('#text-size-group button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-value');
        App.Storage.updateSettings({ textSize: value });
        applySettingsToDocument(App.Storage.getState().settings);
        settings();
      });
    });

    UI.qs('#reduced-motion-toggle').addEventListener('change', function (e) {
      App.Storage.updateSettings({ reducedMotion: e.target.checked });
      applySettingsToDocument(App.Storage.getState().settings);
    });

    UI.qs('#export-btn').addEventListener('click', function () {
      var json = App.Storage.exportRecord();
      var blob = new Blob([json], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      var stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = 'cos102-learning-record-' + stamp + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      UI.toast('Learning record exported.', 'success');
    });

    UI.qs('#reset-btn').addEventListener('click', function () {
      UI.confirmDialog({
        title: 'Reset all progress?',
        message: 'Are you sure? This will permanently erase all learning progress on this device.',
        confirmLabel: 'Reset Everything',
        cancelLabel: 'Cancel',
        danger: true
      }).then(function (ok) {
        if (!ok) return;
        App.Storage.resetAll();
        applySettingsToDocument(App.Storage.getState().settings);
        App.Shell.refreshTopbar();
        UI.toast('All progress has been reset.', 'success');
        location.hash = '#/home';
        App.Router.resolve();
      });
    });
  }

  App.Views.home = home;
  App.Views.modules = modules;
  App.Views.moduleDetail = moduleDetail;
  App.Views.lesson = lesson;
  App.Views.profile = profile;
  App.Views.settings = settings;
  App.Views.notFound = function () {
    container().innerHTML = UI.emptyState('alert-triangle', 'Page not found',
      'The page you are looking for does not exist. Use the navigation to find your way back.',
      '<a href="#/home" class="btn btn--primary">' + UI.icon('home') + ' Back to Dashboard</a>');
  };

  /* ---------------------------------------------------------------- */
  /* Bootstrap                                                          */
  /* ---------------------------------------------------------------- */
  function startStudyTimer() {
    setInterval(function () {
      if (document.visibilityState === 'visible') {
        App.Storage.addStudyTime(30);
      }
    }, 30000);
  }

  function init() {
    App.Storage.load();
    App.Storage.touchStreak();
    App.Achievements.checkAll();
    applySettingsToDocument(App.Storage.getState().settings);
    App.Shell.render();
    window.addEventListener('hashchange', App.Router.resolve);
    App.Router.resolve();
    startStudyTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window.App = window.App || {});
