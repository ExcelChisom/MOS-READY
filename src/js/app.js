/**
 * MOS-READY — Main App Initialization
 */
(function () {
  'use strict';

  function init() {
    // Initialize all systems
    Toast.init();
    Confetti.init();
    XP.updateStreak();
    XP.updateUI();

    // Initialize pages
    DashboardPage.init();
    LearnPage.init();
    QuizzesPage.init();
    GamesPage.init();
    MockExamPage.init();
    PracticeExamPage.init();
    ResourcesPage.init();
    WordLabPage.init();

    // Initialize router (last, so page callbacks are registered)
    Router.init();

    console.log('🎯 MOS-READY initialized');
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
