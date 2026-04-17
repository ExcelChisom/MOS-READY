/**
 * MOS-READY — Learn Page (Step-by-Step Modules)
 */
const LearnPage = {
  init() {
    this.renderModules();
    Router.onPageEnter('learn', () => this.renderModules());
  },

  renderModules() {
    const grid = document.getElementById('module-grid');
    const lessonView = document.getElementById('lesson-view');
    if (!grid) return;

    // Show the grid, hide lesson view
    grid.style.display = '';
    if (lessonView) lessonView.style.display = 'none';
    document.querySelector('#page-learn .page__header').style.display = '';

    const progress = Storage.getModuleProgress();

    grid.innerHTML = LEARNING_MODULES.map(mod => {
      const modProgress = progress[mod.id] || { completedSteps: [] };
      const percent = Math.round((modProgress.completedSteps.length / mod.steps.length) * 100);

      return `
        <div class="module-card" data-module="${mod.id}" onclick="LearnPage.openModule('${mod.id}')">
          <div class="module-card__banner" style="background:${mod.gradient}">
            ${mod.emoji}
          </div>
          <div class="module-card__body">
            <div class="module-card__title">${mod.title}</div>
            <div class="module-card__desc">${mod.description}</div>
            <div class="progress-bar" style="margin-bottom:var(--space-sm)">
              <div class="progress-bar__fill" style="width:${percent}%"></div>
            </div>
            <div class="module-card__footer">
              <span class="module-card__steps">${mod.steps.length} steps</span>
              <span class="badge badge-primary">${percent}%</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  openModule(moduleId) {
    const mod = LEARNING_MODULES.find(m => m.id === moduleId);
    if (!mod) return;

    const grid = document.getElementById('module-grid');
    const lessonView = document.getElementById('lesson-view');
    const header = document.querySelector('#page-learn .page__header');

    grid.style.display = 'none';
    header.style.display = 'none';
    lessonView.style.display = 'block';

    const progress = Storage.getModuleProgress();
    const modProgress = progress[moduleId] || { completedSteps: [] };

    lessonView.innerHTML = `
      <div class="lesson-view animate-fade-in">
        <div class="lesson-header">
          <div class="lesson-breadcrumb" onclick="LearnPage.renderModules()">
            ← Back to Modules
          </div>
          <h2 class="heading-2">${mod.emoji} ${mod.title}</h2>
          <p class="text-secondary mt-sm">${mod.description}</p>
          <div style="display:flex;align-items:center;gap:var(--space-md);margin-top:var(--space-md)">
            <div class="progress-bar" style="flex:1">
              <div class="progress-bar__fill progress-bar--accent" id="lesson-progress-fill"
                   style="width:${(modProgress.completedSteps.length / mod.steps.length) * 100}%"></div>
            </div>
            <span class="badge badge-success">${modProgress.completedSteps.length}/${mod.steps.length}</span>
          </div>
        </div>

        <div class="lesson-steps stagger-children">
          ${mod.steps.map((step, i) => {
            const completed = modProgress.completedSteps.includes(i);
            return `
              <div class="lesson-step ${completed ? 'completed' : ''}" id="step-${i}">
                <div class="lesson-step__number" style="${completed ? 'background:var(--gradient-accent)' : ''}">${completed ? '✓' : i + 1}</div>
                <div class="lesson-step__title">${step.title}</div>
                <div class="lesson-step__content">${step.content}</div>
                ${step.tip ? `<div class="lesson-step__tip">💡 ${step.tip}</div>` : ''}
                <div style="margin-top:var(--space-md)">
                  ${completed
                    ? '<span class="badge badge-success">✅ Completed</span>'
                    : `<button class="btn btn-primary btn-sm" onclick="LearnPage.completeStep('${moduleId}', ${i})">
                        Mark as Complete ✓
                      </button>`
                  }
                </div>
              </div>
            `;
          }).join('')}
        </div>

        ${modProgress.completedSteps.length === mod.steps.length ? `
          <div class="text-center mt-xl animate-scale-in">
            <div style="font-size:64px;margin-bottom:var(--space-md)">🎉</div>
            <h3 class="heading-3 mb-sm">Module Complete!</h3>
            <p class="text-secondary mb-lg">You've earned ${mod.xpReward} XP for this module</p>
            <button class="btn btn-primary" onclick="Router.navigate('quizzes')">Take the Quiz →</button>
          </div>
        ` : ''}
      </div>
    `;
  },

  completeStep(moduleId, stepIndex) {
    const progress = Storage.getModuleProgress();
    if (!progress[moduleId]) {
      progress[moduleId] = { completedSteps: [] };
    }

    if (!progress[moduleId].completedSteps.includes(stepIndex)) {
      progress[moduleId].completedSteps.push(stepIndex);
      Storage.setModuleProgress(progress);

      // Award XP for step
      XP.award(10, 'Completed learning step');
      Storage.addActivity({
        type: 'learn',
        text: `Completed a step in ${LEARNING_MODULES.find(m => m.id === moduleId)?.title || moduleId}`
      });

      // Check if module complete
      const mod = LEARNING_MODULES.find(m => m.id === moduleId);
      if (mod && progress[moduleId].completedSteps.length === mod.steps.length) {
        XP.award(mod.xpReward, `Completed ${mod.title}`);
        Confetti.burst();
      }
    }

    this.openModule(moduleId);
  }
};

window.LearnPage = LearnPage;
