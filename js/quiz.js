/* ==========================================================================
   quiz.js
   Per-module quiz: question navigation, answer tracking, mark-for-review,
   submission (with unanswered-question confirmation), scoring, and the
   results / review-answers screens. One quiz session lives in `session`
   at a time - starting a new quiz (or retaking one) replaces it.
   ========================================================================== */

(function (App) {
  'use strict';

  var UI = App.UI;
  var session = null; /* { moduleId, questions, answers, marked, mode: 'active'|'results', result } */

  function container() { return UI.qs('#app-main'); }

  function start(moduleId) {
    var questions = UI.shuffle(App.Data.getQuestionsByModule(moduleId));
    if (questions.length === 0) {
      container().innerHTML = UI.emptyState('alert-triangle', 'No questions available', 'This module does not have a question bank yet.');
      return;
    }
    session = {
      moduleId: moduleId,
      questions: questions,
      answers: {},
      marked: {},
      current: 0,
      mode: 'active',
      startedAt: Date.now()
    };
    render();
  }

  function mount(moduleId) {
    moduleId = parseInt(moduleId, 10);
    start(moduleId);
  }

  function currentQuestion() { return session.questions[session.current]; }

  function answeredCount() { return Object.keys(session.answers).length; }
  function unansweredCount() { return session.questions.length - answeredCount(); }

  function navDotClass(index) {
    var q = session.questions[index];
    var classes = ['quiz-nav-dot'];
    if (index === session.current) classes.push('is-current');
    if (session.answers.hasOwnProperty(q.id)) classes.push('is-answered');
    else classes.push('is-unanswered');
    if (session.marked[q.id]) classes.push('is-marked');
    return classes.join(' ');
  }

  function render() {
    if (!session) return;
    if (session.mode === 'results') { renderResults(); return; }
    if (session.mode === 'review') { renderReview(); return; }

    var mod = App.Data.getModule(session.moduleId);
    var q = currentQuestion();
    var total = session.questions.length;
    var pct = Math.round(((session.current + 1) / total) * 100);
    var typeLabel = q.type === 'tf' ? 'True / False' : q.type === 'scenario' ? 'Scenario' : 'Multiple Choice';

    var optionsHtml = q.options.map(function (opt, i) {
      var selected = session.answers[q.id] === i;
      return '' +
        '<button type="button" class="quiz-option' + (selected ? ' is-selected' : '') + '" data-action="select-option" data-index="' + i + '">' +
        '<span class="quiz-option__marker">' + String.fromCharCode(65 + i) + '</span>' +
        '<span class="quiz-option__text">' + UI.escapeHtml(opt) + '</span>' +
        '</button>';
    }).join('');

    var navDotsHtml = session.questions.map(function (_, i) {
      return '<button type="button" class="' + navDotClass(i) + '" data-action="goto" data-index="' + i + '">' + (i + 1) + '</button>';
    }).join('');

    container().innerHTML = '' +
      '<div class="quiz-layout">' +
        '<div class="quiz-main">' +
          '<div class="quiz-topbar">' +
            '<div>' +
              '<p class="eyebrow">' + UI.escapeHtml(mod.title) + ' \u00b7 Quiz</p>' +
              '<h1>Question ' + (session.current + 1) + ' of ' + total + '</h1>' +
            '</div>' +
            '<div class="quiz-topbar__stats">' +
              '<span>' + UI.badge(answeredCount() + ' answered', 'success') + '</span>' +
              '<span>' + UI.badge(unansweredCount() + ' left', 'neutral') + '</span>' +
            '</div>' +
          '</div>' +
          UI.progressBar(pct) +
          '<div class="quiz-card">' +
            '<div class="quiz-card__meta">' + UI.badge(typeLabel, 'accent') + UI.badge(q.topic, 'neutral') + '</div>' +
            '<h2 class="quiz-question">' + UI.escapeHtml(q.question) + '</h2>' +
            '<div class="quiz-options">' + optionsHtml + '</div>' +
          '</div>' +
          '<div class="quiz-actions">' +
            '<button type="button" class="btn btn--ghost" data-action="prev"' + (session.current === 0 ? ' disabled' : '') + '>' + UI.icon('chevron-left') + ' Previous</button>' +
            '<button type="button" class="btn btn--outline" data-action="toggle-mark">' + UI.icon('flag') + (session.marked[q.id] ? ' Unmark' : ' Mark for review') + '</button>' +
            (session.current === total - 1
              ? '<button type="button" class="btn btn--primary" data-action="submit">' + UI.icon('check') + ' Submit Quiz</button>'
              : '<button type="button" class="btn btn--primary" data-action="next">Next ' + UI.icon('chevron-right') + '</button>') +
          '</div>' +
        '</div>' +
        '<aside class="quiz-navigator">' +
          '<h3>Question Navigator</h3>' +
          '<div class="quiz-nav-grid">' + navDotsHtml + '</div>' +
          '<div class="quiz-nav-legend">' +
            '<span><i class="legend-dot legend-dot--answered"></i>Answered</span>' +
            '<span><i class="legend-dot legend-dot--unanswered"></i>Unanswered</span>' +
            '<span><i class="legend-dot legend-dot--marked"></i>Marked</span>' +
          '</div>' +
          '<button type="button" class="btn btn--primary btn--block" data-action="submit">Submit Quiz</button>' +
        '</aside>' +
      '</div>';

    bindEvents();
  }

  function bindEvents() {
    var root = container();
    root.onclick = function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;
      var action = target.getAttribute('data-action');
      var q = currentQuestion();

      if (action === 'select-option') {
        session.answers[q.id] = parseInt(target.getAttribute('data-index'), 10);
        render();
      } else if (action === 'goto') {
        session.current = parseInt(target.getAttribute('data-index'), 10);
        render();
      } else if (action === 'prev') {
        if (session.current > 0) { session.current--; render(); }
      } else if (action === 'next') {
        if (session.current < session.questions.length - 1) { session.current++; render(); }
      } else if (action === 'toggle-mark') {
        session.marked[q.id] = !session.marked[q.id];
        render();
      } else if (action === 'submit') {
        attemptSubmit();
      } else if (action === 'retake') {
        start(session.moduleId);
      } else if (action === 'review-answers') {
        session.mode = 'review';
        render();
      } else if (action === 'back-to-results') {
        session.mode = 'results';
        render();
      } else if (action === 'back-to-module') {
        location.hash = '#/module/' + session.moduleId;
      } else if (action === 'go-flashcards') {
        location.hash = '#/flashcards/' + session.moduleId;
      }
    };
  }

  function attemptSubmit() {
    var unanswered = unansweredCount();
    if (unanswered > 0) {
      UI.confirmDialog({
        title: 'Unanswered questions',
        message: 'You have ' + unanswered + ' unanswered question' + (unanswered === 1 ? '' : 's') + '. ' + (unanswered === 1 ? 'It' : 'They') + ' will be marked incorrect. Submit anyway?',
        confirmLabel: 'Submit Quiz',
        cancelLabel: 'Cancel',
        danger: true
      }).then(function (ok) { if (ok) submit(); });
    } else {
      submit();
    }
  }

  function submit() {
    var correct = 0, incorrect = 0, unanswered = 0;
    var topicBreakdown = {};
    var reviewRows = session.questions.map(function (q) {
      var given = session.answers.hasOwnProperty(q.id) ? session.answers[q.id] : null;
      var isCorrect = given !== null && given === q.correct;
      if (given === null) unanswered++;
      else if (isCorrect) correct++;
      else incorrect++;

      var t = topicBreakdown[q.topic] || { correct: 0, total: 0 };
      t.total++;
      if (isCorrect) t.correct++;
      topicBreakdown[q.topic] = t;

      return { question: q, given: given, isCorrect: isCorrect };
    });

    var total = session.questions.length;
    var percentage = Math.round((correct / total) * 100);

    var attempt = {
      id: UI.uid('quizattempt'),
      moduleId: session.moduleId,
      timestamp: new Date().toISOString(),
      score: correct,
      total: total,
      percentage: percentage,
      correct: correct,
      incorrect: incorrect,
      unanswered: unanswered,
      topicBreakdown: topicBreakdown
    };

    App.Storage.recordQuizAttempt(attempt);
    App.Storage.touchStreak();
    App.Achievements.checkAll();

    session.mode = 'results';
    session.result = { attempt: attempt, reviewRows: reviewRows };
    render();
  }

  function performanceMessage(pct) {
    if (pct === 100) return 'Perfect score! Outstanding mastery of this module.';
    if (pct >= 80) return 'Excellent work - you have a strong grip on this module.';
    if (pct >= 60) return 'Good effort. A little more revision will get you to mastery.';
    if (pct >= 40) return 'You are getting there. Revisit the lessons and try again.';
    return 'This module needs more review. Go back through the lessons before retrying.';
  }

  function renderResults() {
    var mod = App.Data.getModule(session.moduleId);
    var r = session.result.attempt;
    var topics = Object.keys(r.topicBreakdown).map(function (topic) {
      var t = r.topicBreakdown[topic];
      return { topic: topic, pct: Math.round((t.correct / t.total) * 100) };
    });
    var strong = topics.filter(function (t) { return t.pct >= 80; }).sort(function (a, b) { return b.pct - a.pct; });
    var weak = topics.filter(function (t) { return t.pct < 60; }).sort(function (a, b) { return a.pct - b.pct; });

    container().innerHTML = '' +
      '<div class="results-layout">' +
        '<div class="results-hero">' +
          UI.progressRing(r.percentage, 160) +
          '<div>' +
            '<p class="eyebrow">' + UI.escapeHtml(mod.title) + ' \u00b7 Quiz Complete</p>' +
            '<h1>' + r.score + ' / ' + r.total + '</h1>' +
            '<p class="results-message">' + performanceMessage(r.percentage) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="results-stats">' +
          '<div class="stat-chip stat-chip--success">' + UI.icon('check') + '<span>' + r.correct + ' Correct</span></div>' +
          '<div class="stat-chip stat-chip--danger">' + UI.icon('x') + '<span>' + r.incorrect + ' Incorrect</span></div>' +
          '<div class="stat-chip stat-chip--neutral">' + UI.icon('help-circle') + '<span>' + r.unanswered + ' Unanswered</span></div>' +
        '</div>' +
        '<div class="results-topics">' +
          '<div class="topic-panel">' +
            '<h3>Strong topics</h3>' +
            (strong.length ? '<ul>' + strong.map(function (t) { return '<li>' + UI.escapeHtml(t.topic) + ' <span>' + t.pct + '%</span></li>'; }).join('') + '</ul>' : '<p class="muted">Keep practicing to build strong topics.</p>') +
          '</div>' +
          '<div class="topic-panel">' +
            '<h3>Weak topics</h3>' +
            (weak.length ? '<ul>' + weak.map(function (t) { return '<li>' + UI.escapeHtml(t.topic) + ' <span>' + t.pct + '%</span></li>'; }).join('') + '</ul>' : '<p class="muted">No weak topics detected - well done!</p>') +
            (weak.length ? '<p class="muted">Recommended: revisit the ' + UI.escapeHtml(mod.title) + ' lessons covering these topics, then retake the quiz.</p>' : '') +
          '</div>' +
        '</div>' +
        '<div class="results-actions">' +
          '<button type="button" class="btn btn--primary" data-action="retake">' + UI.icon('refresh') + ' Retake Quiz</button>' +
          '<button type="button" class="btn btn--outline" data-action="review-answers">' + UI.icon('clipboard-check') + ' Review Answers</button>' +
          '<button type="button" class="btn btn--ghost" data-action="back-to-module">' + UI.icon('arrow-left') + ' Back to Module</button>' +
          '<button type="button" class="btn btn--ghost" data-action="go-flashcards">' + UI.icon('layers') + ' Flashcards</button>' +
        '</div>' +
      '</div>';

    bindEvents();
  }

  function renderReview() {
    var mod = App.Data.getModule(session.moduleId);
    var rows = session.result.reviewRows.map(function (row, i) {
      var q = row.question;
      var givenText = row.given === null ? 'Not answered' : q.options[row.given];
      return '' +
        '<div class="review-row ' + (row.isCorrect ? 'is-correct' : 'is-incorrect') + '">' +
          '<div class="review-row__head">' +
            '<span class="review-row__num">Q' + (i + 1) + '</span>' +
            (row.isCorrect ? UI.badge('Correct', 'success') : UI.badge('Incorrect', 'danger')) +
          '</div>' +
          '<p class="review-row__question">' + UI.escapeHtml(q.question) + '</p>' +
          '<p class="review-row__line"><strong>Your answer:</strong> ' + UI.escapeHtml(givenText) + '</p>' +
          (row.isCorrect ? '' : '<p class="review-row__line"><strong>Correct answer:</strong> ' + UI.escapeHtml(q.options[q.correct]) + '</p>') +
          '<p class="review-row__explanation">' + UI.escapeHtml(q.explanation) + '</p>' +
        '</div>';
    }).join('');

    container().innerHTML = '' +
      '<div class="review-layout">' +
        '<p class="eyebrow">' + UI.escapeHtml(mod.title) + ' \u00b7 Answer Review</p>' +
        '<h1>Review Your Answers</h1>' +
        '<div class="review-list">' + rows + '</div>' +
        '<div class="results-actions">' +
          '<button type="button" class="btn btn--ghost" data-action="back-to-results">' + UI.icon('arrow-left') + ' Back to Results</button>' +
          '<button type="button" class="btn btn--primary" data-action="retake">' + UI.icon('refresh') + ' Retake Quiz</button>' +
        '</div>' +
      '</div>';

    bindEvents();
  }

  App.Quiz = {
    mount: mount
  };

})(window.App = window.App || {});
