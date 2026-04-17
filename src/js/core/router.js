/**
 * MOS-READY — Client-Side Router
 */
const Router = {
  currentPage: 'dashboard',

  init() {
    // Nav tab clicks
    document.querySelectorAll('.nav-tab[data-page]').forEach(tab => {
      tab.addEventListener('click', () => {
        this.navigate(tab.dataset.page);
      });
    });

    // Quick action cards
    document.querySelectorAll('.quick-action-card[data-action]').forEach(card => {
      card.addEventListener('click', () => {
        const actionMap = {
          'learn': 'learn',
          'quiz': 'quizzes',
          'game': 'games',
          'mock': 'mock-exam'
        };
        const page = actionMap[card.dataset.action];
        if (page) this.navigate(page);
      });
    });

    // Hamburger menu
    const hamburger = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    // Hash-based routing
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.slice(1) || 'dashboard';
      this.navigate(page, false);
    });

    // Initial route
    const initialPage = window.location.hash.slice(1) || 'dashboard';
    this.navigate(initialPage, false);
  },

  navigate(page, updateHash = true) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById(`page-${page}`);
    if (!target) return;
    target.classList.add('active');

    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    const activeTab = document.querySelector(`.nav-tab[data-page="${page}"]`);
    if (activeTab) activeTab.classList.add('active');

    // Update page title
    const pageTitle = document.getElementById('page-title');
    const pageTitles = {
      'dashboard': 'Dashboard',
      'learn': 'Learn',
      'quizzes': 'Quizzes',
      'games': 'Games',
      'mock-exam': 'Mock Quiz',
      'practice-exam': 'Practice Exam',
      'resources': 'My Resources',
      'word-lab': 'Word Lab'
    };
    if (pageTitle) pageTitle.textContent = pageTitles[page] || page;

    // Update hash
    if (updateHash) {
      window.location.hash = page;
    }

    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('active');

    // Fire page-enter callbacks
    this.currentPage = page;
    if (this._callbacks[page]) {
      this._callbacks[page]();
    }
  },

  _callbacks: {},

  onPageEnter(page, callback) {
    this._callbacks[page] = callback;
  }
};

window.Router = Router;
