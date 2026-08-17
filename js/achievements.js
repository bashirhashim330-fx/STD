/* ==========================================================================
   achievements.js
   Evaluates achievement unlock conditions against the current stored state.
   Call App.Achievements.checkAll() after any action that could unlock one
   (completing a lesson, submitting a quiz/exam, reviewing flashcards, etc).
   ========================================================================== */

(function (App) {
  'use strict';

  function totalLessonCount() {
    return App.Data.getAllLessons().length;
  }

  function completedLessonCount(state) {
    return Object.keys(state.lessonProgress).filter(function (id) {
      return state.lessonProgress[id] && state.lessonProgress[id].completed;
    }).length;
  }

  function knownFlashcardCount(state) {
    return Object.keys(state.flashcards).filter(function (id) {
      return state.flashcards[id] && state.flashcards[id].known;
    }).length;
  }

  function completedLabCount(state) {
    return Object.keys(state.lab).filter(function (id) {
      return state.lab[id] && state.lab[id].completed;
    }).length;
  }

  var CONDITIONS = {
    first_lesson: function (state) { return completedLessonCount(state) >= 1; },
    first_quiz: function (state) { return state.quiz.attempts.length >= 1; },
    problem_solver: function (state) { return completedLabCount(state) >= 1; },
    perfect_score: function (state) {
      var quizPerfect = state.quiz.attempts.some(function (a) { return a.percentage === 100; });
      var examPerfect = state.exam.attempts.some(function (a) { return a.percentage === 100; });
      return quizPerfect || examPerfect;
    },
    topic_master: function (state) {
      return Object.keys(state.quiz.bestByModule).some(function (m) { return state.quiz.bestByModule[m] >= 90; });
    },
    exam_ready: function (state) { return state.exam.attempts.length >= 1; },
    study_streak: function (state) { return state.streak.current >= 3; },
    card_work: function (state) { return knownFlashcardCount(state) >= 15; },
    halfway: function (state) {
      var total = totalLessonCount();
      if (total === 0) return false;
      return (completedLessonCount(state) / total) >= 0.5;
    }
  };

  /* Checks every achievement, unlocks any newly-earned ones, shows a toast
     for each, and returns the list of achievement objects newly unlocked. */
  function checkAll() {
    var state = App.Storage.getState();
    var newlyUnlocked = [];
    App.Data.ACHIEVEMENTS.forEach(function (def) {
      if (state.achievements.unlocked.indexOf(def.id) !== -1) return;
      var conditionFn = CONDITIONS[def.id];
      if (conditionFn && conditionFn(state)) {
        var didUnlock = App.Storage.unlockAchievement(def.id);
        if (didUnlock) {
          newlyUnlocked.push(def);
          App.UI.toast('Achievement unlocked: ' + def.title, 'success', { duration: 5200 });
        }
      }
    });
    return newlyUnlocked;
  }

  function progressFor(id, state) {
    state = state || App.Storage.getState();
    switch (id) {
      case 'card_work':
        return { current: Math.min(15, knownFlashcardCount(state)), target: 15 };
      case 'study_streak':
        return { current: Math.min(3, state.streak.current), target: 3 };
      case 'halfway':
        return { current: completedLessonCount(state), target: Math.ceil(totalLessonCount() / 2) };
      default:
        return null;
    }
  }

  App.Achievements = {
    checkAll: checkAll,
    progressFor: progressFor,
    completedLessonCount: completedLessonCount,
    knownFlashcardCount: knownFlashcardCount,
    completedLabCount: completedLabCount,
    totalLessonCount: totalLessonCount
  };

})(window.App = window.App || {});
