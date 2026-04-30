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
    this._checkDailyTournament();
  },

  _checkDailyTournament() {
    const now = new Date();
    // Only active between 12:00:00 and 12:59:59 PM local time
    if (now.getHours() === 12) {
      // Deterministic target score > 5000 based on the current day
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      let hash = 0;
      for (let i = 0; i < dateStr.length; i++) hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
      const targetScore = 5000 + (Math.abs(hash) % 2500); // e.g. 5000 - 7499 XP

      const currentXP = Storage.get('xp', 0);
      
      let container = document.getElementById('tournament-banner');
      if (!container) {
         container = document.createElement('div');
         container.id = 'tournament-banner';
         container.style.cssText = 'background: linear-gradient(90deg, #f72585, #7c5cfc); color: white; padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-lg); text-align: center; font-weight: bold; border: 2px solid #fff; box-shadow: 0 4px 15px rgba(247,37,133,0.4);';
         
         const dashWelcome = document.querySelector('.dashboard-welcome');
         if(dashWelcome) dashWelcome.parentNode.insertBefore(container, dashWelcome.nextSibling);
      }

      if (currentXP >= targetScore) {
         // Has won the 12-hour pass
         const wincode = window.DeviceAuth ? window.DeviceAuth.generateCode(window.DeviceAuth.getDeviceId()) : 'WINNER';
         container.innerHTML = `
           <div style="font-size:32px">🏆 TOURNAMENT WON! 🏆</div>
           <p style="margin-top:8px">You beat the global high score of ${targetScore} XP today!</p>
           <div style="background:#000;padding:10px;margin-top:10px;letter-spacing:3px;font-family:monospace;font-size:24px">CODE: WIN-${wincode}</div>
           <p style="font-size:12px;margin-top:8px">Send this code to the Admin on Telegram for a free 12-hour unlock pass!</p>
         `;
      } else {
         const diff = targetScore - currentXP;
         container.innerHTML = `
           <div style="font-size:20px;display:flex;align-items:center;justify-content:center;gap:10px">⚠️ <span>LIVE TOURNAMENT ACTIVE (12PM - 1PM)</span> ⚠️</div>
           <p style="margin-top:8px;font-size:14px">Current Daily Leader is at <span style="background:rgba(0,0,0,0.3);padding:2px 8px;border-radius:4px">${targetScore} XP</span>.</p>
           <p style="font-size:13px;margin-top:4px">Earn <span style="color:#00f5d4">${diff} more XP</span> before 1:00 PM to steal the lead and win a 12-Hour Free Pass!</p>
           <button class="btn btn-primary" style="margin-top:12px;background:#fff;color:#f72585;border:none" onclick="Router.navigate('games')">Play Games for XP</button>
         `;
      }
    } else {
      const existing = document.getElementById('tournament-banner');
      if (existing) existing.remove();
    }
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
