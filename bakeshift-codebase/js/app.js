/**
 * BAKESHIFT Main Application Controller (ES Module Version)
 * Full Apple-inspired interactive consumer product experience
 * Brand Slogan: BAKE MORE WITH LESS.
 * Retail Price: $49.99 USD
 */

import { BakeShift3DViewer } from './bakeshift3d.js';
import { cart, BAKESHIFT_PRODUCT } from './cart.js';
import { BRAND, CONFIGURATIONS, SCROLL_STORIES, TECHNICAL_SPECS, FAQS, COMPANY_STORY } from './data.js';
import { BakeShiftStoryController } from './story.js';

export class BakeShiftApp {
  constructor() {
    this.currentRoute = 'home';
    this.heroViewer = null;
    this.exploreViewer = null;
    this.storyViewer = null;
    this.shopViewer = null;
    this.selectedShopQty = 1;

    this.init();
  }

  cleanRoute(route) {
    if (!route) return 'home';
    const clean = route.replace(/^#\/?/, '').replace(/\/$/, '').split('?')[0].trim().toLowerCase();
    return clean || 'home';
  }

  init() {
    this.setupNavigation();
    this.setupCartListeners();
    this.setupRouting();
    this.setupStickyBar();

    // Global click listener for modals and accordions
    document.addEventListener('click', this.handleGlobalClick.bind(this));
  }

  // ==========================================
  // ROUTING & NAVIGATION
  // ==========================================
  setupRouting() {
    window.addEventListener('hashchange', () => {
      const route = this.cleanRoute(window.location.hash);
      this.navigateTo(route, false);
    });

    const initialRoute = this.cleanRoute(window.location.hash);
    this.navigateTo(initialRoute, false);
  }

  navigateTo(route, updateHistory = true) {
    route = this.cleanRoute(route);
    this.currentRoute = route;

    if (updateHistory && this.cleanRoute(window.location.hash) !== route) {
      window.location.hash = `#${route}`;
    }

    // Scroll to top on page switch (except section anchor jumps)
    if (route !== 'story-section') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Update nav active states
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = this.cleanRoute(link.getAttribute('href'));
      if (href === route || ((route === 'home' || route === 'overview') && href === 'home')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update subnav active states
    document.querySelectorAll('.subnav-link').forEach(link => {
      const href = this.cleanRoute(link.getAttribute('href'));
      if (
        href === route ||
        ((route === 'home' || route === 'overview') && (href === 'overview' || href === 'home')) ||
        (route === 'specs' && href === 'specs')
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    this.renderCurrentPage();
  }

  setupNavigation() {
    // Mobile navigation toggle
    const mobileToggle = document.getElementById('mobileNavToggle');
    const mobileMenu = document.getElementById('mobileMenuOverlay');

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
      });

      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
        });
      });
    }

    // Cart trigger buttons
    document.querySelectorAll('.cart-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        cart.openDrawer();
      });
    });

    // Close bag drawer
    const closeDrawerBtn = document.getElementById('closeBagDrawer');
    const backdrop = document.getElementById('bagBackdrop');
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => cart.closeDrawer());
    if (backdrop) backdrop.addEventListener('click', () => cart.closeDrawer());
  }

  setupStickyBar() {
    const bar = document.getElementById('stickyPurchaseBar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      if (this.currentRoute === 'shop' || this.currentRoute === 'checkout-preview' || this.currentRoute === 'bag') {
        bar.classList.remove('visible');
        return;
      }
      if (window.scrollY > 550) {
        bar.classList.add('visible');
      } else {
        bar.classList.remove('visible');
      }
    });
  }

  // ==========================================
  // SHOPPING CART SYNC
  // ==========================================
  setupCartListeners() {
    cart.subscribe((state) => {
      this.updateCartBadges(state.totalCount);
      this.renderBagDrawer(state);

      if (this.currentRoute === 'bag') {
        this.renderBagPage(document.getElementById('mainContent'));
      } else if (this.currentRoute === 'checkout-preview') {
        this.renderCheckoutPreview(document.getElementById('mainContent'));
      }

      // Drawer visibility
      const drawer = document.getElementById('bagDrawer');
      const backdrop = document.getElementById('bagBackdrop');
      if (drawer && backdrop) {
        if (state.drawerOpen) {
          drawer.classList.add('open');
          backdrop.classList.add('open');
        } else {
          drawer.classList.remove('open');
          backdrop.classList.remove('open');
        }
      }
    });

    const initialState = cart.getState();
    this.updateCartBadges(initialState.totalCount);
    this.renderBagDrawer(initialState);
  }

  updateCartBadges(count) {
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.add('has-items');
      } else {
        badge.classList.remove('has-items');
      }
    });
  }

  renderBagDrawer(state) {
    const list = document.getElementById('bagDrawerItems');
    const subtotalEl = document.getElementById('bagDrawerSubtotal');
    if (!list || !subtotalEl) return;

    subtotalEl.textContent = state.subtotalFormatted;

    if (state.items.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-muted-text);">
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--color-charcoal); font-weight: 600;">Your Bag is empty.</p>
          <p style="font-size: 0.9rem; margin-bottom: 1.5rem;">Explore the BAKESHIFT modular system and bake more with less.</p>
          <a href="#shop" class="btn btn-copper btn-sm" onclick="window.bakeshiftApp.closeDrawer()">Shop BAKESHIFT — $49.99</a>
        </div>
      `;
      return;
    }

    list.innerHTML = state.items.map(item => `
      <div class="bag-item-card">
        <div class="bag-item-thumb" style="width: 72px; height: 72px; background: var(--color-white); border-radius: var(--radius-sm); border: 1px solid var(--color-border); padding: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <img src="assets/images/bakeshift-assembled-hero.jpg" alt="BAKESHIFT Pan" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h4 style="font-size: 0.95rem; font-weight: 600;">${item.name}</h4>
            <span style="font-size: 0.95rem; font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          <p style="font-size: 0.78rem; color: var(--color-muted-text); margin: 0.2rem 0 0.8rem;">$${item.price.toFixed(2)} each</p>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="quantity-stepper">
              <button class="qty-btn" onclick="window.bakeshiftApp.decrementItem('${item.id}')">-</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn" onclick="window.bakeshiftApp.incrementItem('${item.id}')">+</button>
            </div>
            <button style="background: none; border: none; font-size: 0.8rem; color: #d9383a; cursor: pointer;" onclick="window.bakeshiftApp.removeItem('${item.id}')">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  incrementItem(id) { cart.incrementQuantity(id); }
  decrementItem(id) { cart.decrementQuantity(id); }
  removeItem(id) { cart.removeItem(id); }
  closeDrawer() { cart.closeDrawer(); }

  switchCheckoutMode(mode) {
    this.checkoutMode = mode;
    this.stripeSuccessState = null;
    const mainEl = document.getElementById('mainContent');
    if (mainEl && this.currentRoute === 'checkout-preview') {
      this.renderCheckoutPreview(mainEl);
    }
  }

  fillTestCard(type) {
    const cardInput = document.getElementById('stripeCardNumber');
    const expInput = document.getElementById('stripeCardExp');
    const cvcInput = document.getElementById('stripeCardCvc');
    const zipInput = document.getElementById('stripeCardZip');
    const nameInput = document.getElementById('stripeCardName');
    if (!cardInput) return;

    if (nameInput && !nameInput.value) nameInput.value = 'Alex Baker';
    if (zipInput) zipInput.value = '90210';

    if (type === 'success') {
      cardInput.value = '4242 4242 4242 4242';
      if (expInput) expInput.value = '12 / 34';
      if (cvcInput) cvcInput.value = '123';
    } else if (type === 'decline') {
      cardInput.value = '4000 0000 0000 0002';
      if (expInput) expInput.value = '12 / 34';
      if (cvcInput) cvcInput.value = '123';
    } else if (type === 'expired') {
      cardInput.value = '4000 0000 0000 0069';
      if (expInput) expInput.value = '01 / 20';
      if (cvcInput) cvcInput.value = '123';
    } else if (type === 'cvc') {
      cardInput.value = '4000 0000 0000 0127';
      if (expInput) expInput.value = '12 / 34';
      if (cvcInput) cvcInput.value = '999';
    }
    const errBox = document.getElementById('stripeErrorBox');
    if (errBox) errBox.style.display = 'none';
  }

  submitStripeTestPayment() {
    const cardInput = document.getElementById('stripeCardNumber');
    const payBtn = document.getElementById('stripePayBtn');
    const errBox = document.getElementById('stripeErrorBox');
    const cardNum = cardInput ? cardInput.value.replace(/\s+/g, '') : '';

    if (!cardNum || cardNum.length < 13) {
      if (errBox) {
        errBox.textContent = 'Please enter a valid Stripe test card number (e.g. 4242 4242 4242 4242).';
        errBox.style.display = 'flex';
      }
      return;
    }

    const state = cart.getState();
    const totalUnits = state.items.length > 0 ? state.totalCount : 1;
    const totalFormatted = state.items.length > 0 ? state.totalFormatted : '$66.11';

    if (payBtn) {
      payBtn.disabled = true;
      payBtn.innerHTML = '<span class="stripe-spinner"></span> Authorizing in Stripe Sandbox...';
    }

    const finishPayment = () => {
      if (cardNum.endsWith('0002')) {
        if (errBox) {
          errBox.textContent = 'Your card was declined. (Stripe test code: card_declined)';
          errBox.style.display = 'flex';
        }
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.innerHTML = `⚡ Pay ${totalFormatted} in Stripe Sandbox`;
        }
      } else if (cardNum.endsWith('0069')) {
        if (errBox) {
          errBox.textContent = 'Your card has expired. (Stripe test code: expired_card)';
          errBox.style.display = 'flex';
        }
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.innerHTML = `⚡ Pay ${totalFormatted} in Stripe Sandbox`;
        }
      } else if (cardNum.endsWith('0127')) {
        if (errBox) {
          errBox.textContent = "Your card's security code is incorrect. (Stripe test code: incorrect_cvc)";
          errBox.style.display = 'flex';
        }
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.innerHTML = `⚡ Pay ${totalFormatted} in Stripe Sandbox`;
        }
      } else {
        this.stripeSuccessState = {
          paymentIntent: 'pi_test_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36),
          total: totalFormatted,
          units: totalUnits,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
        const mainEl = document.getElementById('mainContent');
        if (mainEl) this.renderCheckoutPreview(mainEl);
      }
    };

    if (typeof setTimeout !== 'undefined') {
      setTimeout(finishPayment, 350);
    } else {
      finishPayment();
    }
  }

  resetStripeTest() {
    this.stripeSuccessState = null;
    const mainEl = document.getElementById('mainContent');
    if (mainEl) this.renderCheckoutPreview(mainEl);
  }

  quickBuy() {
    cart.addItem(BAKESHIFT_PRODUCT, 1, false);
    this.navigateTo('checkout-preview');
  }

  addCurrentToBag() {
    cart.addItem(BAKESHIFT_PRODUCT, 1, true);
  }

  renderCurrentPage() {
    const mainEl = document.getElementById('mainContent');
    if (!mainEl) return;

    if (this.heroViewer) {
      try { if (typeof this.heroViewer.destroy === 'function') this.heroViewer.destroy(); } catch (e) { console.warn('BakeShift: Error destroying heroViewer', e); }
      this.heroViewer = null;
    }
    if (this.exploreViewer) {
      try { if (typeof this.exploreViewer.destroy === 'function') this.exploreViewer.destroy(); } catch (e) { console.warn('BakeShift: Error destroying exploreViewer', e); }
      this.exploreViewer = null;
    }
    if (this.storyViewer) {
      try { if (typeof this.storyViewer.destroy === 'function') this.storyViewer.destroy(); } catch (e) { console.warn('BakeShift: Error destroying storyViewer', e); }
      this.storyViewer = null;
    }
    if (this.shopViewer) {
      try { if (typeof this.shopViewer.destroy === 'function') this.shopViewer.destroy(); } catch (e) { console.warn('BakeShift: Error destroying shopViewer', e); }
      this.shopViewer = null;
    }

    switch (this.currentRoute) {
      case 'home':
      case 'overview':
        this.renderHomePage(mainEl);
        break;
      case 'design':
        this.renderDesignPage(mainEl);
        break;
      case 'features':
        this.renderFeaturesPage(mainEl);
        break;
      case 'explore':
        this.renderExplorePage(mainEl);
        break;
      case 'how-it-works':
        this.renderHowItWorksPage(mainEl);
        break;
      case 'shop':
        this.renderShopPage(mainEl);
        break;
      case 'specs':
        this.renderSpecsPage(mainEl);
        break;
      case 'story':
      case 'our-story':
        this.renderOurStoryPage(mainEl);
        break;
      case 'bag':
        this.renderBagPage(mainEl);
        break;
      case 'checkout-preview':
        this.renderCheckoutPreview(mainEl);
        break;
      case 'faq':
        this.renderFaqPage(mainEl);
        break;
      case 'contact':
        this.renderContactPage(mainEl);
        break;
      case 'story-section':
        if (!document.getElementById('story-section')) {
          this.renderHomePage(mainEl);
        }
        setTimeout(() => {
          const el = document.getElementById('story-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
        break;
      default:
        this.renderHomePage(mainEl);
    }
  }

  // ==========================================
  // 1. HOME PAGE
  // ==========================================
  renderHomePage(container) {
    container.innerHTML = `
      <!-- HERO SECTION -->
      <section class="hero-section text-center" id="overview">
        <div class="container">
          <div class="hero-header">
            <div style="display: flex; justify-content: center; margin-bottom: 1.25rem;">
              <img src="assets/images/bakeshift-logo.png" alt="BakeShift" style="height: 68px; width: auto; object-fit: contain;">
            </div>
            <span class="eyebrow">The Modular Bakeware Revolution</span>
            <h1 class="headline-hero">BAKE MORE WITH LESS.</h1>
            <p class="headline-slogan" style="font-size: clamp(1.6rem, 3.8vw, 2.8rem); margin-top: 0.5rem; color: var(--color-charcoal);">
              One pan. Endless possibilities.
            </p>
            <p class="subheadline-hero" style="margin-top: 1.0rem;">
              Meet BAKESHIFT — one innovative baking system designed to bring flexibility, convenience, and creativity into your kitchen.
            </p>
            <div class="hero-ctas">
              <a href="#explore" class="btn btn-primary btn-lg">Explore BAKESHIFT</a>
              <button class="btn btn-copper btn-lg" onclick="window.bakeshiftApp.quickBuy()">Buy — $49.99</button>
            </div>
          </div>

          <!-- View Mode Switcher -->
          <div style="display: inline-flex; gap: 0.5rem; background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--color-border); margin-top: 1.5rem;">
            <button class="cam-btn active" id="heroBtn3D" onclick="window.bakeshiftApp.switchHeroView('3d')">3D Interactive</button>
            <button class="cam-btn" id="heroBtnIllustration" onclick="window.bakeshiftApp.switchHeroView('illustration')">Official Hero Plan</button>
            <button class="cam-btn" id="heroBtnMockup" onclick="window.bakeshiftApp.switchHeroView('mockup')">Technical Blueprint</button>
          </div>

          <div class="hero-3d-wrapper" style="position: relative;">
            <div id="hero3dContainer" class="hero-3d-canvas"></div>
            <div id="heroImgIllustration" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; padding: 1.0rem; background: var(--color-white); border-radius: var(--radius-lg); box-shadow: 0 16px 36px var(--color-shadow);">
              <img src="assets/images/bakeshift-official-hero-plan.jpg" alt="Official BAKESHIFT Hero Plan &amp; Engineering Illustration" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: var(--radius-sm);">
            </div>
            <div id="heroImgMockup" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; padding: 1.0rem; background: var(--color-white); border-radius: var(--radius-lg); box-shadow: 0 16px 36px var(--color-shadow);">
              <img src="assets/images/bakeshift-technical-blueprint.jpg" alt="Official BAKESHIFT Technical Blueprint (DWG BS-001)" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: var(--radius-sm);">
            </div>
          </div>

          <!-- Apple-Style Scroll Indicator -->
          <div>
            <a href="#story-section" class="hero-scroll-indicator">
              <div class="scroll-pill-mouse"><div class="scroll-pill-wheel"></div></div>
              <span>Scroll to explore the system</span>
            </a>
          </div>

          <div class="hero-badge-strip">
            <span class="spec-pill">15" × 10" × 2" Aluminized Steel</span>
            <span class="spec-pill">6-Cup Insert (2 × 3 Layout)</span>
            <span class="spec-pill">2 Adjustable Bare-Metal Partitions</span>
            <span class="spec-pill">6 Total Wire Toggle Clasps</span>
            <span class="spec-pill" style="border-color: var(--color-copper); color: var(--color-copper);">Zero Silicone Grips</span>
            <span class="spec-pill">$49.99 Complete System</span>
          </div>
        </div>
      </section>

      <!-- DESIGNED TO ADAPT 3D SECTION -->
      <section class="section section-cream" id="design">
        <div class="container">
          <div class="text-center" style="max-width: 760px; margin: 0 auto 3.5rem;">
            <span class="eyebrow">Interactive 3D Experience</span>
            <h2 class="headline-section">Designed to adapt.</h2>
            <p style="font-size: 1.4rem; color: var(--color-copper); font-weight: 600; margin-top: 0.4rem;">"Your baking. Your rules."</p>
            <p style="color: var(--color-muted-text); margin-top: 0.8rem;">
              Orbit, rotate, explode, and test configurations in real time. Experience the tactile precision of outward wire toggle clasps and commercial-grade aluminized steel.
            </p>
          </div>

          <div class="interactive-3d-card">
            <div class="viewer-canvas-container" id="interactiveCanvasContainer">
              <div class="viewer-overlay-top">
                <div class="viewer-badge-group">
                  <span class="spec-pill" style="background: rgba(255,255,255,0.9);">
                    <span id="activeConfigLabel" style="font-weight: 700; color: var(--color-copper);">Assembled View</span>
                  </span>
                </div>
                <div class="camera-controls-group">
                  <button class="cam-btn active" data-cam="isometric">3/4 Isometric</button>
                  <button class="cam-btn" data-cam="top">Top (Blueprint)</button>
                  <button class="cam-btn" data-cam="front">Front</button>
                  <button class="cam-btn" data-cam="side">Side</button>
                  <button class="cam-btn" data-cam="macro">Macro Detail</button>
                </div>
              </div>
            </div>

            <div class="viewer-toolbar">
              <div class="config-btn-group">
                <button class="config-btn active" data-config="assembled">Assembled</button>
                <button class="config-btn" data-config="exploded">Exploded</button>
                <button class="config-btn" data-config="cupcakes">Cupcakes (2×3)</button>
                <button class="config-btn" data-config="square-cake">Square Cake (9×9)</button>
                <button class="config-btn" data-config="rectangle-cake">Rectangle</button>
                <button class="config-btn" data-config="loaf">Loaf (5×9)</button>
                <button class="config-btn" data-config="empty">Empty Pan</button>
              </div>

              <div class="viewer-tools-group">
                <button class="toggle-btn" id="toggleClaspsBtn">
                  <span>Clasps: Locked</span>
                </button>
                <button class="toggle-btn" id="toggleDimensionsBtn">
                  <span>Dimensions</span>
                </button>
                <button class="toggle-btn" id="toggleAutoRotateBtn">
                  <span>Auto-Rotate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- MODULAR ENGINEERING STORY (SECTION 4 STRICT REQUIREMENTS) -->
      <section class="section" id="story-section">
        <div class="container">
          <div class="text-center" style="max-width: 680px; margin: 0 auto 4.0rem;">
            <span class="eyebrow">Engineering Story</span>
            <h2 class="headline-section">Thoughtful engineering. Simple everyday use.</h2>
            <p style="color: var(--color-muted-text); margin-top: 0.6rem;">
              Scroll down to explore how BAKESHIFT adapts across every baking configuration.
            </p>
          </div>

          <div class="story-scroll-container">
            <div class="story-sticky-stage">
              <div class="story-stage-controls">
                <div class="stage-nav-indicators" style="width: 100%; justify-content: center;">
                  <button class="stage-indicator-btn active" data-story="story-1">01 One Pan</button>
                  <button class="stage-indicator-btn" data-story="story-2">02 Cupcakes</button>
                  <button class="stage-indicator-btn" data-story="story-3">03 Partitions</button>
                  <button class="stage-indicator-btn" data-story="story-4">04 Details</button>
                  <button class="stage-indicator-btn" data-story="story-5">05 Overview</button>
                </div>
              </div>

              <!-- Visual Slides Deck -->
              <div class="story-visual-deck" id="storyVisualDeck">
                <div class="story-visual-slide active" data-story="story-1">
                  <img src="assets/images/cinematic-1-base-pan.jpg" alt="Scene 1: BASE PAN DIMENSIONS (15×10×2 in, 1.25 lb)">
                  <div class="story-slide-badge">Scene 01 • Base Pan Dimensions &amp; Usable Interior</div>
                </div>
                <div class="story-visual-slide" data-story="story-2">
                  <img src="assets/images/cinematic-2-cupcake-tray.jpg" alt="Scene 2: CUPCAKE TRAY (2×3 Grid, 0.85 lb)">
                  <div class="story-slide-badge">Scene 02 • Exactly 6 Wells (2 Columns × 3 Rows)</div>
                </div>
                <div class="story-visual-slide" data-story="story-3">
                  <img src="assets/images/cinematic-3-partitions.jpg" alt="Scene 3: ADJUSTABLE PARTITIONS (8.9 in, 0.35 lb each)">
                  <div class="story-slide-badge">Scene 03 • Dual Partitions &amp; Outward Clasps</div>
                </div>
                <div class="story-visual-slide" data-story="story-4">
                  <img src="assets/images/cinematic-4-clasp-mechanism.jpg" alt="Scene 4: CLASP MECHANISM (LUNCH BOX STYLE)">
                  <div class="story-slide-badge">Scene 04 • Lunch-Box Wire Toggle Tensioners</div>
                </div>
                <div class="story-visual-slide" data-story="story-5">
                  <img src="assets/images/cinematic-5-layouts-overview.png" alt="Scene 5: Layout Configurations Overview">
                  <div class="story-slide-badge">Scene 05 • Layout Configurations (Cupcakes, Square, Rectangle, Loaf)</div>
                </div>
              </div>

            <div class="story-cards-flow">
              ${SCROLL_STORIES.map(story => `
                <div class="story-card" data-story-id="${story.id}">
                  <span class="story-step-number">${story.scene}</span>
                  <h3 style="font-size: 1.8rem; margin: 0.4rem 0;">${story.title}</h3>
                  <p style="font-size: 1.15rem; color: var(--color-copper); font-weight: 600; margin-bottom: 0.8rem;">
                    "${story.subtitle}"
                  </p>
                  <p style="color: var(--color-muted-text); font-size: 0.95rem; line-height: 1.7;">
                    ${story.body}
                  </p>
                  <div class="story-stats-grid">
                    ${story.stats.map(s => `
                      <div>
                        <div class="stat-item-label">${s.label}</div>
                        <div class="stat-item-value">${s.value}</div>
                      </div>
                    `).join('')}
                  </div>
                  ${story.id === 'story-5' ? `
                    <div style="margin-top: 1.75rem;">
                      <a href="#shop" class="btn btn-copper btn-md">Shop BAKESHIFT — $49.99</a>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- CONFIGURATIONS SHOWCASE -->
      <section class="section section-cream" id="features">
        <div class="container">
          <div class="text-center" style="max-width: 760px; margin: 0 auto;">
            <span class="eyebrow">Modular Versatility</span>
            <h2 class="headline-section">One system. Endless possibilities.</h2>
            <p style="color: var(--color-muted-text); margin-top: 0.6rem;">
              Seamlessly configure for cupcakes, brownies, sheet cakes, and artisan loaves.
            </p>
          </div>

          <div class="bento-grid">
            ${CONFIGURATIONS.map(cfg => `
              <div class="bento-card">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <span class="spec-pill" style="color: var(--color-copper); border-color: var(--color-copper);">${cfg.badge}</span>
                    <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-muted-text);">${cfg.dimension}</span>
                  </div>
                  <h3 style="font-size: 1.6rem; margin-bottom: 0.6rem;">${cfg.name}</h3>
                  <p style="color: var(--color-muted-text); font-size: 0.92rem; line-height: 1.6;">${cfg.description}</p>
                </div>

                <div class="bento-visual-preview">
                  <img src="${cfg.image}" alt="${cfg.name}" style="width: 100%; height: 100%; object-fit: contain; padding: 6px;">
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.0rem;">
                  <button class="btn btn-outline btn-sm" onclick="window.bakeshiftApp.loadHomeConfig('${cfg.id}')">
                    Explore in 3D →
                  </button>
                  <button class="btn btn-copper btn-sm" onclick="window.bakeshiftApp.quickBuy()">
                    Buy $49.99
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- CLUTTER COMPARISON SECTION -->
      <section class="section">
        <div class="container text-center">
          <span class="eyebrow">Clutter-Free Kitchen</span>
          <h2 class="headline-section">Reclaim 70% of your cupboard space.</h2>
          <p class="subheadline-hero" style="margin-top: 0.8rem; margin-bottom: 3.5rem;">
            Why store 5 bulky pans when 1 modular system does it all with commercial bakery precision?
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; text-align: left; max-width: 900px; margin: 0 auto;">
            <div style="padding: 2.5rem; background: var(--color-light-gray); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
              <h4 style="font-size: 1.25rem; color: #b93838; margin-bottom: 1.0rem;">Traditional Baking Pans</h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.92rem; color: var(--color-muted-text);">
                <li>✕ 5+ separate pans required for basic bakes</li>
                <li>✕ Takes up 14.5" of vertical cupboard height</li>
                <li>✕ Warps under high oven temperatures</li>
                <li>✕ Toxic non-stick coatings that scratch and peel</li>
                <li>✕ Over $110 total replacement cost</li>
              </ul>
            </div>

            <div style="padding: 2.5rem; background: var(--color-cream-card); border-radius: var(--radius-lg); border: 2px solid var(--color-copper);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.0rem;">
                <h4 style="font-size: 1.25rem; color: var(--color-charcoal);">BAKESHIFT System</h4>
                <span style="font-weight: 700; color: var(--color-copper);">$49.99 Fixed</span>
              </div>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.92rem; color: var(--color-charcoal);">
                <li>✓ 1 modular pan configures to cupcakes, cakes, & loaves</li>
                <li>✓ Ultra-slim 2.0" profile saves 70% cabinet space</li>
                <li>✓ Heavy-gauge aluminized steel with zero warping</li>
                <li>✓ Bare metal metallurgy: 100% PTFE/PFOA/Silicone-free</li>
                <li>✓ Lifetime heirloom durability for just $49.99</li>
              </ul>
            </div>
          </div>

          <div style="margin-top: 3.5rem;">
            <button class="btn btn-copper btn-lg" onclick="window.bakeshiftApp.quickBuy()">Get BAKESHIFT for $49.99</button>
          </div>
        </div>
      </section>
    `;

    const heroEl = document.getElementById('hero3dContainer');
    if (heroEl) {
      this.heroViewer = new BakeShift3DViewer(heroEl, { autoRotate: true, interactive: true, introAnimation: true });
    }

    const interactiveEl = document.getElementById('interactiveCanvasContainer');
    if (interactiveEl) {
      this.exploreViewer = new BakeShift3DViewer(interactiveEl, {
        interactive: true,
        onConfigChange: (cfg) => {
          const lbl = document.getElementById('activeConfigLabel');
          if (lbl) lbl.textContent = cfg.charAt(0).toUpperCase() + cfg.slice(1) + ' Mode';
        }
      });
      this.bindViewerControls(this.exploreViewer);
    }

    const storyContainer = document.getElementById('story-section');
    if (storyContainer) {
      this.storyViewer = new BakeShiftStoryController(storyContainer);
    }
  }

  loadHomeConfig(configId) {
    if (this.exploreViewer) {
      this.exploreViewer.applyConfiguration(configId, true);
      const designSec = document.getElementById('design');
      if (designSec) designSec.scrollIntoView({ behavior: 'smooth' });

      document.querySelectorAll('.config-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-config') === configId);
      });
    }
  }

  bindViewerControls(viewer) {
    document.querySelectorAll('.config-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.config-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        viewer.applyConfiguration(btn.getAttribute('data-config'), true);
      });
    });

    document.querySelectorAll('.cam-btn[data-cam]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cam-btn[data-cam]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        viewer.setCameraPreset(btn.getAttribute('data-cam'));
      });
    });

    const claspBtn = document.getElementById('toggleClaspsBtn');
    if (claspBtn) {
      claspBtn.addEventListener('click', () => {
        const locked = viewer.toggleClasps();
        claspBtn.querySelector('span').textContent = locked ? 'Clasps: Locked' : 'Clasps: Open';
      });
    }

    const dimBtn = document.getElementById('toggleDimensionsBtn');
    if (dimBtn) {
      dimBtn.addEventListener('click', () => {
        const show = viewer.toggleDimensions();
        dimBtn.classList.toggle('active', show);
      });
    }

    const rotBtn = document.getElementById('toggleAutoRotateBtn');
    if (rotBtn) {
      rotBtn.addEventListener('click', () => {
        viewer.options.autoRotate = !viewer.options.autoRotate;
        rotBtn.classList.toggle('active', viewer.options.autoRotate);
      });
    }
  }

  switchHeroView(view) {
    const v3d = document.getElementById('hero3dContainer');
    const vIll = document.getElementById('heroImgIllustration');
    const vMoc = document.getElementById('heroImgMockup');
    const b3d = document.getElementById('heroBtn3D');
    const bIll = document.getElementById('heroBtnIllustration');
    const bMoc = document.getElementById('heroBtnMockup');

    [v3d, vIll, vMoc].forEach(el => { if (el) el.style.display = 'none'; });
    [b3d, bIll, bMoc].forEach(b => { if (b) b.classList.remove('active'); });

    if (view === '3d' && v3d) {
      v3d.style.display = 'block';
      if (b3d) b3d.classList.add('active');
    } else if (view === 'illustration' && vIll) {
      vIll.style.display = 'flex';
      if (bIll) bIll.classList.add('active');
    } else if (view === 'mockup' && vMoc) {
      vMoc.style.display = 'flex';
      if (bMoc) bMoc.classList.add('active');
    }
  }

  switchSpecsSchematic(view) {
    const vb = document.getElementById('specsViewBlueprint');
    const vi = document.getElementById('specsViewIllustration');
    const tb = document.getElementById('specsTabBlueprint');
    const ti = document.getElementById('specsTabIllustration');
    if (view === 'blueprint') {
      if (vb) vb.style.display = 'block';
      if (vi) vi.style.display = 'none';
      if (tb) tb.classList.add('active');
      if (ti) ti.classList.remove('active');
    } else {
      if (vb) vb.style.display = 'none';
      if (vi) vi.style.display = 'block';
      if (tb) tb.classList.remove('active');
      if (ti) ti.classList.add('active');
    }
  }
  // ==========================================
  // DESIGN PAGE (#design)
  // ==========================================
  renderDesignPage(container) {
    container.innerHTML = `
      <section class="section" style="padding-top: 2.5rem;">
        <div class="container">
          <div class="text-center" style="max-width: 800px; margin: 0 auto 3.5rem;">
            <span class="eyebrow">Industrial Design & Ergonomics</span>
            <h1 class="headline-section">Designed to adapt.</h1>
            <p style="font-size: 1.4rem; color: var(--color-copper); font-weight: 600; margin-top: 0.4rem;">
              "Your baking. Your rules."
            </p>
            <p style="color: var(--color-muted-text); margin-top: 0.8rem; font-size: 1.05rem; line-height: 1.7;">
              Engineered with commercial-grade aluminized steel, positive mechanical wire toggle tensioners, and 1-inch rim guides. Every millimeter serves an ergonomic culinary purpose.
            </p>
          </div>

          <!-- Interactive 3D Canvas -->
          <div class="interactive-3d-card" style="margin-bottom: 4.0rem;">
            <div class="viewer-canvas-container" id="designCanvasContainer" style="height: 520px;">
              <div class="viewer-overlay-top">
                <div class="viewer-badge-group">
                  <span class="spec-pill" style="background: rgba(255,255,255,0.9);">
                    <span id="designConfigLabel" style="font-weight: 700; color: var(--color-copper);">Assembled View</span>
                  </span>
                </div>
                <div class="camera-controls-group">
                  <button class="cam-btn active" data-cam="isometric">3/4 Isometric</button>
                  <button class="cam-btn" data-cam="top">Top (Blueprint)</button>
                  <button class="cam-btn" data-cam="front">Front</button>
                  <button class="cam-btn" data-cam="side">Side</button>
                  <button class="cam-btn" data-cam="macro">Macro Detail</button>
                </div>
              </div>
            </div>

            <div class="viewer-toolbar">
              <div class="config-btn-group">
                <button class="config-btn active" data-config="assembled">Assembled</button>
                <button class="config-btn" data-config="exploded">Exploded</button>
                <button class="config-btn" data-config="cupcakes">Cupcakes (2×3)</button>
                <button class="config-btn" data-config="square-cake">Square Cake (9×9)</button>
                <button class="config-btn" data-config="rectangle-cake">Rectangle</button>
                <button class="config-btn" data-config="loaf">Loaf (5×9)</button>
                <button class="config-btn" data-config="reset">Reset</button>
              </div>

              <div class="viewer-tools-group">
                <button class="toggle-btn" id="toggleClaspsBtn">
                  <span id="claspBtnText">Clasps: Locked</span>
                </button>
                <button class="toggle-btn" id="toggleDimensionsBtn">
                  <span>Dimensions</span>
                </button>
                <button class="toggle-btn" id="toggleAutoRotateBtn">
                  <span>Rotate</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 4 Architectural Design Pillars -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2.0rem; margin-bottom: 4.0rem;">
            <div style="padding: 2.2rem; background: var(--color-cream-card); border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: 0 4px 16px var(--color-shadow);">
              <div style="font-size: 1.8rem; margin-bottom: 0.8rem; color: var(--color-copper);">01</div>
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.6rem;">Hot-Dip Aluminized Steel</h3>
              <p style="font-size: 0.92rem; color: var(--color-muted-text); line-height: 1.6;">
                Heavy-gauge structural steel core bonded with an aluminum-silicon alloy. Combines rapid, even thermal distribution with exceptional resistance to thermal warping up to 450°F (232°C).
              </p>
            </div>

            <div style="padding: 2.2rem; background: var(--color-cream-card); border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: 0 4px 16px var(--color-shadow);">
              <div style="font-size: 1.8rem; margin-bottom: 0.8rem; color: var(--color-copper);">02</div>
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.6rem;">Zero Silicone Metallurgy</h3>
              <p style="font-size: 0.92rem; color: var(--color-muted-text); line-height: 1.6;">
                No rubber gaskets, silicone grips, or synthetic coatings to degrade, trap grease, or leach odors over decades of commercial oven use. Plain, pure, food-safe metallurgy.
              </p>
            </div>

            <div style="padding: 2.2rem; background: var(--color-cream-card); border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: 0 4px 16px var(--color-shadow);">
              <div style="font-size: 1.8rem; margin-bottom: 0.8rem; color: var(--color-copper);">03</div>
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.6rem;">Wire Toggle Cam Tensioners</h3>
              <p style="font-size: 0.92rem; color: var(--color-muted-text); line-height: 1.6;">
                Six AISI 304 stainless steel lunch-box style wire bails with signature copper mounting rivets. Tension flips over-center to securely lock dividers and cupcake tray firmly against the pan rim.
              </p>
            </div>

            <div style="padding: 2.2rem; background: var(--color-cream-card); border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: 0 4px 16px var(--color-shadow);">
              <div style="font-size: 1.8rem; margin-bottom: 0.8rem; color: var(--color-copper);">04</div>
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.6rem;">Laser Rim Alignment Guides</h3>
              <p style="font-size: 0.92rem; color: var(--color-muted-text); line-height: 1.6;">
                Shallow laser-scribed marks spaced precisely 1 inch apart along the rim (2 mm wide × 0.3 mm deep). Not drilled through holes, ensuring flawless rectangular positioning without batter leaks.
              </p>
            </div>
          </div>

          <!-- Bottom CTA Banner -->
          <div style="background: var(--color-white); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 3.0rem; text-align: center; box-shadow: 0 16px 36px var(--color-shadow);">
            <h2 style="font-size: 2.0rem; margin-bottom: 0.6rem;">Experience heirloom industrial bakeware.</h2>
            <p style="color: var(--color-muted-text); margin-bottom: 2.0rem; font-size: 1.05rem;">
              Fixed retail kit price: <strong>$49.99 USD</strong>. Complete 6-item system.
            </p>
            <div style="display: flex; justify-content: center; gap: 1.0rem; flex-wrap: wrap;">
              <button class="btn btn-copper btn-lg" onclick="window.bakeshiftApp.quickBuy()">Buy BAKESHIFT — $49.99</button>
              <a href="#features" class="btn btn-outline btn-lg">View Modular Features</a>
            </div>
          </div>
        </div>
      </section>
    `;

    const designEl = document.getElementById('designCanvasContainer');
    if (designEl) {
      this.exploreViewer = new BakeShift3DViewer(designEl, { interactive: true });
      this.bindViewerControls(this.exploreViewer);
    }
  }

  // ==========================================
  // FEATURES PAGE (#features)
  // ==========================================
  renderFeaturesPage(container) {
    container.innerHTML = `
      <section class="section" style="padding-top: 2.5rem;">
        <div class="container">
          <div class="text-center" style="max-width: 800px; margin: 0 auto 3.5rem;">
            <span class="eyebrow">Modular Versatility</span>
            <h1 class="headline-section">One system. Endless possibilities.</h1>
            <p style="color: var(--color-muted-text); margin-top: 0.6rem; font-size: 1.05rem;">
              Five specialized baking pans consolidated into one heirloom modular system.
            </p>
          </div>

          <!-- Bento Grid of 4 Core Configurations -->
          <div class="bento-grid" style="margin-bottom: 4.5rem;">
            ${CONFIGURATIONS.map(cfg => `
              <div class="bento-card">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <span class="spec-pill" style="color: var(--color-copper); border-color: var(--color-copper);">${cfg.badge}</span>
                    <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-muted-text);">${cfg.dimension}</span>
                  </div>
                  <h3 style="font-size: 1.6rem; margin-bottom: 0.6rem;">${cfg.name}</h3>
                  <p style="color: var(--color-muted-text); font-size: 0.92rem; line-height: 1.6;">${cfg.description}</p>
                </div>

                <div class="bento-visual-preview">
                  <img src="${cfg.image}" alt="${cfg.name}" style="width: 100%; height: 100%; object-fit: contain; padding: 6px;">
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.0rem;">
                  <a href="#explore" class="btn btn-outline btn-sm">
                    Inspect in 3D →
                  </a>
                  <button class="btn btn-copper btn-sm" onclick="window.bakeshiftApp.quickBuy()">
                    Buy $49.99
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Cupboard Storage Comparison Card -->
          <div style="background: var(--color-cream-card); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 3.5rem 2.5rem; margin-bottom: 4.0rem; box-shadow: 0 4px 16px var(--color-shadow);">
            <div class="text-center" style="max-width: 650px; margin: 0 auto 3.0rem;">
              <span class="eyebrow">Space Reclamation</span>
              <h2 style="font-size: 2.2rem; margin: 0.4rem 0;">Reclaim 70% of your cupboard space.</h2>
              <p style="color: var(--color-muted-text); font-size: 0.95rem;">
                A single 2-inch slim profile replaces five bulky, stacking-hostile bakeware tins.
              </p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; max-width: 900px; margin: 0 auto;">
              <div style="padding: 2.5rem; background: var(--color-light-gray); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
                <h4 style="font-size: 1.25rem; color: #b93838; margin-bottom: 1.0rem;">Traditional 5-Pan Set</h4>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.92rem; color: var(--color-muted-text);">
                  <li>✕ 5+ separate pans required for basic weekly bakes</li>
                  <li>✕ Takes up 14.5" of vertical cupboard height</li>
                  <li>✕ Unequal dimensions make organized stacking impossible</li>
                  <li>✕ Warps under high oven temperatures</li>
                  <li>✕ Toxic non-stick coatings that scratch and peel</li>
                  <li>✕ Over $110 total cumulative replacement cost</li>
                </ul>
              </div>

              <div style="padding: 2.5rem; background: var(--color-white); border-radius: var(--radius-lg); border: 2px solid var(--color-copper);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.0rem;">
                  <h4 style="font-size: 1.25rem; color: var(--color-charcoal);">BAKESHIFT System</h4>
                  <span style="font-weight: 700; color: var(--color-copper);">$49.99 Fixed</span>
                </div>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.92rem; color: var(--color-charcoal);">
                  <li>✓ 1 modular pan configures to cupcakes, cakes, & loaves</li>
                  <li>✓ Ultra-slim 2.0" profile saves 70% cabinet space</li>
                  <li>✓ All removable parts nest flush inside the base pan</li>
                  <li>✓ Heavy-gauge aluminized steel with zero warping</li>
                  <li>✓ Bare metal metallurgy: 100% PTFE/PFOA/Silicone-free</li>
                  <li>✓ Lifetime heirloom durability for just $49.99</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Bottom CTA -->
          <div class="text-center" style="margin-top: 2.0rem;">
            <button class="btn btn-copper btn-lg" onclick="window.bakeshiftApp.quickBuy()">Get BAKESHIFT for $49.99</button>
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================
  // 2. EXPLORE PAGE (SECTION 5 STRICT REQUIREMENTS)
  // ==========================================
  renderExplorePage(container) {
    container.innerHTML = `
      <section class="section" style="padding-top: 2.5rem;">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2.0rem;">
            <div>
              <span class="eyebrow">3D Interactive Laboratory</span>
              <h1 class="headline-section">EXPLORE BAKESHIFT</h1>
              <p style="color: var(--color-muted-text); margin-top: 0.4rem;">
                Full 360° inspection of the 15×10×2" aluminized steel system, wire toggle clasps, and 2×3 muffin tray.
              </p>
            </div>
            <div style="display: flex; gap: 0.75rem;">
              <button class="btn btn-outline btn-sm" id="exploreResetBtn">Reset Model</button>
              <button class="btn btn-copper btn-sm" onclick="window.bakeshiftApp.quickBuy()">Buy Now — $49.99</button>
            </div>
          </div>

          <!-- 3D Configurator Canvas Card -->
          <div class="interactive-3d-card" style="min-height: 600px;">
            <div class="viewer-canvas-container" id="exploreLabCanvas" style="height: 600px;">
              <div class="viewer-overlay-top">
                <span class="spec-pill" style="background: rgba(255,255,255,0.92); font-weight: 700; color: var(--color-copper);" id="exploreActiveLabel">
                  Assembled Mode (6 Cups, 2 Partitions, 6 Clasps)
                </span>
                <div class="camera-controls-group">
                  <button class="cam-btn active" data-cam="isometric">3/4 Isometric</button>
                  <button class="cam-btn" data-cam="top">Top (Blueprint)</button>
                  <button class="cam-btn" data-cam="front">Front</button>
                  <button class="cam-btn" data-cam="side">Side</button>
                  <button class="cam-btn" data-cam="macro">Macro Detail</button>
                </div>
              </div>
            </div>

            <!-- Main Toolbar -->
            <div class="viewer-toolbar">
              <div class="config-btn-group">
                <button class="config-btn active" data-config="assembled">Assembled</button>
                <button class="config-btn" data-config="exploded">Exploded View</button>
                <button class="config-btn" data-config="cupcakes">Cupcakes (2×3)</button>
                <button class="config-btn" data-config="square-cake">Square Cake (9×9)</button>
                <button class="config-btn" data-config="rectangle-cake">Rectangle</button>
                <button class="config-btn" data-config="loaf">Loaf (5×9)</button>
                <button class="config-btn" data-config="empty">Empty Pan</button>
              </div>

              <div class="viewer-tools-group">
                <button class="toggle-btn" id="exploreClaspsBtn"><span>Clasps: Locked</span></button>
                <button class="toggle-btn" id="exploreDimBtn"><span>Dimension Lines</span></button>
                <button class="toggle-btn" id="exploreRotateBtn"><span>Auto-Rotate</span></button>
              </div>
            </div>
          </div>

          <!-- INTERACTIVE COMPONENT CONTROLS SHELF (SECTION 5 STRICT REQUIREMENTS) -->
          <div class="interactive-controls-shelf">
            <!-- Exploded Separation Slider -->
            <div class="shelf-control-item">
              <div class="shelf-label-row">
                <span>Exploded Separation</span>
                <span class="shelf-val-badge" id="explodedSliderVal">0%</span>
              </div>
              <input type="range" min="0" max="100" value="0" class="custom-range-slider" id="explodedRangeInput">
            </div>

            <!-- Cupcake Tray Removal Toggle -->
            <div class="shelf-control-item">
              <div class="shelf-label-row">
                <span>Cupcake Tray Insert</span>
                <span class="shelf-val-badge" id="trayStateBadge">Inserted</span>
              </div>
              <button class="btn btn-outline btn-sm" id="toggleTrayBtn" style="width: 100%;">
                Toggle Cupcake Tray
              </button>
            </div>

            <!-- Partition 1 Position Slider -->
            <div class="shelf-control-item">
              <div class="shelf-label-row">
                <span>Partition 1 Position</span>
                <span class="shelf-val-badge" id="part1PosBadge">0.5"</span>
              </div>
              <input type="range" min="-6" max="6" value="1" step="1" class="custom-range-slider" id="partition1RangeInput">
            </div>

            <!-- Partition 2 Position Slider -->
            <div class="shelf-control-item">
              <div class="shelf-label-row">
                <span>Partition 2 Position</span>
                <span class="shelf-val-badge" id="part2PosBadge">4.5"</span>
              </div>
              <input type="range" min="-6" max="6" value="5" step="1" class="custom-range-slider" id="partition2RangeInput">
            </div>
          </div>

          <!-- Configuration Info Card -->
          <div style="background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2.0rem; margin-top: 2.0rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
            <div>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.35rem;" id="exploreInfoTitle">Assembled Complete Kit</h3>
              <p style="color: var(--color-muted-text); font-size: 0.92rem; max-width: 640px;" id="exploreInfoDesc">
                Base pan with 6-cup muffin tray seated at left end and two bare-metal partitions mounted via 6 outward stainless toggle clasps.
              </p>
            </div>
            <div style="display: flex; gap: 1.0rem; align-items: center;">
              <span style="font-size: 1.4rem; font-weight: 700; color: var(--color-copper);">$49.99</span>
              <button class="btn btn-copper btn-md" onclick="window.bakeshiftApp.quickBuy()">Buy Kit</button>
            </div>
          </div>
        </div>
      </section>
    `;

    const exploreEl = document.getElementById('exploreLabCanvas');
    if (exploreEl) {
      this.exploreViewer = new BakeShift3DViewer(exploreEl, {
        interactive: true,
        showDimensions: false,
        onConfigChange: (cfg) => {
          const lbl = document.getElementById('exploreActiveLabel');
          const title = document.getElementById('exploreInfoTitle');
          const desc = document.getElementById('exploreInfoDesc');
          const expSlider = document.getElementById('explodedRangeInput');
          const expVal = document.getElementById('explodedSliderVal');

          if (cfg === 'exploded') {
            if (lbl) lbl.textContent = 'Exploded Hardware View';
            if (title) title.textContent = 'Exploded View — Vertical Separation';
            if (desc) desc.textContent = 'All components separate vertically while keeping their 6 stainless toggle clasps securely attached.';
            if (expSlider) expSlider.value = 100;
            if (expVal) expVal.textContent = '100%';
          } else if (cfg === 'cupcakes') {
            if (lbl) lbl.textContent = 'Cupcakes Mode (6 Wells in 2 × 3 Grid)';
            if (title) title.textContent = 'Six-Cup Muffin Configuration';
            if (desc) desc.textContent = '6.25 × 8.70 inch insert anchored at left end with two outward toggle clasps.';
          } else if (cfg === 'square-cake') {
            if (lbl) lbl.textContent = 'Square Cake Mode (9" × 9" Chamber)';
            if (title) title.textContent = '9" × 9" Brownie & Cake Zone';
            if (desc) desc.textContent = 'Single partition locked at 9-inch alignment mark against the 9-inch pan width.';
          } else if (cfg === 'rectangle-cake') {
            if (lbl) lbl.textContent = 'Rectangular Cake Mode';
            if (title) title.textContent = 'Custom Rectangular Baking Chamber';
            if (desc) desc.textContent = 'Variable length compartment within the 13.2 × 9.0 inch interior footprint.';
          } else if (cfg === 'loaf') {
            if (lbl) lbl.textContent = 'Loaf Mode (5" × 9" Chamber)';
            if (title) title.textContent = '5" × 9" Artisan Bread Loaf Zone';
            if (desc) desc.textContent = 'Two bare aluminized steel partitions positioned 5 inches apart for uniform vertical rise.';
          } else if (cfg === 'empty') {
            if (lbl) lbl.textContent = 'Empty Base Pan Mode';
            if (title) title.textContent = 'Commercial Sheet Pan Mode';
            if (desc) desc.textContent = 'Flat uninterrupted 15 × 10 × 2 inch surface with rounded corners and alignment guides.';
          } else {
            if (lbl) lbl.textContent = 'Assembled Mode (6 Cups, 2 Partitions, 6 Clasps)';
            if (title) title.textContent = 'Complete BAKESHIFT System';
            if (desc) desc.textContent = 'All modules locked and ready for commercial bakery flexibility.';
            if (expSlider) expSlider.value = 0;
            if (expVal) expVal.textContent = '0%';
          }
        }
      });

      this.bindViewerControls(this.exploreViewer);

      // Connect Shelf Controls
      const expSlider = document.getElementById('explodedRangeInput');
      const expVal = document.getElementById('explodedSliderVal');
      if (expSlider) {
        expSlider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value) / 100;
          this.exploreViewer.setExplodedSlider(val);
          if (expVal) expVal.textContent = `${Math.round(val * 100)}%`;
        });
      }

      const trayBtn = document.getElementById('toggleTrayBtn');
      const trayBadge = document.getElementById('trayStateBadge');
      if (trayBtn) {
        trayBtn.addEventListener('click', () => {
          const visible = this.exploreViewer.toggleCupcakeTray();
          if (trayBadge) trayBadge.textContent = visible ? 'Inserted' : 'Removed';
          trayBtn.textContent = visible ? 'Remove Cupcake Tray' : 'Insert Cupcake Tray';
        });
      }

      const p1Slider = document.getElementById('partition1RangeInput');
      const p1Badge = document.getElementById('part1PosBadge');
      if (p1Slider) {
        p1Slider.addEventListener('input', (e) => {
          const pos = parseFloat(e.target.value);
          this.exploreViewer.setPartitionPosition(1, pos);
          if (p1Badge) p1Badge.textContent = `${pos}"`;
        });
      }

      const p2Slider = document.getElementById('partition2RangeInput');
      const p2Badge = document.getElementById('part2PosBadge');
      if (p2Slider) {
        p2Slider.addEventListener('input', (e) => {
          const pos = parseFloat(e.target.value);
          this.exploreViewer.setPartitionPosition(2, pos);
          if (p2Badge) p2Badge.textContent = `${pos}"`;
        });
      }

      const resetBtn = document.getElementById('exploreResetBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.exploreViewer.resetModel();
          if (expSlider) expSlider.value = 0;
          if (expVal) expVal.textContent = '0%';
          if (trayBadge) trayBadge.textContent = 'Inserted';
          if (p1Slider) p1Slider.value = 1;
          if (p2Slider) p2Slider.value = 5;
        });
      }
    }
  }

  // ==========================================
  // 3. HOW IT WORKS PAGE
  // ==========================================
  renderHowItWorksPage(container) {
    container.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="text-center" style="max-width: 720px; margin: 0 auto 4.5rem;">
            <span class="eyebrow">Modular Mechanics</span>
            <h1 class="headline-section">How BAKESHIFT Works</h1>
            <p class="subheadline-hero" style="margin-top: 0.8rem;">
              Engineered with the pure mechanical simplicity of lunch-box wire toggle clasps and precision alignment guides.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4.5rem; max-width: 980px; margin: 0 auto;">
            <!-- Step 1 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.0rem; align-items: center;">
              <div>
                <span class="story-step-number">STEP 01</span>
                <h3 style="font-size: 1.8rem; margin: 0.5rem 0;">The Base Foundation</h3>
                <p style="color: var(--color-muted-text); font-size: 0.95rem; line-height: 1.7;">
                  Begin with the flat, uninterrupted aluminized steel pan. Two ergonomic handles provide a secure grip, while shallow 1-inch alignment marks scribed along the rim ensure foolproof positioning.
                </p>
              </div>
              <img src="assets/images/diag-1-base-pan.jpg" alt="15x10x2 Base Pan Dimensions" style="width: 100%; height: 260px; object-fit: contain; background: var(--color-cream); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 1rem;">
            </div>

            <!-- Step 2 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.0rem; align-items: center;">
              <div style="order: 2;">
                <span class="story-step-number">STEP 02</span>
                <h3 style="font-size: 1.8rem; margin: 0.5rem 0;">The 2 × 3 Muffin Module</h3>
                <p style="color: var(--color-muted-text); font-size: 0.95rem; line-height: 1.7;">
                  Lower the six-cup cupcake insert into the left bay. The perimeter flange rests snugly on the inner rim, while two wire toggle clasps secure the tray firmly at both opposing short ends.
                </p>
              </div>
              <div style="order: 1;">
                <img src="assets/images/diag-3-cupcake-tray.jpg" alt="6-Cup Precision Module (2x3)" style="width: 100%; height: 260px; object-fit: contain; background: var(--color-cream); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 1rem;">
              </div>
            </div>

            <!-- Step 3 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.0rem; align-items: center;">
              <div>
                <span class="story-step-number">STEP 03</span>
                <h3 style="font-size: 1.8rem; margin: 0.5rem 0;">Slide & Lock Partitions</h3>
                <p style="color: var(--color-muted-text); font-size: 0.95rem; line-height: 1.7;">
                  Slide either partition along the length of the pan. Line it up with the laser-etched 1-inch marks for a standard 9×9" brownie or 5×9" loaf, then flip the wire toggle clasps down to tension against the outer rim.
                </p>
              </div>
              <img src="assets/images/diag-4-partition.jpg" alt="Adjustable Partitions with Dual Clasps" style="width: 100%; height: 260px; object-fit: contain; background: var(--color-cream); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 1rem;">
            </div>

            <!-- Step 4 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.0rem; align-items: center;">
              <div style="order: 2;">
                <span class="story-step-number">STEP 04</span>
                <h3 style="font-size: 1.8rem; margin: 0.5rem 0;">Professional Parchment Sling</h3>
                <p style="color: var(--color-muted-text); font-size: 0.95rem; line-height: 1.7;">
                  Because BAKESHIFT is crafted from bare, honest sheet metal with no toxic silicone, simply line loose or liquid batters with standard bakery parchment paper for 100% leak-proof baking and effortless lifting.
                </p>
              </div>
              <div style="order: 1;">
                <img src="assets/images/bakeshift-configurations.jpg" alt="Parchment Sling Technique" style="width: 100%; height: 260px; object-fit: contain; background: var(--color-cream); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 1rem;">
              </div>
            </div>
          </div>

          <!-- ZERO SILICONE PHILOSOPHY BANNER -->
          <div style="margin-top: 5.0rem; padding: 3.0rem; background: var(--color-cream-card); border-radius: var(--radius-lg); border: 1px solid var(--color-border); max-width: 980px; margin-left: auto; margin-right: auto;">
            <div style="display: flex; gap: 1.5rem; align-items: flex-start;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--color-copper); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; font-weight: 700;">
                ✓
              </div>
              <div>
                <h3 style="font-size: 1.4rem; margin-bottom: 0.6rem; color: var(--color-charcoal);">
                  The Zero-Silicone, Bare-Metal Standard
                </h3>
                <p style="color: var(--color-muted-text); font-size: 0.95rem; line-height: 1.7;">
                  Unlike consumer pans with silicone gaskets or non-stick Teflon that degrade, absorb odors, and break down under high oven heat, BAKESHIFT is built from bare commercial aluminized steel. It will never melt, discolor, or impart off-flavors to your food.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================
  // 4. TECH SPECS PAGE (SECTION 6 STRICT REQUIREMENTS)
  // ==========================================
  renderSpecsPage(container) {
    container.innerHTML = `
      <section class="section">
        <div class="container container-narrow">
          <div class="text-center" style="margin-bottom: 3.5rem;">
            <span class="eyebrow">Technical Specifications</span>
            <h1 class="headline-section">Precision Engineering</h1>
            <p class="subheadline-hero" style="margin-top: 0.8rem;">
              Full imperial and metric specifications, component weights, and metallurgical data.
            </p>
          </div>

          <!-- Engineering Schematics Switcher -->
          <div style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
            <button class="cam-btn active" id="specsTabBlueprint" onclick="window.bakeshiftApp.switchSpecsSchematic('blueprint')">
              Official CAD Blueprint (DWG BS-001)
            </button>
            <button class="cam-btn" id="specsTabIllustration" onclick="window.bakeshiftApp.switchSpecsSchematic('illustration')">
              Product Illustration &amp; Callouts
            </button>
          </div>

          <!-- Master Engineering Blueprint & Illustration Container -->
          <div style="border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--color-border); margin-bottom: 2.5rem; background: var(--color-white); box-shadow: 0 16px 36px var(--color-shadow); padding: 1.5rem; text-align: center;">
            <div id="specsViewBlueprint">
              <img src="assets/images/bakeshift-technical-blueprint.jpg" alt="Official BAKESHIFT Technical Blueprint (DWG BS-001)" style="width: 100%; height: auto; display: block; border-radius: var(--radius-sm);">
              <div style="margin-top: 1.0rem; font-size: 0.88rem; color: var(--color-muted-text);">
                Official Engineering CAD Drawing (DWG NO: BS-001, REV: A) • 11 Detailed Orthographic Views &amp; Sectional Cuts
              </div>
            </div>
            <div id="specsViewIllustration" style="display: none;">
              <img src="assets/images/bakeshift-official-hero-plan.jpg" alt="Official BAKESHIFT Engineering Illustration" style="width: 100%; height: auto; display: block; border-radius: var(--radius-sm);">
              <div style="margin-top: 1.0rem; font-size: 0.88rem; color: var(--color-muted-text);">
                Master BAKESHIFT Technical Schematic • 15 × 10 × 2" Pan • 6-Cup Tray • Partitions &amp; Clasps
              </div>
            </div>
          </div>

          <!-- 4 Engineering Diagram Cards -->
          <div class="engineering-diagrams-grid">
            <div class="engineering-diagram-card">
              <img src="assets/images/diag-1-base-pan.jpg" alt="1 Base Pan Dimensions">
              <div class="diagram-card-meta">
                <div class="diagram-card-title">1. Base Pan Dimensions</div>
                <div class="diagram-card-desc">15" × 10" × 2" (381 × 254 × 50.8 mm) exterior. 13.2" × 9.0" interior usable floor. Rounded corners and 2 integrated handles.</div>
              </div>
            </div>

            <div class="engineering-diagram-card">
              <img src="assets/images/diag-2-alignment.jpg" alt="2 Alignment Grooves">
              <div class="diagram-card-meta">
                <div class="diagram-card-title">2. Rim Alignment Guides</div>
                <div class="diagram-card-desc">Shallow laser-scribed marks spaced 1 inch apart (2 mm wide × 0.3 mm deep). Not drilled holes; assists square partition alignment.</div>
              </div>
            </div>

            <div class="engineering-diagram-card">
              <img src="assets/images/diag-3-cupcake-tray.jpg" alt="3 Cupcake Tray (2 x 3)">
              <div class="diagram-card-meta">
                <div class="diagram-card-title">3. Cupcake Tray (2 × 3 Grid)</div>
                <div class="diagram-card-desc">Exactly 6 cups (2.3" top dia, 1.75" bottom dia, 1.25" depth, 2.45" center spacing). 8.7" × 6.25" footprint with 2 toggle clasps.</div>
              </div>
            </div>

            <div class="engineering-diagram-card">
              <img src="assets/images/diag-4-partition.jpg" alt="4 Adjustable Partition">
              <div class="diagram-card-meta">
                <div class="diagram-card-title">4. Adjustable Partitions (Qty 2)</div>
                <div class="diagram-card-desc">8.9" L × 1.65" H, 0.9 mm sheet-metal thickness. Plain metallic aluminized steel. Exactly 2 outward clasps per partition. Zero silicone.</div>
              </div>
            </div>
          </div>

          <!-- Exploded View & Clasp Detail Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 3.5rem;">
            <div style="background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: 0 8px 24px var(--color-shadow);">
              <img src="assets/images/bakeshift-exploded-view.jpg" alt="BAKESHIFT Exploded View" style="width: 100%; height: 230px; object-fit: contain; background: var(--color-cream); border-radius: var(--radius-sm); padding: 8px;">
              <div style="font-weight: 700; margin-top: 0.75rem; color: var(--color-charcoal);">Exploded Assembly View</div>
              <div style="font-size: 0.82rem; color: var(--color-muted-text); margin-top: 0.25rem;">
                Base pan, 6-cup tray, and dual partitions separated vertically. All 6 clasps remain attached to their removable components.
              </div>
            </div>

            <div style="background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: 0 8px 24px var(--color-shadow);">
              <img src="assets/images/bakeshift-clasp-detail.jpg" alt="Clasp Mechanism Detail" style="width: 100%; height: 230px; object-fit: contain; background: var(--color-cream); border-radius: var(--radius-sm); padding: 8px;">
              <div style="font-weight: 700; margin-top: 0.75rem; color: var(--color-charcoal);">Lunch-Box Style Toggle Clasps</div>
              <div style="font-size: 0.82rem; color: var(--color-muted-text); margin-top: 0.25rem;">
                0.8" W × 1.0" H 304 stainless steel wire bail loops with copper mounting rivets. Cam-over-center tension clamps securely onto rim.
              </div>
            </div>
          </div>

          <!-- ESTIMATED COMPONENT WEIGHTS TABLE (SECTION 6 STRICT REQUIREMENT) -->
          <div style="margin-bottom: 3.5rem;">
            <h3 style="font-size: 1.4rem; border-bottom: 2px solid var(--color-charcoal); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              Estimated Component Weights
            </h3>
            <p style="font-size: 0.85rem; color: var(--color-muted-text); margin-bottom: 1.25rem;">
              * Preliminary engineering estimates, not verified physical measurements. Component-weight figures are treated as separate from clasp hardware to avoid double counting.
            </p>
            <table class="weights-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Imperial Weight</th>
                  <th>Metric Weight</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${TECHNICAL_SPECS.weights.map(w => `
                  <tr>
                    <td style="font-weight: 600;">${w.component}</td>
                    <td>${w.imperial}</td>
                    <td>${w.metric}</td>
                    <td><span class="spec-pill" style="font-size: 0.75rem;">${w.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- DIMENSIONS & CAPACITY TABLE -->
          <div style="margin-bottom: 3.5rem;">
            <h3 style="font-size: 1.4rem; border-bottom: 2px solid var(--color-charcoal); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
              Dimensions &amp; Physical Geometry
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
              ${TECHNICAL_SPECS.dimensions.map(d => `
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: 1.0rem 0; font-weight: 600; width: 38%; color: var(--color-charcoal);">${d.label}</td>
                  <td style="padding: 1.0rem 0; color: var(--color-muted-text);">${d.value}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <!-- MATERIALS & METALLURGY -->
          <div style="margin-bottom: 3.5rem;">
            <h3 style="font-size: 1.4rem; border-bottom: 2px solid var(--color-charcoal); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
              Materials &amp; Metallurgy
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
              ${TECHNICAL_SPECS.materials.map(m => `
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: 1.0rem 0; font-weight: 600; width: 38%; color: var(--color-charcoal);">${m.label}</td>
                  <td style="padding: 1.0rem 0; color: var(--color-muted-text);">${m.value}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <div class="text-center" style="margin-top: 3.0rem;">
            <a href="#shop" class="btn btn-copper btn-lg">Shop BAKESHIFT — $49.99</a>
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================
  // 5. SHOP PRODUCT PAGE (SECTION 7 STRICT REQUIREMENTS)
  // ==========================================
  renderShopPage(container) {
    this.selectedShopQty = 1;
    container.innerHTML = `
      <section class="section" style="padding-top: 2.5rem;">
        <div class="container">
          <div class="shop-hero-grid">
            <!-- Gallery Column -->
            <div class="shop-gallery-column">
              <div class="shop-main-viewer" style="position: relative; overflow: hidden; background: var(--color-cream); height: 480px; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
                <div id="shopViewerContainer" style="width: 100%; height: 100%;">
                  <span class="spec-pill" style="position: absolute; top: 1rem; left: 1rem; background: rgba(255,255,255,0.9); z-index: 10;">
                    Interactive 3D Model
                  </span>
                </div>
                <div id="shopImgHero" style="display: none; width: 100%; height: 100%; background: var(--color-white); align-items: center; justify-content: center; padding: 1.5rem;">
                  <img src="assets/images/bakeshift-assembled-hero.jpg" alt="Hero Assembled Pan" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <div id="shopImgExploded" style="display: none; width: 100%; height: 100%; background: var(--color-white); align-items: center; justify-content: center; padding: 1.5rem;">
                  <img src="assets/images/bakeshift-exploded-view.jpg" alt="Exploded Hardware View" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <div id="shopImgClasp" style="display: none; width: 100%; height: 100%; background: var(--color-white); align-items: center; justify-content: center; padding: 1.5rem;">
                  <img src="assets/images/bakeshift-clasp-detail.jpg" alt="Stainless Wire Clasp Detail" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <div id="shopImgConfigs" style="display: none; width: 100%; height: 100%; background: var(--color-white); align-items: center; justify-content: center; padding: 1.5rem;">
                  <img src="assets/images/bakeshift-configurations.jpg" alt="4 Baking Configurations" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>

                <!-- 3D Rotation Controls Floating on Canvas -->
                <div style="position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.5rem; background: rgba(255,255,255,0.88); backdrop-filter: blur(8px); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--color-border); z-index: 10;" id="shop3dControls">
                  <button class="cam-btn active" data-cam="isometric">Isometric</button>
                  <button class="cam-btn" data-cam="top">Top</button>
                  <button class="cam-btn" data-cam="macro">Macro</button>
                </div>
              </div>

              <!-- 5-Thumb Gallery Switcher -->
              <div class="shop-thumb-strip">
                <button class="shop-thumb-btn active" id="thumb3D" onclick="window.bakeshiftApp.switchShopView('3d')">
                  <div class="thumb-label">3D Interactive</div>
                </button>
                <button class="shop-thumb-btn" id="thumbHero" onclick="window.bakeshiftApp.switchShopView('hero')">
                  <img src="assets/images/bakeshift-assembled-hero.jpg" alt="Hero Pan">
                  <div class="thumb-label">Assembled Pan</div>
                </button>
                <button class="shop-thumb-btn" id="thumbExploded" onclick="window.bakeshiftApp.switchShopView('exploded')">
                  <img src="assets/images/bakeshift-exploded-view.jpg" alt="Exploded View">
                  <div class="thumb-label">Exploded View</div>
                </button>
                <button class="shop-thumb-btn" id="thumbClasp" onclick="window.bakeshiftApp.switchShopView('clasp')">
                  <img src="assets/images/bakeshift-clasp-detail.jpg" alt="Clasp Detail">
                  <div class="thumb-label">Clasp Hardware</div>
                </button>
                <button class="shop-thumb-btn" id="thumbConfigs" onclick="window.bakeshiftApp.switchShopView('configs')">
                  <img src="assets/images/bakeshift-configurations.jpg" alt="Configurations">
                  <div class="thumb-label">Configurations</div>
                </button>
              </div>
            </div>

            <!-- Purchase Options Column -->
            <div class="shop-info-column" id="product-details">
              <span class="eyebrow">The Complete System</span>
              <h1 style="font-size: clamp(2.0rem, 3.5vw, 2.8rem); line-height: 1.1; margin: 0.5rem 0 0.8rem;">
                ${BAKESHIFT_PRODUCT.name}
              </h1>
              <p style="font-size: 1.25rem; font-weight: 600; color: var(--color-copper); margin-bottom: 0.8rem;">
                ${BRAND.slogan}
              </p>
              <p style="font-size: 1.0rem; color: var(--color-muted-text); line-height: 1.6; margin-bottom: 1.75rem;">
                One pan. Endless possibilities. The complete kit includes the 15×10×2" heavy-gauge aluminized steel base pan, removable 6-cup muffin tray, dual adjustable partitions, and six outward stainless toggle clasps.
              </p>

              <!-- Price Row (NO FAKE DISCOUNTS) -->
              <div class="price-container">
                <span class="price-val">$49.99</span>
                <span style="font-size: 0.9rem; color: var(--color-muted-text);">USD · Complete System Kit</span>
              </div>

              <!-- Quantity Selector -->
              <div style="margin-bottom: 2.0rem;">
                <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Quantity</label>
                <div style="display: flex; align-items: center; gap: 1.0rem;">
                  <div class="quantity-stepper" style="padding: 0.4rem 0.8rem;">
                    <button class="qty-btn" id="shopQtyMinus">-</button>
                    <span class="qty-display" id="shopQtyDisplay" style="font-size: 1.1rem; min-width: 36px;">1</span>
                    <button class="qty-btn" id="shopQtyPlus">+</button>
                  </div>
                  <span id="shopTotalCalc" style="font-size: 1.1rem; font-weight: 700; color: var(--color-charcoal);">$49.99 Total</span>
                </div>
              </div>

              <!-- CTAs -->
              <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 400px; margin-bottom: 2.5rem;">
                <button class="btn btn-copper btn-lg" id="shopAddToBagBtn">Add to Bag</button>
                <button class="btn btn-primary btn-lg" id="shopBuyNowBtn">Buy Now — Checkout Preview</button>
              </div>

              <!-- Accordions -->
              <div class="accordion-group">
                <div class="accordion-item open">
                  <button class="accordion-header">
                    <span>What's Included</span>
                    <span class="accordion-icon">▼</span>
                  </button>
                  <div class="accordion-content">
                    <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem;">
                      ${BAKESHIFT_PRODUCT.includes.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>

                <div class="accordion-item">
                  <button class="accordion-header">
                    <span>Materials & Technical Specs</span>
                    <span class="accordion-icon">▼</span>
                  </button>
                  <div class="accordion-content">
                    <p><strong>Pan & Tray:</strong> Commercial heavy-gauge aluminized steel (15 × 10 × 2 in).</p>
                    <p><strong>Partitions:</strong> Bare aluminized steel. Absolutely zero silicone grips or coatings.</p>
                    <p><strong>Clasps:</strong> 304 Stainless steel lunch-box wire toggle bails with copper-toned rivets (6 total).</p>
                    <p><strong>Estimated Combined Weight:</strong> 3.10 lb (1.41 kg).</p>
                    <p><strong>Max Heat:</strong> Safe up to 450°F (232°C).</p>
                  </div>
                </div>

                <div class="accordion-item">
                  <button class="accordion-header">
                    <span>Shipping & Sales Tax</span>
                    <span class="accordion-icon">▼</span>
                  </button>
                  <div class="accordion-content">
                    <p>Standard tracked US ground shipping is $12.00 per order (2–4 business days). Applicable state sales tax of 8.25% is calculated and applied at checkout.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    const shopEl = document.getElementById('shopViewerContainer');
    if (shopEl) this.shopViewer = new BakeShift3DViewer(shopEl, { interactive: true });

    const minusBtn = document.getElementById('shopQtyMinus');
    const plusBtn = document.getElementById('shopQtyPlus');
    const display = document.getElementById('shopQtyDisplay');
    const totalEl = document.getElementById('shopTotalCalc');

    const updateShopTotal = () => {
      display.textContent = this.selectedShopQty;
      totalEl.textContent = `$${(49.99 * this.selectedShopQty).toFixed(2)} Total`;
    };

    if (minusBtn) minusBtn.addEventListener('click', () => { if (this.selectedShopQty > 1) { this.selectedShopQty--; updateShopTotal(); } });
    if (plusBtn) plusBtn.addEventListener('click', () => { this.selectedShopQty++; updateShopTotal(); });

    const addBtn = document.getElementById('shopAddToBagBtn');
    if (addBtn) addBtn.addEventListener('click', () => cart.addItem(BAKESHIFT_PRODUCT, this.selectedShopQty, true));

    const buyBtn = document.getElementById('shopBuyNowBtn');
    if (buyBtn) buyBtn.addEventListener('click', () => {
      cart.addItem(BAKESHIFT_PRODUCT, this.selectedShopQty, false);
      this.navigateTo('checkout-preview');
    });
  }

  switchShopView(view) {
    const v3d = document.getElementById('shopViewerContainer');
    const vHero = document.getElementById('shopImgHero');
    const vExp = document.getElementById('shopImgExploded');
    const vClasp = document.getElementById('shopImgClasp');
    const vCfg = document.getElementById('shopImgConfigs');
    const c3d = document.getElementById('shop3dControls');

    [v3d, vHero, vExp, vClasp, vCfg].forEach(el => { if (el) el.style.display = 'none'; });
    document.querySelectorAll('.shop-thumb-btn').forEach(b => {
      b.style.borderColor = 'var(--color-border)';
      b.classList.remove('active');
    });

    if (view === '3d' && v3d) {
      v3d.style.display = 'block';
      if (c3d) c3d.style.display = 'flex';
      const t = document.getElementById('thumb3D');
      if (t) { t.style.borderColor = 'var(--color-copper)'; t.classList.add('active'); }
    } else if (view === 'hero' && vHero) {
      vHero.style.display = 'flex';
      if (c3d) c3d.style.display = 'none';
      const t = document.getElementById('thumbHero');
      if (t) { t.style.borderColor = 'var(--color-copper)'; t.classList.add('active'); }
    } else if (view === 'exploded' && vExp) {
      vExp.style.display = 'flex';
      if (c3d) c3d.style.display = 'none';
      const t = document.getElementById('thumbExploded');
      if (t) { t.style.borderColor = 'var(--color-copper)'; t.classList.add('active'); }
    } else if (view === 'clasp' && vClasp) {
      vClasp.style.display = 'flex';
      if (c3d) c3d.style.display = 'none';
      const t = document.getElementById('thumbClasp');
      if (t) { t.style.borderColor = 'var(--color-copper)'; t.classList.add('active'); }
    } else if (view === 'configs' && vCfg) {
      vCfg.style.display = 'flex';
      if (c3d) c3d.style.display = 'none';
      const t = document.getElementById('thumbConfigs');
      if (t) { t.style.borderColor = 'var(--color-copper)'; t.classList.add('active'); }
    }
  }

  // ==========================================
  // 6. BAG PAGE
  // ==========================================
  renderBagPage(container) {
    const state = cart.getState();

    container.innerHTML = `
      <section class="section" style="padding-top: 2.5rem;">
        <div class="container container-narrow">
          <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 1.5rem; margin-bottom: 2.5rem;">
            <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.5rem;">
              <img src="assets/images/bakeshift-logo.png" alt="BakeShift" style="height: 48px; width: auto; object-fit: contain;">
              <h1 class="headline-section" style="font-size: 2.4rem; margin-bottom: 0;">Review your Bag.</h1>
            </div>
            <p style="color: var(--color-muted-text); margin-top: 0.4rem;">
              Standard tracked US ground shipping ($12.00) and sales tax (8.25%) are calculated below.
            </p>
          </div>

          ${state.items.length === 0 ? `
            <div style="text-align: center; padding: 4.0rem 2.0rem; background: var(--color-white); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
              <h3 style="font-size: 1.4rem; margin-bottom: 0.8rem;">Your Bag is empty.</h3>
              <p style="color: var(--color-muted-text); margin-bottom: 2.0rem;">Explore the BAKESHIFT modular bakeware system and discover culinary freedom.</p>
              <div style="display: flex; justify-content: center; gap: 1.0rem; flex-wrap: wrap;">
                <a href="#shop" class="btn btn-copper btn-md">Shop BAKESHIFT — $49.99</a>
                <a href="#shop" class="btn btn-outline btn-md">Continue Shopping</a>
              </div>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 2.0rem; margin-bottom: 3.0rem;">
              ${state.items.map(item => `
                <div style="display: flex; gap: 2.0rem; align-items: center; background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2.0rem;">
                  <div style="width: 100px; height: 100px; background: var(--color-cream); border-radius: var(--radius-sm); border: 1px solid var(--color-border); padding: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <img src="assets/images/bakeshift-assembled-hero.jpg" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                  </div>
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                      <div>
                        <h3 style="font-size: 1.25rem; font-weight: 600;">${item.name}</h3>
                        <p style="color: var(--color-copper); font-size: 0.85rem; font-weight: 600; margin-top: 0.2rem;">${BRAND.slogan}</p>
                      </div>
                      <span style="font-size: 1.35rem; font-weight: 700; color: var(--color-charcoal);">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
                      <div class="quantity-stepper">
                        <button class="qty-btn" onclick="window.bakeshiftApp.decrementItem('${item.id}')">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="window.bakeshiftApp.incrementItem('${item.id}')">+</button>
                      </div>
                      <button style="background: none; border: none; color: #d9383a; font-size: 0.9rem; cursor: pointer;" onclick="window.bakeshiftApp.removeItem('${item.id}')">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Bag Order Summary -->
            <div style="background: var(--color-cream-card); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 2.5rem; max-width: 520px; margin-left: auto;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 1.05rem;">
                <span style="color: var(--color-muted-text);">Subtotal</span>
                <span style="font-weight: 600;">${state.subtotalFormatted}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 1.05rem;">
                <span style="color: var(--color-muted-text);">Tracked US Shipping</span>
                <span style="font-weight: 600; color: var(--color-charcoal);">${state.shippingFormatted}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 1.25rem; font-size: 1.05rem;">
                <span style="color: var(--color-muted-text);">Estimated Sales Tax (8.25%)</span>
                <span style="font-weight: 600; color: var(--color-charcoal);">${state.taxFormatted}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 1.25rem; border-top: 1px solid var(--color-border); font-size: 1.4rem; font-weight: 700; margin-bottom: 2.0rem;">
                <span>Total</span>
                <span style="color: var(--color-copper);">${state.totalFormatted}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="#checkout-preview" class="btn btn-copper btn-lg" style="width: 100%; text-align: center;">
                  Proceed to Checkout Preview
                </a>
                <a href="#shop" class="btn btn-outline btn-lg" style="width: 100%; text-align: center;">
                  Continue Shopping
                </a>
              </div>
            </div>
          `}
        </div>
      </section>
    `;
  }

  // ==========================================
  // 7. CHECKOUT PREVIEW (DEMO ONLY — SECTION 9 STRICT REQUIREMENTS)
  // ==========================================
  renderCheckoutPreview(container) {
    this.checkoutMode = this.checkoutMode || 'preview';
    const state = cart.getState();
    const hasItems = state.items.length > 0;
    const subtotalFormatted = hasItems ? state.subtotalFormatted : '$49.99';
    const shippingFormatted = hasItems ? state.shippingFormatted : '$12.00';
    const taxFormatted = hasItems ? state.taxFormatted : '$4.12';
    const totalFormatted = hasItems ? state.totalFormatted : '$66.11';
    const totalUnits = hasItems ? state.totalCount : 1;

    container.innerHTML = `
      <section class="section" style="padding-top: 2.5rem;">
        <div class="container container-narrow">
          <!-- Official BAKESHIFT Checkout Branding -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1.0rem;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <img src="assets/images/bakeshift-logo.png" alt="BakeShift" style="height: 48px; width: auto; object-fit: contain;">
              <span style="font-size: 1.25rem; font-weight: 700; color: var(--color-charcoal); letter-spacing: -0.01em;">BAKESHIFT Checkout</span>
            </div>
          </div>

          <!-- Two-Mode Switcher Bar (Requirement 5) -->
          <div class="stripe-mode-switch-bar">
            <div>
              <strong style="color: var(--color-charcoal); font-size: 0.95rem;">Checkout Mode:</strong>
              <span style="font-size: 0.84rem; color: var(--color-muted-text); margin-left: 0.4rem;">
                ${this.checkoutMode === 'stripe_test' ? '⚡ Stripe Sandbox Active (Developer Test Mode)' : 'Standard Store Preview (Non-Charging Demo)'}
              </span>
            </div>
            <div class="stripe-mode-pills">
              <button class="stripe-mode-btn ${this.checkoutMode === 'preview' ? 'active' : ''}" onclick="window.bakeshiftApp.switchCheckoutMode('preview')">
                Preview Mode
              </button>
              <button class="stripe-mode-btn ${this.checkoutMode === 'stripe_test' ? 'active' : ''}" onclick="window.bakeshiftApp.switchCheckoutMode('stripe_test')">
                ⚡ Stripe Sandbox Mode
              </button>
            </div>
          </div>

          ${this.checkoutMode === 'stripe_test' ? `
            <!-- ==========================================
                 STRIPE SANDBOX MODE (DEVELOPER DEMO)
                 ========================================== -->
            <div class="stripe-sandbox-banner">
              <span class="stripe-sandbox-badge">SANDBOX TEST</span>
              <div>
                <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--color-charcoal); margin-bottom: 0.35rem;">
                  STRIPE SANDBOX / TEST MODE — NO REAL CHARGES
                </h4>
                <p style="font-size: 0.85rem; color: var(--color-muted-text); line-height: 1.5;">
                  This checkout is connected to the official Stripe SDK in sandbox test mode. Real payment methods and live transactions are disabled. Use the quick test card presets below to verify authorization, decline flows, and server validation.
                </p>
              </div>
            </div>

            <!-- Visual Checkout Stepper -->
            <div class="checkout-stepper">
              <div class="step-indicator active"><span class="step-circle">1</span><span>Review Bag</span></div>
              <span style="color: var(--color-border); font-size: 1.2rem;">—</span>
              <div class="step-indicator active"><span class="step-circle">2</span><span>Shipping ($12.00)</span></div>
              <span style="color: var(--color-border); font-size: 1.2rem;">—</span>
              <div class="step-indicator active"><span class="step-circle">3</span><span>Stripe Sandbox Payment</span></div>
            </div>

            <!-- Back to Bag Navigation Button (Test 7) -->
            <div style="margin-bottom: 1.5rem;">
              <a href="#bag" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">
                ← Back to Bag
              </a>
            </div>

            <div class="checkout-grid">
              <div>
                ${this.stripeSuccessState ? `
                  <!-- SUCCESS RECEIPT CARD -->
                  <div class="stripe-success-card">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: #DCFCE7; color: #15803D; font-size: 1.8rem; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
                      ✓
                    </div>
                    <h2 style="font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-charcoal);">
                      Test Payment Simulated Successfully!
                    </h2>
                    <p style="font-size: 0.95rem; color: var(--color-muted-text); margin-bottom: 1.5rem;">
                      Stripe Sandbox transaction authorized without transferring real funds.
                    </p>

                    <div style="background: var(--color-light-gray); border-radius: var(--radius-md); padding: 1.5rem; text-align: left; margin-bottom: 2.0rem; font-size: 0.9rem;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
                        <span style="color: var(--color-muted-text);">Stripe Reference</span>
                        <span style="font-family: var(--font-mono); font-weight: 600;">${this.stripeSuccessState.paymentIntent}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
                        <span style="color: var(--color-muted-text);">Amount Simulated</span>
                        <span style="font-weight: 700; color: var(--color-copper);">${this.stripeSuccessState.total} USD</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem;">
                        <span style="color: var(--color-muted-text);">Items Reserved</span>
                        <span style="font-weight: 600;">BAKESHIFT Complete Pan (${this.stripeSuccessState.units} unit)</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--color-muted-text);">Environment</span>
                        <span style="color: #15803D; font-weight: 700;">Stripe Sandbox (Test Mode)</span>
                      </div>
                    </div>

                    <div style="display: flex; justify-content: center; gap: 1.0rem; flex-wrap: wrap;">
                      <button class="btn btn-outline btn-md" onclick="window.bakeshiftApp.resetStripeTest()">
                        Simulate Another Payment
                      </button>
                      <a href="#shop" class="btn btn-copper btn-md">
                        Return to BAKESHIFT Store
                      </a>
                    </div>
                  </div>
                ` : `
                  <!-- EMBEDDED STRIPE CARD PAYMENT FORM -->
                  <div class="stripe-embedded-card">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.0rem;">
                      <h3 style="font-size: 1.25rem; font-weight: 700;">Embedded Payment Form</h3>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 0.75rem; font-weight: 700; color: #635BFF; border: 1px solid #635BFF; padding: 2px 6px; border-radius: 4px;">stripe</span>
                        <span style="font-size: 0.72rem; color: var(--color-muted-text);">Sandbox</span>
                      </div>
                    </div>

                    <!-- Quick-Fill Official Test Cards Shelf -->
                    <div class="stripe-test-cards-shelf">
                      <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-charcoal); margin-bottom: 0.4rem;">
                        ⚡ Quick-Fill Official Stripe Test Cards:
                      </div>
                      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button type="button" class="test-card-pill" onclick="window.bakeshiftApp.fillTestCard('success')">
                          <span>✓</span> 4242 (Success)
                        </button>
                        <button type="button" class="test-card-pill" onclick="window.bakeshiftApp.fillTestCard('decline')">
                          <span>✕</span> 0002 (Decline)
                        </button>
                        <button type="button" class="test-card-pill" onclick="window.bakeshiftApp.fillTestCard('expired')">
                          <span>⏳</span> 0069 (Expired)
                        </button>
                        <button type="button" class="test-card-pill" onclick="window.bakeshiftApp.fillTestCard('cvc')">
                          <span>🔒</span> 0127 (CVC Error)
                        </button>
                      </div>
                    </div>

                    <!-- Error banner if declined/invalid -->
                    <div id="stripeErrorBox" class="stripe-error-banner" style="display: none;"></div>

                    <div class="stripe-form-grid">
                      <div>
                        <label class="stripe-input-label" for="stripeCardName">Cardholder Name</label>
                        <input type="text" id="stripeCardName" class="stripe-input" placeholder="Alex Baker" value="Alex Baker">
                      </div>

                      <div>
                        <label class="stripe-input-label" for="stripeCardNumber">Card Number (Sandbox)</label>
                        <div class="stripe-input-wrapper">
                          <input type="text" id="stripeCardNumber" class="stripe-input" placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242" maxlength="19">
                        </div>
                      </div>

                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.0rem;">
                        <div>
                          <label class="stripe-input-label" for="stripeCardExp">Expiration</label>
                          <input type="text" id="stripeCardExp" class="stripe-input" placeholder="MM / YY" value="12 / 34" maxlength="7">
                        </div>
                        <div>
                          <label class="stripe-input-label" for="stripeCardCvc">CVC</label>
                          <input type="text" id="stripeCardCvc" class="stripe-input" placeholder="123" value="123" maxlength="4">
                        </div>
                      </div>

                      <div>
                        <label class="stripe-input-label" for="stripeCardZip">Postal / ZIP Code</label>
                        <input type="text" id="stripeCardZip" class="stripe-input" placeholder="90210" value="90210" maxlength="10">
                      </div>
                    </div>

                    <button id="stripePayBtn" class="btn btn-copper btn-lg" style="width: 100%; margin-top: 1.75rem;" onclick="window.bakeshiftApp.submitStripeTestPayment()">
                      ⚡ Pay ${totalFormatted} in Stripe Sandbox
                    </button>

                    <p style="font-size: 0.78rem; color: var(--color-muted-text); text-align: center; margin-top: 0.85rem; line-height: 1.5;">
                      🔒 Encrypted with Stripe SSL · Test Mode Active · No real financial charge will occur.
                    </p>
                  </div>
                `}
              </div>

              <!-- Order Summary Card -->
              <div>
                <div class="order-summary-card">
                  <h3 style="font-size: 1.3rem; margin-bottom: 1.25rem;">Order Summary (${totalUnits} ${totalUnits === 1 ? 'item' : 'items'})</h3>
                  <div style="display: flex; gap: 1.0rem; align-items: center; padding-bottom: 1.25rem; border-bottom: 1px solid var(--color-border); margin-bottom: 1.25rem;">
                    <div style="width: 64px; height: 64px; background: var(--color-white); border-radius: var(--radius-sm); border: 1px solid var(--color-border); padding: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <img src="assets/images/bakeshift-assembled-hero.jpg" alt="BAKESHIFT Pan" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 0.95rem;">${BAKESHIFT_PRODUCT.name}</div>
                      <div style="font-size: 0.8rem; color: var(--color-muted-text);">Qty: ${totalUnits} · $49.99 each</div>
                    </div>
                    <div style="margin-left: auto; font-weight: 700;">${subtotalFormatted}</div>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.92rem;">
                    <span style="color: var(--color-muted-text);">Subtotal</span>
                    <span>${subtotalFormatted}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.92rem;">
                    <span style="color: var(--color-muted-text);">Tracked US Shipping</span>
                    <span style="font-weight: 600;">${shippingFormatted}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.92rem;">
                    <span style="color: var(--color-muted-text);">Estimated Sales Tax (8.25%)</span>
                    <span style="font-weight: 600;">${taxFormatted}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding-top: 1.25rem; border-top: 1px solid var(--color-border); font-size: 1.3rem; font-weight: 700;">
                    <span>Total Due</span>
                    <span style="color: var(--color-copper);">${totalFormatted}</span>
                  </div>
                  <div style="margin-top: 1.25rem; padding: 0.75rem; background: var(--color-soft-pink-subtle); border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--color-charcoal); text-align: center;">
                    ✓ Stripe Sandbox Session Validated
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <!-- ==========================================
                 PREVIEW MODE (DEFAULT DEMONSTRATION)
                 ========================================== -->
            <!-- DEMO NOTICE BANNER (STRICT USER REQUIREMENT) -->
            <div class="checkout-banner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-copper)" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>
                <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--color-charcoal); margin-bottom: 0.35rem;">
                  Checkout Preview — BAKESHIFT online purchasing is coming soon.
                </h4>
                <p style="font-size: 0.88rem; color: var(--color-muted-text); line-height: 1.5;">
                  This is an authentic checkout demonstration. No customer names, phone numbers, shipping addresses, or credit cards are collected, and no financial transactions will be processed.
                </p>
              </div>
            </div>

            <!-- Visual Checkout Progress Stepper -->
            <div class="checkout-stepper">
              <div class="step-indicator active"><span class="step-circle">1</span><span>Review Bag</span></div>
              <span style="color: var(--color-border); font-size: 1.2rem;">—</span>
              <div class="step-indicator active"><span class="step-circle">2</span><span>Shipping Details (Demo)</span></div>
              <span style="color: var(--color-border); font-size: 1.2rem;">—</span>
              <div class="step-indicator"><span class="step-circle">3</span><span>Payment Preview</span></div>
            </div>

            <!-- Back to Bag Navigation Button (Test 7) -->
            <div style="margin-bottom: 1.5rem;">
              <a href="#bag" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">
                ← Back to Bag
              </a>
            </div>

            <div class="checkout-grid">
              <div>
                <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Order Review</h2>
                
                <div style="background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2.0rem; margin-bottom: 2.0rem; box-shadow: 0 4px 16px var(--color-shadow);">
                  <h4 style="font-size: 1.05rem; margin-bottom: 0.75rem;">Shipping Method</h4>
                  <p style="font-size: 0.88rem; color: var(--color-muted-text); margin-bottom: 0.5rem;">
                    Launch Batch 1 orders ship via standard tracked US ground delivery.
                  </p>
                  <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 600; padding: 0.75rem 0; border-top: 1px solid var(--color-border);">
                    <span>Standard Ground Delivery (2–4 Days)</span>
                    <span style="color: var(--color-charcoal); font-weight: 700;">$0.00 <span style="font-size: 0.78rem; font-weight: 400; color: var(--color-muted-text);">(Not calculated in demo mode)</span></span>
                  </div>
                </div>

                <h4 style="font-size: 1.05rem; margin-bottom: 1.0rem;">Payment Options (Demonstration)</h4>
                <div class="disabled-payment-box">
                  <div style="display: flex; gap: 1.0rem; margin-bottom: 1.0rem; opacity: 0.55;">
                    <div style="padding: 0.65rem 1.4rem; background: #000; color: #fff; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.92rem; display: flex; align-items: center; gap: 6px;">
                      <span> Pay</span>
                      <span style="font-size: 0.7rem; font-weight: 400; opacity: 0.7;">(Demo)</span>
                    </div>
                    <div style="padding: 0.65rem 1.4rem; background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-weight: 600; font-size: 0.92rem; color: var(--color-charcoal); display: flex; align-items: center; gap: 6px;">
                      <span>Credit Card</span>
                      <span style="font-size: 0.7rem; font-weight: 400; opacity: 0.7;">(Demo)</span>
                    </div>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--color-muted-text); line-height: 1.5;">
                    Payment gateways are intentionally disabled for this preview. Customers cannot submit payment info or be charged.
                  </p>
                </div>

                <!-- Visibly Disabled Final Button -->
                <div style="margin-top: 2.0rem;">
                  <button class="btn btn-copper btn-lg" style="width: 100%; opacity: 0.55; cursor: not-allowed;" disabled>
                    Place Order — Online Purchasing Coming Soon
                  </button>
                  <p style="font-size: 0.8rem; color: var(--color-muted-text); text-align: center; margin-top: 0.75rem;">
                    Official commercial checkout launching soon. Stay tuned for retail availability.
                  </p>
                </div>
              </div>

              <!-- Order Summary Card -->
              <div>
                <div class="order-summary-card">
                  <h3 style="font-size: 1.3rem; margin-bottom: 1.25rem;">Summary (${totalUnits} ${totalUnits === 1 ? 'item' : 'items'})</h3>
                  <div style="display: flex; gap: 1.0rem; align-items: center; padding-bottom: 1.25rem; border-bottom: 1px solid var(--color-border); margin-bottom: 1.25rem;">
                    <div style="width: 64px; height: 64px; background: var(--color-white); border-radius: var(--radius-sm); border: 1px solid var(--color-border); padding: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <img src="assets/images/bakeshift-assembled-hero.jpg" alt="BAKESHIFT Pan" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 0.95rem;">${BAKESHIFT_PRODUCT.name}</div>
                      <div style="font-size: 0.8rem; color: var(--color-muted-text);">Qty: ${totalUnits} · $49.99 each</div>
                    </div>
                    <div style="margin-left: auto; font-weight: 700;">${subtotalFormatted}</div>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.92rem;">
                    <span style="color: var(--color-muted-text);">Subtotal</span>
                    <span>${subtotalFormatted}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.92rem;">
                    <span style="color: var(--color-muted-text);">Standard Shipping</span>
                    <span style="font-weight: 600;">$0.00 <span style="font-size: 0.78rem; font-weight: 400; color: var(--color-muted-text);">(Not calculated in demo mode)</span></span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.92rem;">
                    <span style="color: var(--color-muted-text);">Estimated Sales Tax</span>
                    <span style="font-weight: 600;">$0.00 <span style="font-size: 0.78rem; font-weight: 400; color: var(--color-muted-text);">(Not calculated in demo mode)</span></span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding-top: 1.25rem; border-top: 1px solid var(--color-border); font-size: 1.3rem; font-weight: 700;">
                    <span>Total Due (Demo)</span>
                    <span style="color: var(--color-copper);">${subtotalFormatted}</span>
                  </div>
                </div>
              </div>
            </div>
          `}
        </div>
      </section>
    `;
  }

  // ==========================================
  // 8. OUR STORY PAGE
  // ==========================================
  renderOurStoryPage(container) {
    container.innerHTML = `
      <section class="section">
        <div class="container container-narrow">
          <div class="text-center" style="margin-bottom: 4.0rem;">
            <span class="eyebrow">Our Mission</span>
            <h1 class="headline-section">BAKE MORE WITH LESS.</h1>
            <p class="subheadline-hero" style="margin-top: 0.8rem;">
              How a simple frustration with overflowing kitchen cabinets sparked a modular cookware revolution.
            </p>
          </div>

          <div style="font-size: 1.15rem; line-height: 1.8; color: var(--color-charcoal); margin-bottom: 3.5rem;">
            ${COMPANY_STORY.foundingStory.split('\n\n').map(p => `<p style="margin-bottom: 1.5rem;">${p}</p>`).join('')}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.0rem; margin-bottom: 4.5rem;">
            ${COMPANY_STORY.pillars.map(p => `
              <div style="padding: 2.0rem; background: var(--color-cream-card); border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: 0 4px 16px var(--color-shadow);">
                <h4 style="font-size: 1.25rem; color: var(--color-copper); margin-bottom: 0.6rem;">${p.title}</h4>
                <p style="font-size: 0.92rem; color: var(--color-muted-text); line-height: 1.6;">${p.text}</p>
              </div>
            `).join('')}
          </div>

          <div class="text-center">
            <a href="#shop" class="btn btn-copper btn-lg">Experience BAKESHIFT — $49.99</a>
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================
  // 9. FAQ PAGE
  // ==========================================
  renderFaqPage(container) {
    container.innerHTML = `
      <section class="section">
        <div class="container container-narrow">
          <div class="text-center" style="margin-bottom: 4.0rem;">
            <span class="eyebrow">Customer Support</span>
            <h1 class="headline-section">Frequently Asked Questions</h1>
            <p style="color: var(--color-muted-text); margin-top: 0.6rem;">
              Clear answers grounded strictly in BAKESHIFT's physical engineering and metallurgy.
            </p>
          </div>
          <div class="accordion-group">
            ${FAQS.map((faq, i) => `
              <div class="accordion-item ${i === 0 ? 'open' : ''}">
                <button class="accordion-header">
                  <span>${faq.q}</span>
                  <span class="accordion-icon">▼</span>
                </button>
                <div class="accordion-content"><p>${faq.a}</p></div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================
  // 10. CONTACT PAGE
  // ==========================================
  renderContactPage(container) {
    container.innerHTML = `
      <section class="section">
        <div class="container container-narrow">
          <div class="text-center" style="margin-bottom: 3.5rem;">
            <span class="eyebrow">Connect</span>
            <h1 class="headline-section">Get in Touch</h1>
            <p style="color: var(--color-muted-text); margin-top: 0.5rem;">
              Inquiries for culinary partnerships, retail distribution, and press.
            </p>
          </div>
          <div style="background: var(--color-cream-card); padding: 3.0rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); max-width: 600px; margin: 0 auto; box-shadow: 0 4px 16px var(--color-shadow);">
            <p style="font-size: 0.95rem; line-height: 1.7; color: var(--color-charcoal); margin-bottom: 1.5rem;">
              For press kit requests, wholesale manufacturing inquiries, or culinary collaborations, please reach out to our team:
            </p>
            <div style="display: flex; flex-direction: column; gap: 1.0rem; font-size: 0.95rem;">
              <div><strong>Brand:</strong> BAKESHIFT Inc.</div>
              <div><strong>Headquarters:</strong> Culinary Innovation Lab</div>
              <div><strong>Email:</strong> contact@bakeshift.com (Demonstration)</div>
              <div><strong>Retail System:</strong> $49.99 USD Complete Baking System</div>
            </div>
            <div style="margin-top: 2.0rem;">
              <a href="#shop" class="btn btn-copper btn-md" style="width: 100%;">Explore Product — $49.99</a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  handleGlobalClick(e) {
    const header = e.target.closest('.accordion-header');
    if (header) {
      const item = header.closest('.accordion-item');
      if (item) {
        item.classList.toggle('open');
      }
    }
  }
}
