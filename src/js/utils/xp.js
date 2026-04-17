/**
 * MOS-READY — XP & Leveling System
 */
const XP = {
  // XP required per level (exponential growth)
  xpForLevel(level) {
    return Math.floor(100 * Math.pow(1.3, level - 1));
  },

  getLevelName(level) {
    const names = [
      'Rookie', 'Beginner', 'Learner', 'Student',
      'Intermediate', 'Skilled', 'Proficient', 'Advanced',
      'Expert', 'Master', 'MOS Champion', 'Legend'
    ];
    return names[Math.min(level - 1, names.length - 1)];
  },

  getLevelInfo() {
    const xp = Storage.getXP();
    const level = Storage.getLevel();
    const xpForCurrent = this.xpForLevel(level);
    let xpInLevel = xp;

    // Calculate XP spent on previous levels
    let totalXPForPreviousLevels = 0;
    for (let i = 1; i < level; i++) {
      totalXPForPreviousLevels += this.xpForLevel(i);
    }

    xpInLevel = xp - totalXPForPreviousLevels;

    return {
      level,
      levelName: this.getLevelName(level),
      xp,
      xpInLevel: Math.max(0, xpInLevel),
      xpForLevel: xpForCurrent,
      progress: Math.min(1, Math.max(0, xpInLevel / xpForCurrent))
    };
  },

  /**
   * Award XP and handle leveling up
   * @returns {{ xpGained, newXP, leveledUp, newLevel }}
   */
  award(amount, reason = '') {
    const oldLevel = Storage.getLevel();
    let xp = Storage.getXP() + amount;
    Storage.setXP(xp);

    // Check for level up
    let level = oldLevel;
    let totalXPForLevel = 0;
    for (let i = 1; i <= level; i++) {
      totalXPForLevel += this.xpForLevel(i);
    }

    while (xp >= totalXPForLevel) {
      level++;
      totalXPForLevel += this.xpForLevel(level);
    }

    const leveledUp = level > oldLevel;
    if (leveledUp) {
      Storage.setLevel(level);
    }

    // Update streak
    this.updateStreak();

    // Log activity
    if (reason) {
      Storage.addActivity({
        type: 'xp',
        text: `+${amount} XP — ${reason}`,
        xp: amount
      });
    }

    // Show toast
    Toast.xp(amount, reason);

    if (leveledUp) {
      setTimeout(() => {
        Toast.success(`🎉 Level Up! You're now Level ${level} — ${this.getLevelName(level)}`);
        Confetti.burst();
      }, 800);
    }

    // Update UI
    this.updateUI();

    return { xpGained: amount, newXP: xp, leveledUp, newLevel: level };
  },

  updateStreak() {
    const today = new Date().toDateString();
    const lastActive = Storage.getLastActive();

    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastActive === yesterday) {
        Storage.setStreak(Storage.getStreak() + 1);
      } else if (lastActive !== null) {
        Storage.setStreak(1);
      } else {
        Storage.setStreak(1);
      }
      Storage.setLastActive(today);
    }
  },

  updateUI() {
    const info = this.getLevelInfo();

    // Topbar XP
    const xpValue = document.getElementById('xp-value');
    if (xpValue) xpValue.textContent = `${info.xp} XP`;

    // Topbar streak
    const streakValue = document.getElementById('streak-value');
    if (streakValue) streakValue.textContent = Storage.getStreak();

    // Dashboard stats
    const dashXP = document.getElementById('dash-xp');
    if (dashXP) dashXP.textContent = info.xp;

    const dashStreak = document.getElementById('dash-streak');
    if (dashStreak) dashStreak.textContent = Storage.getStreak();

    const dashQuizzes = document.getElementById('dash-quizzes');
    if (dashQuizzes) dashQuizzes.textContent = Storage.getQuizzesCompleted();

    const dashLevel = document.getElementById('dash-level');
    if (dashLevel) dashLevel.textContent = info.level;

    // Level label / progress
    const levelLabel = document.getElementById('level-label');
    if (levelLabel) levelLabel.textContent = `Level ${info.level} — ${info.levelName}`;

    const xpToNext = document.getElementById('xp-to-next');
    if (xpToNext) xpToNext.textContent = `${info.xpInLevel} / ${info.xpForLevel} XP`;

    const xpProgressFill = document.getElementById('xp-progress-fill');
    if (xpProgressFill) xpProgressFill.style.width = `${info.progress * 100}%`;

    // User level in sidebar
    const userLevel = document.getElementById('user-level');
    if (userLevel) userLevel.textContent = `Level ${info.level} ${info.levelName}`;
  }
};

window.XP = XP;
