/* ==========================================================================
   storage.js
   Centralized localStorage-backed state management for the COS102 platform.
   Nothing else in the app should touch localStorage directly - everything
   goes through App.Storage so the shape of the saved data stays consistent
   and the app never crashes on missing/corrupt data.
   ========================================================================== */

(function (App) {
  'use strict';

  var STORAGE_KEY = 'cos102_state_v1';
  var state = null;

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function daysBetween(a, b) {
    var da = new Date(a + 'T00:00:00');
    var db = new Date(b + 'T00:00:00');
    return Math.round((db - da) / 86400000);
  }

  function defaultState() {
    return {
      version: 1,
      profile: {
        name: '',
        matric: '',
        department: ''
      },
      lessonProgress: {
        /* lessonId: { opened, completed, openedAt, completedAt } */
      },
      quiz: {
        attempts: [],
        bestByModule: {},
        lastByModule: {},
        weakTopics: {}
      },
      exam: {
        attempts: [],
        bestScore: 0,
        bestPercentage: 0
      },
      flashcards: {
        /* cardId: { seen, known } */
      },
      lab: {
        /* problemId: { steps: {stepKey:true}, completed:false } */
      },
      streak: {
        current: 0,
        longest: 0,
        lastActiveDate: null
      },
      achievements: {
        unlocked: [],
        unlockedAt: {}
      },
      bookmarks: [],
      settings: {
        textSize: 'normal',
        reducedMotion: false,
        theme: 'light'
      },
      meta: {
        studyTimeSeconds: 0,
        createdAt: new Date().toISOString(),
        lastVisit: new Date().toISOString()
      }
    };
  }

  function deepMerge(base, incoming) {
    if (typeof incoming !== 'object' || incoming === null || Array.isArray(incoming)) {
      return incoming === undefined ? base : incoming;
    }
    if (typeof base !== 'object' || base === null || Array.isArray(base)) {
      return incoming;
    }
    /* Union of keys from both sides - this is critical: dynamically-keyed
       objects (lessonProgress, quiz.bestByModule, flashcards, lab, etc.)
       start empty in the default template, so a merge that only walked
       base's keys would silently discard every saved entry on load. */
    var out = {};
    var keys = Object.keys(base).concat(Object.keys(incoming).filter(function (k) { return !base.hasOwnProperty(k); }));
    keys.forEach(function (key) {
      var baseHas = base.hasOwnProperty(key);
      var incomingHas = incoming.hasOwnProperty(key);
      if (baseHas && incomingHas) {
        if (typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key]) &&
            typeof incoming[key] === 'object' && incoming[key] !== null && !Array.isArray(incoming[key])) {
          out[key] = deepMerge(base[key], incoming[key]);
        } else {
          out[key] = incoming[key];
        }
      } else if (incomingHas) {
        out[key] = incoming[key];
      } else {
        out[key] = base[key];
      }
    });
    return out;
  }

  function load() {
    var def = defaultState();
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        /* First-ever visit: default to the device's OS-level light/dark
           preference if the browser exposes one. After this, whatever the
           student explicitly picks always wins on every future load. */
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          def.settings.theme = 'dark';
        }
        state = def;
        persist();
        return state;
      }
      var parsed = JSON.parse(raw);
      state = deepMerge(def, parsed);
    } catch (e) {
      console.warn('COS102: could not read saved progress, starting fresh.', e);
      state = def;
    }
    return state;
  }

  function persist() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error('COS102: failed to save progress.', e);
      return false;
    }
  }

  function getState() {
    if (!state) load();
    return state;
  }

  /* ---------------------------------------------------------------- */
  /* Profile                                                          */
  /* ---------------------------------------------------------------- */
  function updateProfile(profile) {
    getState().profile = Object.assign({}, state.profile, profile);
    persist();
  }

  /* ---------------------------------------------------------------- */
  /* Lessons                                                          */
  /* ---------------------------------------------------------------- */
  function markLessonOpened(lessonId) {
    getState();
    var entry = state.lessonProgress[lessonId] || { opened: false, completed: false };
    if (!entry.opened) {
      entry.opened = true;
      entry.openedAt = new Date().toISOString();
    }
    state.lessonProgress[lessonId] = entry;
    persist();
  }

  function markLessonCompleted(lessonId) {
    getState();
    var entry = state.lessonProgress[lessonId] || { opened: true, completed: false };
    entry.opened = true;
    if (!entry.completed) {
      entry.completed = true;
      entry.completedAt = new Date().toISOString();
    }
    state.lessonProgress[lessonId] = entry;
    persist();
  }

  function isLessonCompleted(lessonId) {
    var e = getState().lessonProgress[lessonId];
    return !!(e && e.completed);
  }

  function toggleBookmark(lessonId) {
    getState();
    var idx = state.bookmarks.indexOf(lessonId);
    if (idx === -1) state.bookmarks.push(lessonId);
    else state.bookmarks.splice(idx, 1);
    persist();
    return idx === -1;
  }

  /* ---------------------------------------------------------------- */
  /* Quiz                                                              */
  /* ---------------------------------------------------------------- */
  function recordQuizAttempt(attempt) {
    getState();
    state.quiz.attempts.push(attempt);
    var moduleId = attempt.moduleId;
    var best = state.quiz.bestByModule[moduleId] || 0;
    if (attempt.percentage > best) state.quiz.bestByModule[moduleId] = attempt.percentage;
    state.quiz.lastByModule[moduleId] = attempt.percentage;

    /* update weak topic tracking: topic -> {correct, total} */
    Object.keys(attempt.topicBreakdown || {}).forEach(function (topic) {
      var t = state.quiz.weakTopics[topic] || { correct: 0, total: 0 };
      t.correct += attempt.topicBreakdown[topic].correct;
      t.total += attempt.topicBreakdown[topic].total;
      state.quiz.weakTopics[topic] = t;
    });

    persist();
  }

  /* ---------------------------------------------------------------- */
  /* Exam                                                              */
  /* ---------------------------------------------------------------- */
  function recordExamAttempt(attempt) {
    getState();
    state.exam.attempts.push(attempt);
    if (attempt.score > state.exam.bestScore) state.exam.bestScore = attempt.score;
    if (attempt.percentage > state.exam.bestPercentage) state.exam.bestPercentage = attempt.percentage;
    persist();
  }

  /* ---------------------------------------------------------------- */
  /* Flashcards                                                        */
  /* ---------------------------------------------------------------- */
  function setFlashcardStatus(cardId, status) {
    getState();
    var entry = state.flashcards[cardId] || { seen: false, known: false };
    entry.seen = true;
    entry.known = status === 'known';
    state.flashcards[cardId] = entry;
    persist();
  }

  /* ---------------------------------------------------------------- */
  /* Lab                                                                */
  /* ---------------------------------------------------------------- */
  function setLabStep(problemId, stepKey, allStepKeys, value) {
    getState();
    var entry = state.lab[problemId] || { steps: {}, completed: false };
    entry.steps[stepKey] = value !== false;
    entry.completed = allStepKeys.every(function (k) { return !!entry.steps[k]; });
    state.lab[problemId] = entry;
    persist();
    return entry.completed;
  }

  /* ---------------------------------------------------------------- */
  /* Streak                                                             */
  /* ---------------------------------------------------------------- */
  function touchStreak() {
    getState();
    var today = todayStr();
    var last = state.streak.lastActiveDate;
    if (!last) {
      state.streak.current = 1;
    } else {
      var diff = daysBetween(last, today);
      if (diff === 0) {
        /* already counted today */
      } else if (diff === 1) {
        state.streak.current += 1;
      } else if (diff > 1) {
        state.streak.current = 1;
      }
    }
    state.streak.longest = Math.max(state.streak.longest, state.streak.current);
    state.streak.lastActiveDate = today;
    persist();
  }

  /* ---------------------------------------------------------------- */
  /* Achievements                                                       */
  /* ---------------------------------------------------------------- */
  function unlockAchievement(id) {
    getState();
    if (state.achievements.unlocked.indexOf(id) !== -1) return false;
    state.achievements.unlocked.push(id);
    state.achievements.unlockedAt[id] = new Date().toISOString();
    persist();
    return true;
  }

  /* ---------------------------------------------------------------- */
  /* Settings                                                           */
  /* ---------------------------------------------------------------- */
  function updateSettings(settings) {
    getState().settings = Object.assign({}, state.settings, settings);
    persist();
  }

  /* ---------------------------------------------------------------- */
  /* Study time                                                         */
  /* ---------------------------------------------------------------- */
  function addStudyTime(seconds) {
    getState();
    state.meta.studyTimeSeconds += seconds;
    state.meta.lastVisit = new Date().toISOString();
    persist();
  }

  /* ---------------------------------------------------------------- */
  /* Reset / Export                                                     */
  /* ---------------------------------------------------------------- */
  function resetAll() {
    state = defaultState();
    persist();
  }

  function exportRecord() {
    getState();
    return JSON.stringify(state, null, 2);
  }

  App.Storage = {
    load: load,
    getState: getState,
    updateProfile: updateProfile,
    markLessonOpened: markLessonOpened,
    markLessonCompleted: markLessonCompleted,
    isLessonCompleted: isLessonCompleted,
    toggleBookmark: toggleBookmark,
    recordQuizAttempt: recordQuizAttempt,
    recordExamAttempt: recordExamAttempt,
    setFlashcardStatus: setFlashcardStatus,
    setLabStep: setLabStep,
    touchStreak: touchStreak,
    unlockAchievement: unlockAchievement,
    updateSettings: updateSettings,
    addStudyTime: addStudyTime,
    resetAll: resetAll,
    exportRecord: exportRecord
  };

})(window.App = window.App || {});
