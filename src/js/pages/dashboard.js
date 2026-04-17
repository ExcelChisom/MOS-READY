/**
 * MOS-READY — Dashboard Page
 */
const DashboardPage = {
  init() {
    this.renderActivity();
    Router.onPageEnter('dashboard', () => this.refresh());
  },

  refresh() {
    XP.updateUI();
    this.renderActivity();
  },

  renderActivity() {
    const container = document.getElementById('recent-activity');
    if (!container) return;

    const activities = Storage.getActivity();

    if (activities.length === 0) {
      container.innerHTML = `
        <div class="activity-item" style="opacity:0.5">
          <div class="activity-item__icon" style="background:var(--bg-glass)">📭</div>
          <div class="activity-item__text">No activity yet. Start learning!</div>
        </div>
      `;
      return;
    }

    container.innerHTML = activities.slice(0, 8).map(a => {
      const timeAgo = this._timeAgo(a.time);
      const icon = a.type === 'xp' ? '⚡' :
                   a.type === 'quiz' ? '✅' :
                   a.type === 'game' ? '🎮' :
                   a.type === 'learn' ? '📚' : '📝';
      const bgColor = a.type === 'xp' ? 'rgba(254,228,64,0.12)' :
                       a.type === 'quiz' ? 'rgba(0,245,212,0.12)' :
                       'var(--bg-glass)';

      return `
        <div class="activity-item">
          <div class="activity-item__icon" style="background:${bgColor}">${icon}</div>
          <div class="activity-item__text">${a.text}</div>
          <div class="activity-item__time">${timeAgo}</div>
        </div>
      `;
    }).join('');
  },

  _timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
};

window.DashboardPage = DashboardPage;
