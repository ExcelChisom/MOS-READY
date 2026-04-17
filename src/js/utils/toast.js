/**
 * MOS-READY — Toast Notification System
 */
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
  },

  show(message, type = 'default', duration = 3500) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__icon">${this._icon(type)}</span>
      <span class="toast__text">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  xp(amount, reason) {
    this.show(`+${amount} XP${reason ? ' — ' + reason : ''}`, 'xp', 3000);
  },

  success(message) {
    this.show(message, 'success', 4000);
  },

  error(message) {
    this.show(message, 'error', 5000);
  },

  info(message) {
    this.show(message, 'default', 3500);
  },

  _icon(type) {
    switch (type) {
      case 'xp': return '⚡';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  }
};

window.Toast = Toast;
