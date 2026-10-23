/**
 * BAKESHIFT Scrollytelling Engine
 * Coordinates scroll position with cinematic visual presentation
 */

export class BakeShiftStoryController {
  constructor(storyContainer) {
    this.container = typeof storyContainer === 'string' ? document.querySelector(storyContainer) : storyContainer;
    if (!this.container) return;

    this.cards = Array.from(this.container.querySelectorAll('.story-card'));
    this.slides = Array.from(this.container.querySelectorAll('.story-visual-slide'));
    this.navIndicators = Array.from(this.container.querySelectorAll('.stage-indicator-btn'));
    this.activeStoryId = 'story-1';

    this.init();
  }

  init() {
    this.setupObserver();
    this.setupControls();
  }

  setupObserver() {
    const options = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const storyId = entry.target.getAttribute('data-story-id');
          this.activateStory(storyId);
        }
      });
    }, options);

    this.cards.forEach(card => this.observer.observe(card));
  }

  setupControls() {
    this.navIndicators.forEach(btn => {
      btn.addEventListener('click', () => {
        const storyId = btn.getAttribute('data-story');
        const targetCard = this.container.querySelector(`.story-card[data-story-id="${storyId}"]`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  activateStory(storyId) {
    if (this.activeStoryId === storyId) return;
    this.activeStoryId = storyId;

    this.cards.forEach(c => c.classList.toggle('active', c.getAttribute('data-story-id') === storyId));
    this.slides.forEach(s => s.classList.toggle('active', s.getAttribute('data-story') === storyId));
    this.navIndicators.forEach(b => b.classList.toggle('active', b.getAttribute('data-story') === storyId));
  }

  destroy() {
    if (this.observer) {
      try { this.observer.disconnect(); } catch (e) {}
      this.observer = null;
    }
  }
}
