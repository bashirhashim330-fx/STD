/* ==========================================================================
   exam.js
   Full mock examination: 25 questions randomly drawn from the entire
   COS102 question bank, a real 30-minute countdown timer (auto-submits at
   zero), a question navigator, submission with confirmation, scoring,
   and results / review screens. Restarting generates a fresh question set
   and resets the timer without a page reload.
   ========================================================================== */

(function (App) {
  'use strict';

  var UI = App.UI;
  var EXAM_QUESTION_COUNT = 25;
  var EXAM_DURATION_SECONDS = 30 * 60;

  var session = null; /* { questions, answers, marked, current, mode, secondsLeft, timerId, result } */

  function container() { return UI.qs('#app-main'); }

  function buildQuestionSet() {
    var all = App.Data.getAllQuestions();
    var shuffled = UI.shuffle(all);
    return shuffled.slice(0, Math.min(EXAM_QUESTION_COUNT, shuffled.length));
  }

  function stopTimer() {
    if (session && session.timerId) {
      clearInterval(session.timerId);
      session.timerId = null;
    }
  }

  function unmount() {
    stopTimer();
  }

  function startExam() {
    stopTimer();
    session = {
      questions: buildQuestionSet(),
      answers: {},
      marked: {},
      current: 0,
      mode: 'active',
      secondsLeft: EXAM_DURATION_SECONDS,
      totalDuration: EXAM_DURATION_SECONDS,
      timerId: null
    };
    App.Router.setUnmount(unmount);
    session.timerId = setInterval(tick, 1000);
    render();
  }

  function tick() {
    if (!session || session.mode !== 'active') return;
    session.secondsLeft--;
    if (session.secondsLeft <= 0) {
      session.secondsLeft = 0;
      stopTimer();
      submit(true);
      return;
    }
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    var elText = UI.qs('#exam-timer-value');
    if (!elText) return;
    elText.textContent = UI.formatClock(session.secondsLeft);
    var wrap = UI.qs('#exam-timer');
    if (wrap) {
      wrap.classList.toggle('is-warning', session.secondsLeft <= 300 && session.secondsLeft > 60);
      wrap.classList.toggle('is-critical', session.secondsLeft <= 60);
    }
  }

  function mount() {
    if (!session || session.mode === 'intro') {
      renderIntro();
    } else {
      if (session.mode === 'active' && !session.timerId) {
        /* Resume the live countdown if the student navigated away mid-exam
           and came back - the timer must keep running, never pause. */
        App.Router.setUnmount(unmount);
        session.timerId = setInterval(tick, 1000);
      }
      render();
    }
  }

  function currentQuestion() { return session.questions[session.current]; }
  function answeredCount() { return Object.keys(session.answers).length; }
  function unansweredCount() { return session.questions.length - answeredCount(); }

  function renderIntro() {
    stopTimer();
    var state = App.Storage.getState();
    var attempts = state.exam.attempts;
    var lastAttempt = attempts[attempts.length - 1];

    container().innerHTML = '' +
      '<div class="exam-intro">' +
        '<p class="eyebrow">Mock Examination</p>' +
        '<h1>COS102 Comprehensive Examination</h1>' +
        '<p class="exam-intro__desc">This examination draws ' + EXAM_QUESTION_COUNT + ' questions at random from the entire COS102 question bank, covering every module. You will have 30 minutes on the clock, with a live navigator to move between questions and mark any for review.</p>' +
        '<div class="exam-intro__stats">' +
          '<div class="mini-stat"><span class="mini-stat__value">' + EXAM_QUESTION_COUNT + '</span><span class="mini-stat__label">Questions</span></div>' +
          '<div class="mini-stat"><span class="mini-stat__value">30:00</span><span class="mini-stat__label">Time limit</span></div>' +
          '<div class="mini-stat"><span class="mini-stat__value">' + attempts.length + '</span><span class="mini-stat__label">Past attempts</span></div>' +
          '<div class="mini-stat"><span class="mini-stat__value">' + Math.round(state.exam.bestPercentage) + '%</span><span class="mini-stat__label">Best score</span></div>' +
        '</div>' +
        (lastAttempt ? '<p class="muted">Last attempt: ' + lastAttempt.score + '/' + lastAttempt.total + ' (' + lastAttempt.percentage + '%) on ' + UI.formatDate(lastAttempt.timestamp) + '</p>' : '') +
        '<ul class="exam-intro__rules">' +
          '<li>Once started, the 30-minute timer cannot be paused.</li>' +
          '<li>If time runs out, the examination is submitted automatically.</li>' +
          '<li>You can move freely between questions and mark any for later review.</li>' +
        '</ul>' +
        '<button type="button" class="btn btn--primary btn--lg" data-action="begin-exam">' + UI.icon('play') + ' Start Examination</button>' +
      '</div>';

    container().onclick = function (e) {
      var t = e.target.closest('[data-action="begin-exam"]');
      if (t) startExam();
    };
  }

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
    if (session.mode === 'results') { renderResults(); return; }
    if (session.mode === 'review') { renderReview(); return; }

    var q = currentQuestion();
    var total = session.questions.length;
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
              '<p class="eyebrow">' + UI.escapeHtml(q.moduleTitle) + ' \u00b7 Question ' + (session.current + 1) + ' of ' + total + '</p>' +
              '<h1>Mock Examination</h1>' +
            '</div>' +
            '<div id="exam-timer" class="exam-timer">' + UI.icon('clock') + '<span id="exam-timer-value">' + UI.formatClock(session.secondsLeft) + '</span></div>' +
          '</div>' +
          UI.progressBar(Math.round(((session.current + 1) / total) * 100)) +
          '<div class="quiz-card">' +
            '<div class="quiz-card__meta">' + UI.badge(typeLabel, 'accent') + UI.badge(q.moduleTitle, 'neutral') + '</div>' +
            '<h2 class="quiz-question">' + UI.escapeHtml(q.question) + '</h2>' +
            '<div class="quiz-options">' + optionsHtml + '</div>' +
          '</div>' +
          '<div class="quiz-actions">' +
            '<button type="button" class="btn btn--ghost" data-action="prev"' + (session.current === 0 ? ' disabled' : '') + '>' + UI.icon('chevron-left') + ' Previous</button>' +
            '<button type="button" class="btn btn--outline" data-action="toggle-mark">' + UI.icon('flag') + (session.marked[q.id] ? ' Unmark' : ' Mark for review') + '</button>' +
            (session.current === total - 1
              ? '<button type="button" class="btn btn--primary" data-action="submit">' + UI.icon('check') + ' Submit Examination</button>'
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
          '<button type="button" class="btn btn--primary btn--block" data-action="submit">Submit Examination</button>' +
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
      var q = session.mode === 'active' ? currentQuestion() : null;

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
      } else if (action === 'restart') {
        startExam();
      } else if (action === 'review-answers') {
        session.mode = 'review';
        render();
      } else if (action === 'back-to-results') {
        session.mode = 'results';
        render();
      } else if (action === 'exam-home') {
        session.mode = 'intro';
        location.hash = '#/exam';
        mount();
      }
    };
  }

  function attemptSubmit() {
    var unanswered = unansweredCount();
    if (unanswered > 0) {
      UI.confirmDialog({
        title: 'Unanswered questions',
        message: unanswered + ' question' + (unanswered === 1 ? ' is' : 's are') + ' unanswered and will be marked incorrect. Submit examination?',
        confirmLabel: 'Submit Examination',
        cancelLabel: 'Cancel',
        danger: true
      }).then(function (ok) { if (ok) submit(false); });
    } else {
      submit(false);
    }
  }

  function submit(autoSubmitted) {
    stopTimer();
    var correct = 0, incorrect = 0, unanswered = 0;
    var reviewRows = session.questions.map(function (q) {
      var given = session.answers.hasOwnProperty(q.id) ? session.answers[q.id] : null;
      var isCorrect = given !== null && given === q.correct;
      if (given === null) unanswered++;
      else if (isCorrect) correct++;
      else incorrect++;
      return { question: q, given: given, isCorrect: isCorrect };
    });

    var total = session.questions.length;
    var percentage = Math.round((correct / total) * 100);
    var durationUsed = session.totalDuration - session.secondsLeft;

    var attempt = {
      id: UI.uid('examattempt'),
      timestamp: new Date().toISOString(),
      score: correct,
      total: total,
      percentage: percentage,
      correct: correct,
      incorrect: incorrect,
      unanswered: unanswered,
      durationUsedSeconds: durationUsed,
      autoSubmitted: !!autoSubmitted
    };

    App.Storage.recordExamAttempt(attempt);
    App.Storage.touchStreak();
    App.Achievements.checkAll();

    session.mode = 'results';
    session.result = { attempt: attempt, reviewRows: reviewRows };

    if (autoSubmitted) {
      UI.toast('Time is up. Your examination has been submitted automatically.', 'warning', { duration: 6000 });
    }
    render();
  }

  function performanceLabel(pct) {
    if (pct >= 80) return 'Excellent';
    if (pct >= 65) return 'Strong';
    if (pct >= 50) return 'Fair';
    return 'Needs Improvement';
  }

  function renderResults() {
    var r = session.result.attempt;
    container().innerHTML = '' +
      '<div class="results-layout">' +
        (r.autoSubmitted ? '<div class="alert alert--warning">' + UI.icon('alert-triangle') + ' Time expired - this examination was submitted automatically.</div>' : '') +
        '<div class="results-hero">' +
          UI.progressRing(r.percentage, 160) +
          '<div>' +
            '<p class="eyebrow">Examination Complete</p>' +
            '<h1>' + r.score + ' / ' + r.total + '</h1>' +
            '<p class="results-message">Performance: <strong>' + performanceLabel(r.percentage) + '</strong> \u00b7 Completed in ' + UI.formatDuration(r.durationUsedSeconds) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="results-stats">' +
          '<div class="stat-chip stat-chip--success">' + UI.icon('check') + '<span>' + r.correct + ' Correct</span></div>' +
          '<div class="stat-chip stat-chip--danger">' + UI.icon('x') + '<span>' + r.incorrect + ' Incorrect</span></div>' +
          '<div class="stat-chip stat-chip--neutral">' + UI.icon('help-circle') + '<span>' + r.unanswered + ' Unanswered</span></div>' +
        '</div>' +
        '<div class="results-actions">' +
          '<button type="button" class="btn btn--outline" data-action="review-answers">' + UI.icon('clipboard-check') + ' Review Answers</button>' +
          '<button type="button" class="btn btn--primary" data-action="restart">' + UI.icon('refresh') + ' Restart Examination</button>' +
          '<button type="button" class="btn btn--ghost" data-action="exam-home">' + UI.icon('home') + ' Examination Home</button>' +
        '</div>' +
      '</div>';
    bindEvents();
  }

  function renderReview() {
    var rows = session.result.reviewRows.map(function (row, i) {
      var q = row.question;
      var givenText = row.given === null ? 'Not answered' : q.options[row.given];
      return '' +
        '<div class="review-row ' + (row.isCorrect ? 'is-correct' : 'is-incorrect') + '">' +
          '<div class="review-row__head">' +
            '<span class="review-row__num">Q' + (i + 1) + '</span>' +
            UI.badge(q.moduleTitle, 'neutral') +
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
        '<p class="eyebrow">Mock Examination \u00b7 Answer Review</p>' +
        '<h1>Review Your Answers</h1>' +
        '<div class="review-list">' + rows + '</div>' +
        '<div class="results-actions">' +
          '<button type="button" class="btn btn--ghost" data-action="back-to-results">' + UI.icon('arrow-left') + ' Back to Results</button>' +
          '<button type="button" class="btn btn--primary" data-action="restart">' + UI.icon('refresh') + ' Restart Examination</button>' +
        '</div>' +
      '</div>';
    bindEvents();
  }

  App.Exam = {
    mount: mount,
    unmount: unmount
  };

})(window.App = window.App || {});
