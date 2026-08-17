/* ==========================================================================
   tutor.js
   An offline, chat-style COS102 tutor. Every response is generated from
   the course material already stored in App.Data (module descriptions,
   lesson key points, examples, common mistakes, exercises and the quiz
   bank) - there is no external AI call of any kind. The tutor can explain
   a topic, simplify it, give an example, give a hint, suggest a practice
   problem, or quiz the student with an inline interactive question.
   ========================================================================== */

(function (App) {
  'use strict';

  var UI = App.UI;
  var chat = []; /* { role: 'user'|'tutor', kind: 'text'|'quiz', text, html, quiz } */
  var lastModuleId = null;
  var keywordIndex = null;

  function container() { return UI.qs('#app-main'); }

  /* ---------------------------------------------------------------- */
  /* Topic matching                                                     */
  /* ---------------------------------------------------------------- */
  function buildKeywordIndex() {
    if (keywordIndex) return keywordIndex;
    keywordIndex = App.Data.MODULES.map(function (mod) {
      var words = [];
      function addWords(str) {
        (str || '').toLowerCase().split(/[^a-z0-9]+/).forEach(function (w) {
          if (w.length > 3 && words.indexOf(w) === -1) words.push(w);
        });
      }
      addWords(mod.title);
      mod.lessons.forEach(function (l) {
        addWords(l.title);
        (l.keyPoints || []).forEach(addWords);
      });
      return { moduleId: mod.id, words: words };
    });
    return keywordIndex;
  }

  function findModule(text) {
    var lower = text.toLowerCase();
    var tokens = lower.split(/[^a-z0-9]+/).filter(function (w) { return w.length > 3; });

    for (var i = 0; i < App.Data.MODULES.length; i++) {
      var mod = App.Data.MODULES[i];
      var titleLower = mod.title.toLowerCase();
      var slugLower = mod.slug.toLowerCase();
      for (var j = 0; j < tokens.length; j++) {
        if (titleLower.indexOf(tokens[j]) !== -1 || slugLower.indexOf(tokens[j]) !== -1) return mod.id;
      }
    }
    var numMatch = lower.match(/module\s*([1-6])\b/);
    if (numMatch) return parseInt(numMatch[1], 10);

    var index = buildKeywordIndex();
    var scores = index.map(function (entry) {
      var score = 0;
      tokens.forEach(function (tok) { if (entry.words.indexOf(tok) !== -1) score++; });
      return { moduleId: entry.moduleId, score: score };
    }).sort(function (a, b) { return b.score - a.score; });
    if (scores[0] && scores[0].score > 0) return scores[0].moduleId;
    return null;
  }

  var ACTION_PHRASES = {
    explain: ['explain', 'teach', 'understand', 'what is', 'tell me about'],
    simplify: ['simplify', 'simple', 'easier', 'shorter', 'eli5'],
    example: ['example', 'instance', 'show me'],
    hint: ['hint', 'stuck', 'tip', 'mistake'],
    practice: ['practice', 'exercise', 'problem to solve'],
    quiz: ['quiz', 'test me', 'ask me a question']
  };

  function findAction(text) {
    var lower = text.toLowerCase();
    var found = null;
    Object.keys(ACTION_PHRASES).forEach(function (action) {
      if (found) return;
      var phrases = ACTION_PHRASES[action];
      for (var i = 0; i < phrases.length; i++) {
        if (lower.indexOf(phrases[i]) !== -1) { found = action; return; }
      }
    });
    return found;
  }

  /* ---------------------------------------------------------------- */
  /* Response builders - all sourced from App.Data                    */
  /* ---------------------------------------------------------------- */
  function respondExplain(moduleId) {
    var mod = App.Data.getModule(moduleId);
    var points = [];
    mod.lessons.forEach(function (l) { points = points.concat((l.keyPoints || []).slice(0, 2)); });
    return '' +
      '<p><strong>' + UI.escapeHtml(mod.title) + '</strong> &mdash; ' + UI.richText(mod.description) + '</p>' +
      '<p>Key ideas:</p><ul>' + points.slice(0, 5).map(function (p) { return '<li>' + UI.richText(p) + '</li>'; }).join('') + '</ul>';
  }

  function respondSimplify(moduleId) {
    var mod = App.Data.getModule(moduleId);
    var first = mod.lessons[0] && mod.lessons[0].keyPoints && mod.lessons[0].keyPoints[0];
    return '<p>In short: ' + UI.richText(first || mod.description) + '</p>';
  }

  function respondExample(moduleId) {
    var mod = App.Data.getModule(moduleId);
    var pool = [];
    mod.lessons.forEach(function (l) { pool = pool.concat(l.examples || []); });
    if (pool.length === 0) return '<p>I do not have a stored example for this topic yet.</p>';
    var ex = pool[Math.floor(Math.random() * pool.length)];
    return '<p>Here is an example:</p><div class="example-block">' + UI.richText(ex) + '</div>';
  }

  function respondHint(moduleId) {
    var mod = App.Data.getModule(moduleId);
    var pool = [];
    mod.lessons.forEach(function (l) { pool = pool.concat(l.commonMistakes || []); });
    if (pool.length === 0) return '<p>Watch your logic carefully and trace it with sample values before trusting it.</p>';
    var tip = pool[Math.floor(Math.random() * pool.length)];
    return '<p><strong>Hint</strong> &mdash; a common mistake to avoid:</p><p>' + UI.richText(tip) + '</p>';
  }

  function respondPractice(moduleId) {
    var mod = App.Data.getModule(moduleId);
    var lesson = mod.lessons[Math.floor(Math.random() * mod.lessons.length)];
    var lab = App.Data.LAB_PROBLEMS.filter(function (p) { return p.moduleId === moduleId; })[0];
    var html = '<p><strong>Practice problem:</strong> ' + UI.richText(lesson.exercise.prompt) + '</p>';
    if (lab) html += '<p>Want a fuller guided walkthrough? Try the <a href="#/lab/' + lab.id + '">' + UI.escapeHtml(lab.title) + '</a> lab problem.</p>';
    return html;
  }

  function quickActionsHtml(moduleId) {
    var mod = App.Data.getModule(moduleId);
    var actions = [
      { a: 'explain', label: 'Explain' },
      { a: 'simplify', label: 'Simplify' },
      { a: 'example', label: 'Example' },
      { a: 'hint', label: 'Hint' },
      { a: 'practice', label: 'Practice Problem' },
      { a: 'quiz', label: 'Quiz Me' }
    ];
    var chips = actions.map(function (x) {
      return '<button type="button" class="chat-chip" data-action="quick-action" data-topic-action="' + x.a + '" data-module="' + moduleId + '">' + x.label + '</button>';
    }).join('');
    return '<p class="muted small">More about ' + UI.escapeHtml(mod.title) + ':</p><div class="chat-chip-row">' + chips + '</div>';
  }

  function fallbackHelp() {
    var chips = App.Data.MODULES.map(function (m) {
      return '<button type="button" class="chat-chip" data-action="quick-module" data-module="' + m.id + '">' + UI.escapeHtml(m.title) + '</button>';
    }).join('');
    return '<p>I am not sure which topic that relates to yet. Try naming one directly, for example "algorithms", "flowcharts", "pseudocode", "control structures", or say "module 3". Or pick one below:</p>' +
      '<div class="chat-chip-row">' + chips + '</div>';
  }

  function welcomeMessage() {
    var chips = App.Data.MODULES.map(function (m) {
      return '<button type="button" class="chat-chip" data-action="quick-module" data-module="' + m.id + '">' + UI.escapeHtml(m.title) + '</button>';
    }).join('');
    return '<p>Hi, I am your offline COS102 tutor. I can explain a topic, simplify it, give an example, give a hint, suggest a practice problem, or quiz you - all using the course material stored on this device. No internet connection or external AI is used.</p>' +
      '<p class="muted small">Choose a module to get started, or type something like &ldquo;explain flowcharts&rdquo; or &ldquo;quiz me on pseudocode&rdquo;.</p>' +
      '<div class="chat-chip-row">' + chips + '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* Dispatch + chat state                                             */
  /* ---------------------------------------------------------------- */
  function dispatchAction(action, moduleId) {
    if (action === 'quiz') {
      var qs = App.Data.getQuestionsByModule(moduleId);
      if (qs.length === 0) {
        chat.push({ role: 'tutor', kind: 'text', html: '<p>No questions are available for that module yet.</p>' });
      } else {
        var q = qs[Math.floor(Math.random() * qs.length)];
        chat.push({ role: 'tutor', kind: 'quiz', quiz: { question: q, answered: false, selectedIndex: null } });
      }
    } else {
      var builders = { explain: respondExplain, simplify: respondSimplify, example: respondExample, hint: respondHint, practice: respondPractice };
      var builder = builders[action] || respondExplain;
      chat.push({ role: 'tutor', kind: 'text', html: builder(moduleId) });
    }
    chat.push({ role: 'tutor', kind: 'text', html: quickActionsHtml(moduleId) });
  }

  function handleUserText(rawText) {
    var text = (rawText || '').trim();
    if (!text) return;
    chat.push({ role: 'user', text: text });

    var matchedModule = findModule(text);
    var moduleId = matchedModule || lastModuleId;
    var action = findAction(text) || 'explain';

    if (!moduleId) {
      chat.push({ role: 'tutor', kind: 'text', html: fallbackHelp() });
      render();
      return;
    }
    lastModuleId = moduleId;
    dispatchAction(action, moduleId);
    render();
  }

  function simulateUserAction(label, moduleId, action) {
    var mod = App.Data.getModule(moduleId);
    chat.push({ role: 'user', text: label + ' \u2014 ' + mod.title });
    lastModuleId = moduleId;
    dispatchAction(action, moduleId);
    render();
  }

  /* ---------------------------------------------------------------- */
  /* Rendering                                                          */
  /* ---------------------------------------------------------------- */
  function renderQuizBubble(msg, idx) {
    var q = msg.quiz.question;
    var optsHtml = q.options.map(function (opt, i) {
      var cls = 'chat-quiz-option';
      if (msg.quiz.answered) {
        if (i === q.correct) cls += ' is-correct';
        else if (i === msg.quiz.selectedIndex) cls += ' is-incorrect';
      }
      return '<button type="button" class="' + cls + '" data-action="tutor-answer" data-msg="' + idx + '" data-index="' + i + '"' + (msg.quiz.answered ? ' disabled' : '') + '>' +
        '<span>' + String.fromCharCode(65 + i) + '</span>' + UI.escapeHtml(opt) + '</button>';
    }).join('');
    return '' +
      '<div class="chat-bubble chat-bubble--tutor chat-bubble--quiz">' +
        '<p class="chat-quiz-label">' + UI.icon('help-circle') + ' Quick Question &middot; ' + UI.escapeHtml(q.moduleTitle || '') + '</p>' +
        '<p>' + UI.escapeHtml(q.question) + '</p>' +
        '<div class="chat-quiz-options">' + optsHtml + '</div>' +
        (msg.quiz.answered ? '<p class="chat-quiz-explain">' + (msg.quiz.selectedIndex === q.correct ? '<strong>Correct!</strong> ' : '<strong>Not quite.</strong> ') + UI.escapeHtml(q.explanation) + '</p>' : '') +
      '</div>';
  }

  function renderMessage(msg, idx) {
    if (msg.role === 'user') {
      return '<div class="chat-bubble chat-bubble--user">' + UI.escapeHtml(msg.text) + '</div>';
    }
    if (msg.kind === 'quiz') return renderQuizBubble(msg, idx);
    return '<div class="chat-bubble chat-bubble--tutor">' + msg.html + '</div>';
  }

  function render() {
    var transcript = chat.map(renderMessage).join('');
    container().innerHTML = '' +
      '<div class="tutor-layout">' +
        '<div class="page-header">' +
          '<p class="eyebrow">Offline Tutor</p>' +
          '<h1>COS102 Tutor</h1>' +
          '<p class="muted">Ask about any topic from the course. Everything here comes from material already stored in this app - no internet connection is used.</p>' +
        '</div>' +
        '<div class="chat-transcript" id="chat-transcript">' + transcript + '</div>' +
        '<form class="chat-input-row" id="chat-form">' +
          '<input type="text" id="chat-input" placeholder="e.g. explain flowcharts, hint on loops, quiz me on pseudocode" autocomplete="off">' +
          '<button type="submit" class="btn btn--primary">' + UI.icon('arrow-right') + ' Send</button>' +
        '</form>' +
      '</div>';

    bindEvents();
    var t = UI.qs('#chat-transcript');
    if (t) t.scrollTop = t.scrollHeight;
  }

  function bindEvents() {
    container().onclick = function (e) {
      var t = e.target.closest('[data-action]');
      if (!t) return;
      var action = t.getAttribute('data-action');
      if (action === 'tutor-answer') {
        var msgIdx = parseInt(t.getAttribute('data-msg'), 10);
        var optIdx = parseInt(t.getAttribute('data-index'), 10);
        var msg = chat[msgIdx];
        if (msg && msg.kind === 'quiz' && !msg.quiz.answered) {
          msg.quiz.answered = true;
          msg.quiz.selectedIndex = optIdx;
          render();
        }
      } else if (action === 'quick-action') {
        var topicAction = t.getAttribute('data-topic-action');
        var moduleId = parseInt(t.getAttribute('data-module'), 10);
        var labels = { explain: 'Explain', simplify: 'Simplify', example: 'Give an example', hint: 'Give a hint', practice: 'Give a practice problem', quiz: 'Quiz me' };
        simulateUserAction(labels[topicAction] || 'Explain', moduleId, topicAction);
      } else if (action === 'quick-module') {
        var qmId = parseInt(t.getAttribute('data-module'), 10);
        simulateUserAction('Tell me about', qmId, 'explain');
      }
    };

    var form = UI.qs('#chat-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = UI.qs('#chat-input');
        var value = input.value;
        input.value = '';
        handleUserText(value);
      });
    }
  }

  function mount() {
    if (chat.length === 0) {
      chat.push({ role: 'tutor', kind: 'text', html: welcomeMessage() });
    }
    render();
  }

  App.Tutor = { mount: mount };

})(window.App = window.App || {});
