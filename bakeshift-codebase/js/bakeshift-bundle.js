/**
 * BAKESHIFT — Complete Standalone Application Bundle
 * Designed to run seamlessly over HTTP (http://localhost:8080)
 * and directly via local file protocols (file://) without CORS restrictions.
 * 
 * Brand Slogan: BAKE MORE WITH LESS.
 * Retail Price: $47.00 USD
 */

(function () {
  'use strict';

  // Ensure Three.js is loaded
  const THREE = window.THREE;
  if (!THREE) {
    console.error('BakeShift: THREE is not defined. Ensure three.min.js is loaded first.');
  }
  const OrbitControls = THREE ? (THREE.OrbitControls || window.OrbitControls) : null;

  // ==========================================
  // 1. BRAND & PRODUCT DATA
  // ==========================================
  const BRAND = {
    name: 'BAKESHIFT',
    slogan: 'BAKE MORE WITH LESS.',
    subheading: 'One pan. Endless possibilities.',
    description: 'Meet BAKESHIFT — one innovative baking system designed to bring flexibility, convenience, and creativity into your kitchen.',
    price: 47.00,
    currency: 'USD',
    colors: {
      primaryBg: '#FFFFFF',
      secondaryBg: '#FFF2F0',
      charcoal: '#2C1E18',
      copper: '#C98B69',
      softPink: '#FFD0CB',
      lightBrown: '#C98B69',
      metallicSteel: '#9DA3A6',
      white: '#FFFFFF'
    }
  };

  const BAKESHIFT_PRODUCT = {
    id: 'bakeshift-complete-system',
    name: 'BAKESHIFT Complete Baking System',
    slogan: 'BAKE MORE WITH LESS.',
    subheading: 'One pan. Endless possibilities.',
    description: 'Meet BAKESHIFT — one innovative baking system designed to bring flexibility, convenience, and creativity into your kitchen.',
    price: 47.00,
    currency: 'USD',
    material: 'Heavy-Gauge Commercial Aluminized Steel & 304 Stainless Steel',
    dimensions: '15" × 10" × 2" (381 × 254 × 50.8 mm)',
    inStock: true,
    leadTime: 'Launch Batch 1 — Ready to Reserve',
    includes: [
      '1 aluminized-steel base pan (15 × 10 × 2 inches)',
      '1 removable six-cup cupcake tray (2 × 3 grid, 6.25 × 8.70 inches)',
      '2 adjustable aluminized-steel partitions (bare metal, no silicone)',
      '6 mounted 304 stainless-steel wire toggle clasps with copper accents',
      'Laser-scribed 1-inch rim alignment guides',
      'Quick-start configuration & baking guide'
    ]
  };

  const CONFIGURATIONS = [
    {
      id: 'cupcakes',
      name: 'Six Cupcakes & Muffins',
      badge: '2 × 3 Grid',
      dimension: '6.25" × 8.70" Insert',
      description: 'Bake exactly six golden cupcakes or breakfast muffins in a precision 2 × 3 grid while leaving the rest of the pan open for a companion bake.',
      details: 'Precision-formed aluminized steel insert with dual stainless wire toggle clasps. Each well measures 2.3" in top diameter with a 2.45" center-to-center spacing.',
      benefits: ['Exactly 6 wells in 2 × 3 layout', 'Dual wire toggle clasps on opposing short ends', 'No wasted batter or oversized 12-cup footprint'],
      cameraPreset: 'cupcakes',
      image: 'assets/images/bakeshift-configurations.jpg'
    },
    {
      id: 'square-cake',
      name: '9" × 9" Square Cake',
      badge: 'Brownie / Sheet Cake',
      dimension: '9" × 9" Conceptual Zone',
      description: 'Slide one partition to the 9-inch alignment mark to form an authentic, commercial-grade 9" × 9" square brownie or sheet cake zone.',
      details: 'Interior width is exactly 9.0 inches. Locking the bare aluminized partition at the 9-inch laser mark creates a flawless 81 sq inch baking chamber.',
      benefits: ['Even heat distribution across corners', 'Crisp, bakery-style edges', 'Replaces single-purpose square pans'],
      cameraPreset: 'square-cake',
      image: 'assets/images/bakeshift-configurations.jpg'
    },
    {
      id: 'rectangle-cake',
      name: 'Custom Rectangular Bake',
      badge: 'Variable Length',
      dimension: 'Up to 13.2" × 9.0" Zone',
      description: 'Configure custom rectangular baking zones for focaccia, lasagna, sheet cakes, or roasted vegetables tailored to your exact recipe yield.',
      details: 'Use one or both partitions to segment the pan into custom rectangular zones within the 13.2" × 9.0" interior footprint.',
      benefits: ['Adaptable to any family portion', 'Prevents thin batters from over-spreading', 'Full 2-inch deep commercial sidewalls'],
      cameraPreset: 'rectangle-cake',
      image: 'assets/images/bakeshift-configurations.jpg'
    },
    {
      id: 'loaf',
      name: '5" × 9" Artisan Loaf',
      badge: 'Bread & Pound Cake',
      dimension: '5" × 9" Conceptual Zone',
      description: 'Position both partitions 5 inches apart to create the classic 5" × 9" loaf pan geometry for sourdough sandwich bread, banana bread, or meatloaf.',
      details: 'Heavy-gauge aluminized steel delivers the steady, intense bottom heat needed for professional crust spring and even browning.',
      benefits: ['Uniform vertical rise', 'No uneven warping during long bakes', 'Replaces single-purpose loaf tins'],
      cameraPreset: 'loaf',
      image: 'assets/images/bakeshift-configurations.jpg'
    }
  ];

  const SCROLL_STORIES = [
    {
      id: 'story-1',
      step: '01',
      scene: 'Scene 1 — ONE PAN',
      title: 'One pan.',
      subtitle: 'A better way to bake.',
      body: 'Show the empty base pan floating against a clean background. Crafted from heavy-gauge commercial aluminized steel. A pristine 15 × 10 × 2 inch canvas with rounded corners, ergonomic handles, and a continuous flat bottom.',
      badge: 'Heavy-Gauge Aluminized Steel',
      config: 'empty',
      stats: [
        { label: 'Exterior Dimensions', value: '15" × 10" × 2"' },
        { label: 'Interior Usable Space', value: '13.2" × 9.0"' },
        { label: 'Material', value: 'Aluminized Steel' }
      ]
    },
    {
      id: 'story-2',
      step: '02',
      scene: 'Scene 2 — ENDLESS POSSIBILITIES',
      title: 'Six cupcakes. One smart design.',
      subtitle: 'Detachable 2 × 3 insert with dual wire toggle clasps.',
      body: 'The detachable cupcake tray descends smoothly into the left end of the pan. Animate its two lunch-box-style toggle clasps closing securely over the catches. Exactly six cups in two columns by three rows.',
      badge: '2 × 3 Precision Insert (6 Cups)',
      config: 'cupcakes',
      stats: [
        { label: 'Cavity Count', value: 'Exactly 6 Wells' },
        { label: 'Arrangement', value: '2 Columns × 3 Rows' },
        { label: 'Clasp Mechanism', value: '2 Toggle Clasps' }
      ]
    },
    {
      id: 'story-3',
      step: '03',
      scene: 'Scene 3 — MADE TO ADAPT',
      title: 'Your baking. Your dimensions.',
      subtitle: 'Two independently adjustable bare-metal partitions.',
      body: 'Introduce the two removable partitions moving into position one at a time. Watch the four partition toggle clasps open and lock securely onto the pan rim. Plain metallic surfaces with absolutely zero silicone grips.',
      badge: 'Dual Partitions (4 Clasps)',
      config: 'assembled',
      stats: [
        { label: 'Partitions Included', value: '2 Independent' },
        { label: 'Silicone Grips', value: 'Zero (Pure Metal)' },
        { label: 'Partition Clasps', value: '4 Outward Clasps' }
      ]
    },
    {
      id: 'story-4',
      step: '04',
      scene: 'Scene 4 — ALL IN THE DETAILS',
      title: 'Thoughtful engineering. Simple everyday use.',
      subtitle: 'Aluminized steel, rounded corners, 1-inch alignment guides.',
      body: 'Zoom into the aluminized steel, rounded corners, shallow 1-inch alignment markings, metal toggle clasps, removable cupcake insert, and adjustable partitions. Honest, heirloom industrial design built to outlast traditional pans.',
      badge: 'Precision Industrial Design',
      config: 'assembled',
      stats: [
        { label: 'Total Clasps', value: 'Exactly 6 Clasps' },
        { label: 'Alignment Marks', value: '1-Inch Spaced' },
        { label: 'Sheet Thickness', value: '0.9 mm Gauge' }
      ]
    },
    {
      id: 'story-5',
      step: '05',
      scene: 'Scene 5 — BAKE MORE WITH LESS',
      title: 'BAKE MORE WITH LESS.',
      subtitle: 'Cupcakes, square cakes, custom rectangles, and artisan loaves.',
      body: 'A cinematic gallery of cupcakes, cake, and loaf configurations. Finish with the full BAKESHIFT pan. Replace five bulky single-purpose tins with one heirloom culinary kit.',
      badge: '70% Cabinet Space Saved',
      config: 'assembled',
      stats: [
        { label: 'Replaces', value: '5+ Bulky Tins' },
        { label: 'Cabinet Savings', value: 'Over 70% Space' },
        { label: 'Complete System', value: '$47.00 Fixed' }
      ]
    }
  ];

  const TECHNICAL_SPECS = {
    general: [
      { label: 'Product Name', value: 'BAKESHIFT Complete Baking System' },
      { label: 'Retail Price', value: '$47.00 USD (Complete Kit)' },
      { label: 'Official Slogan', value: 'BAKE MORE WITH LESS.' },
      { label: 'Pan Architecture', value: 'Modular baking system with removable 6-cup tray & 2 adjustable partitions' }
    ],
    dimensions: [
      { label: 'Main Base Pan (Exterior)', value: '15.0" L × 10.0" W × 2.0" H (381 × 254 × 50.8 mm)' },
      { label: 'Main Base Pan (Interior Usable)', value: '13.2" L × 9.0" W × 1.9" H (335.3 × 228.6 × 48.3 mm)' },
      { label: 'Base Pan Design', value: 'Rounded corners, flat bottom, 2 integrated short-side handles, metallic silver finish' },
      { label: 'Alignment Guide Marks', value: '1-inch spacing along both long rims; ~2 mm wide × ~0.3 mm deep shallow marks (not drilled holes)' },
      { label: 'Removable Cupcake Tray', value: '6.25" × 8.70" (158.7 × 221 mm) provisional footprint; sits at left end of pan' },
      { label: 'Cupcake Wells Arrangement', value: 'EXACTLY SIX CUPS arranged in 2 COLUMNS × 3 ROWS' },
      { label: 'Cup Dimensions', value: 'Top diameter: ~2.3" (58 mm); Bottom diameter: ~1.75" (44 mm); Depth: ~1.25" (32 mm); Center spacing: ~2.45" (62 mm); Rim: 0.75" (19 mm)' },
      { label: 'Adjustable Partitions (Qty 2)', value: '8.9" L × 1.65" H (226 × 41.9 mm); ~0.9 mm sheet-metal thickness; plain metallic aluminized steel' },
      { label: 'Silicone / Rubber Components', value: 'ZERO. Absolutely NO silicone grips, rubber sleeves, or teal components' },
      { label: 'Toggle Clasps (Qty 6 Total)', value: '2 on cupcake tray + 4 on the 2 partitions (1 clasp at each end, facing OUTWARD to rim). No extra clasps on pan corners' }
    ],
    weights: [
      { component: 'Main Base Pan (15 × 10 × 2 in)', imperial: '1.25 lb', metric: '567 g', status: 'Estimated' },
      { component: 'Removable Cupcake Tray (2 × 3 insert)', imperial: '0.85 lb', metric: '386 g', status: 'Estimated' },
      { component: 'Adjustable Partitions (Qty 2, 0.35 lb each)', imperial: '0.70 lb total (0.35 lb each)', metric: '318 g total (159 g each)', status: 'Estimated' },
      { component: 'Toggle Clasps (Qty 6, 0.05 lb each)', imperial: '0.30 lb total (0.05 lb each)', metric: '136 g total (23 g each)', status: 'Estimated' },
      { component: 'Estimated Combined System Weight', imperial: '3.10 lb', metric: '1.41 kg', status: 'Estimated' }
    ],
    materials: [
      { label: 'Base Pan & Cupcake Tray', value: 'Commercial Heavy-Gauge Aluminized Steel (sheet steel hot-dip coated on both sides with an aluminum-silicon alloy)' },
      { label: 'Partitions (Qty 2)', value: 'Bare metallic Aluminized Steel (No silicone grips, no synthetic coatings, plain metallic finish)' },
      { label: 'Toggle Clasps (Qty 6)', value: 'AISI 304 Stainless Steel wire toggle bails with copper mounting accents' },
      { label: 'Thermal Performance', value: 'Safe up to 450°F / 232°C. Excellent thermal conductivity and warp resistance' },
      { label: 'Safety & Metallurgy', value: '100% PTFE/PFOA/PFAS-free. Non-toxic heirloom metallurgy' }
    ],
    care: [
      { label: 'Washing Instructions', value: 'Hand wash with mild soap and warm water; dry thoroughly to preserve aluminized luster' },
      { label: 'Utensil Compatibility', value: 'Wood, silicone, or nylon utensils recommended to protect metallic finish' },
      { label: 'Batter Recommendation', value: 'Engineered for cake batters, brownie doughs, bread loaves, and roasting. For thin, watery liquids (e.g. custards), line the partition seam with parchment paper.' }
    ]
  };

  const FAQS = [
    {
      q: 'What are the exact dimensions and specifications of the BAKESHIFT pan?',
      a: 'The exterior of the base pan measures 15 inches long by 10 inches wide by 2 inches deep (381 × 254 × 50.8 mm). The interior usable space is 13.2 × 9.0 inches. The removable cupcake tray footprint is 6.25 × 8.70 inches, and each partition measures 8.9 inches long by 1.65 inches high with ~0.9 mm sheet thickness.'
    },
    {
      q: 'Why does the cupcake tray have exactly six cups instead of twelve?',
      a: 'BAKESHIFT is designed around real baking versatility. The 2-column by 3-row layout provides six standard-sized cupcakes (2.3" top diameter), ideal for small batches, everyday baking, and portion control without wasting batter. It occupies the left end of the pan, leaving the remaining section free for a companion bake.'
    },
    {
      q: 'How many toggle clasps are there, and where are they located?',
      a: 'There are exactly six toggle clasps in the entire system: two attached to the opposing short ends of the removable cupcake tray, and four attached to the two adjustable partitions (one at each end). All partition clasps face OUTWARD toward the exterior of the pan and clamp onto the rim. There are no clasps on random pan corners.'
    },
    {
      q: 'Are there any silicone parts or grip bands on the partitions?',
      a: 'No. There are ABSOLUTELY ZERO silicone grips, rubber sleeves, or teal plastic components. BAKESHIFT partitions are pure commercial-grade aluminized steel with stainless wire toggle clasps. Silicone degrades and absorbs odors over time; solid metal lasts for decades.'
    },
    {
      q: 'What are the shallow marks along the pan rim?',
      a: 'They are shallow laser alignment guide marks spaced 1 inch apart (approximately 2 mm wide and 0.3 mm deep). They are NOT drilled holes. Their purpose is to assist you in aligning the adjustable partitions squarely and parallel to configure exact 9×9" square cakes or 5×9" loaves.'
    },
    {
      q: 'Are the adjustable partitions liquid-tight for thin batters?',
      a: 'The partitions are precision-machined to seat flush against the flat pan bottom and sidewalls, making them ideal for cake batters, brownie mixes, bread doughs, and vegetable roasting. For thin, watery mixtures (such as custards or flans), we recommend lining the divider junction with parchment paper.'
    },
    {
      q: 'What is the retail price and what is included in the box?',
      a: 'The final retail price is $47.00 USD for the complete kit. The package includes: (1) aluminized-steel base pan (15×10×2 in), (1) removable six-cup cupcake tray (2×3 grid), (2) adjustable bare-metal partitions, (6) mounted toggle clasps, and a quick-start configuration guide.'
    },
    {
      q: 'Is this website ready to process customer orders?',
      a: 'This website is an interactive product preview for investors, manufacturing partners, and early culinary enthusiasts. Online purchasing is launching soon. No personal information or payments are collected or processed at this time.'
    }
  ];

  const COMPANY_STORY = {
    mission: 'BAKE MORE WITH LESS.',
    foundingStory: `The modern kitchen cabinet problem is universal: stacks of warped pans, mismatched 8-inch squares, dusty 12-cup muffin tins that get used twice a year, and heavy loaf pans tumbling out every time you open the cupboard door.

BAKESHIFT was born from a fundamental culinary question: Why must every baking shape require an entirely separate piece of metal?

We engineered a modular baking pan system that delivers the rigid, professional thermal performance of commercial bakery pans while adapting to any recipe. By utilizing industrial aluminized steel, lunch-box-style wire toggle tensioners, and 1-inch rim alignment marks, BAKESHIFT consolidates five single-purpose pans into one space-saving powerhouse.

BAKESHIFT is not a gimmick coated with fragile non-stick chemicals. It is heirloom-grade culinary engineering designed to help you bake more while owning less.`,
    pillars: [
      {
        title: 'Heirloom Metallurgy',
        text: 'Commercial aluminized steel provides superior thermal conductivity and magnetic rigidity with zero warping under high oven heat.'
      },
      {
        title: 'Pure Mechanical Tension',
        text: 'No silicone seals to degrade or melt. Stainless steel wire toggle clasps provide reliable, physical clamping force against the rim.'
      },
      {
        title: '70% Space Reclamation',
        text: 'Replaces 5 bulky pans with a single 2-inch slim profile that slides neatly into any cabinet or drawer.'
      },
      {
        title: 'Mindful Consumption',
        text: 'Less metal extracted, less packaging manufactured, and one pan designed to outlive a lifetime of ovens.'
      }
    ]
  };

  // ==========================================
  // 2. SHOPPING CART STATE CONTROLLER
  // ==========================================
  class BakeShiftCart {
    constructor() {
      this.storageKey = 'bakeshift_cart_v2';
      this.items = [];
      this.listeners = [];
      this.drawerOpen = false;
      this.load();
    }

    load() {
      try {
        const stored = localStorage.getItem(this.storageKey);
        const parsed = stored ? JSON.parse(stored) : [];
        this.items = Array.isArray(parsed) ? parsed : [];
        this.items.forEach(item => {
          if (item.id === BAKESHIFT_PRODUCT.id || item.price !== BAKESHIFT_PRODUCT.price) {
            item.price = BAKESHIFT_PRODUCT.price;
          }
        });
      } catch (e) {
        this.items = [];
      }
    }

    save() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      } catch (e) {
        console.error('BakeShift: Failed to persist cart to localStorage', e);
      }
      this.notify();
    }

    subscribe(listener) {
      if (typeof listener === 'function') {
        this.listeners.push(listener);
      }
    }

    notify() {
      const state = this.getState();
      this.listeners.forEach(fn => fn(state));
    }

    getState() {
      const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
      const subtotalRaw = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const subtotal = Math.round(subtotalRaw * 100) / 100;
      const shipping = totalCount > 0 ? 2.00 : 0.00;
      const taxRate = 0.0825;
      const tax = totalCount > 0 ? Math.round(subtotal * taxRate * 100) / 100 : 0.00;
      const total = totalCount > 0 ? Math.round((subtotal + shipping + tax) * 100) / 100 : 0.00;

      return {
        items: [...this.items],
        totalCount,
        subtotal,
        subtotalFormatted: `$${subtotal.toFixed(2)}`,
        shipping,
        shippingFormatted: `$${shipping.toFixed(2)}`,
        taxRate,
        taxRateFormatted: '8.25%',
        tax,
        taxFormatted: `$${tax.toFixed(2)}`,
        total,
        totalFormatted: `$${total.toFixed(2)}`,
        drawerOpen: this.drawerOpen
      };
    }

    addItem(product = BAKESHIFT_PRODUCT, quantity = 1, openDrawer = true) {
      const qty = parseInt(quantity, 10) || 1;
      const existing = this.items.find(i => i.id === product.id);

      if (existing) {
        existing.quantity += qty;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: 'assets/images/bakeshift-assembled-hero.jpg'
        });
      }

      if (openDrawer) {
        this.drawerOpen = true;
      }
      this.save();
    }

    removeItem(productId) {
      this.items = this.items.filter(i => i.id !== productId);
      this.save();
    }

    incrementQuantity(productId) {
      const item = this.items.find(i => i.id === productId);
      if (item) {
        item.quantity++;
        this.save();
      }
    }

    decrementQuantity(productId) {
      const item = this.items.find(i => i.id === productId);
      if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
          this.removeItem(productId);
        } else {
          this.save();
        }
      }
    }

    openDrawer() {
      this.drawerOpen = true;
      this.notify();
    }

    closeDrawer() {
      this.drawerOpen = false;
      this.notify();
    }
  }

  const cart = new BakeShiftCart();

  // ==========================================
  // 3. BAKESHIFT 3D WEBGL VIEWER
  // ==========================================
  class BakeShift3DViewer {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this.container) {
        console.error('BakeShift3DViewer: Container not found');
        return;
      }
  
      this.options = Object.assign({
        interactive: true,
        autoRotate: false,
        initialConfig: 'assembled',
        showDimensions: false,
        enableExploded: false,
        explodedFactor: 0,
        claspsLocked: true,
        introAnimation: true,
        onConfigChange: null,
        onPartSelect: null,
        cameraPreset: 'isometric'
      }, options);
  
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.panGroup = null;
  
      // Component references
      this.basePan = null;
      this.cupcakeTray = null;
      this.cupcakes = [];
      this.partition1 = null;
      this.partition2 = null;
      this.clasps = [];
      this.dimensionLines = null;
      this.explodedLines = null;
      this.zoneMesh = null;
      this.hudEl = null;
  
      // Animation & transform state
      this.currentConfig = this.options.initialConfig;
      this.targetPositions = {};
      this.currentPositions = {};
      this.targetCamera = { x: 14.5, y: 12.5, z: 17.5 };
      this.targetLookAt = { x: 0, y: 0.8, z: 0 };
      this.claspsLocked = this.options.claspsLocked;
      this.explodedFactor = this.options.explodedFactor;
      this.targetExplodedFactor = this.options.explodedFactor;
      this.showDimensions = this.options.showDimensions;
  
      // Drag & interaction state
      this.isDragging = false;
      this.activeDragPart = null; // 'partition1' or 'partition2'
      this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.0);
      this.dragPlaneIntersect = new THREE.Vector3();
      this.dragOffset = 0;
  
      this.clock = new THREE.Clock();
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
  
      this.init();
    }
  
    init() {
      const width = this.container.clientWidth || 800;
      const height = this.container.clientHeight || 520;
  
      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xFAF9F6); // Studio warm white canvas
  
      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      if (this.options.introAnimation) {
        this.camera.position.set(20, 18, 22);
      } else {
        this.camera.position.set(14.5, 12.5, 17.5);
      }
  
      // 3. Renderer with high dynamic range settings
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.08;
      this.container.appendChild(this.renderer.domElement);
  
      // 4. OrbitControls
      if (this.options.interactive && OrbitControls) {
        this.controls = new (typeof OrbitControls !== "undefined" ? OrbitControls : (THREE.OrbitControls || window.OrbitControls))(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.02; // Keep slightly above studio horizon
        this.controls.minDistance = 6;
        this.controls.maxDistance = 38;
        this.controls.target.set(0, 0.8, 0);
        this.controls.autoRotate = this.options.autoRotate;
        this.controls.autoRotateSpeed = 0.8;
      }
  
      // 5. Lighting & Materials
      this.setupLighting();
      this.setupMaterials();
  
      // 6. Build Geometry
      this.buildModel();
      this.setupGround();
      this.createHoverHUD();
  
      // 7. Event Listeners
      this.isDestroyed = false;
      this.animationFrameId = null;
      this.resizeHandler = this.onWindowResize.bind(this);
      window.addEventListener('resize', this.resizeHandler);
      const dom = this.renderer.domElement;
      dom.addEventListener('pointerdown', this.onPointerDown.bind(this));
      dom.addEventListener('pointermove', this.onPointerMove.bind(this));
      this.pointerUpHandler = this.onPointerUp.bind(this);
      window.addEventListener('pointerup', this.pointerUpHandler);
  
      // 8. Apply Initial Configuration
      this.applyConfiguration(this.currentConfig, false);
  
      // 9. Animation Loop
      this.animate();
    }
  
    setupLighting() {
      // Ambient fill
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
      this.scene.add(ambientLight);
  
      // Warm Key Light (mimics Apple studio spotlight from top-right)
      const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.5);
      keyLight.position.set(14, 22, 16);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 60;
      keyLight.shadow.camera.left = -16;
      keyLight.shadow.camera.right = 16;
      keyLight.shadow.camera.top = 16;
      keyLight.shadow.camera.bottom = -16;
      keyLight.shadow.bias = -0.0004;
      keyLight.shadow.radius = 2.5;
      this.scene.add(keyLight);
  
      // Cool Fill Light (subtle ambient reflection from back-left)
      const fillLight = new THREE.DirectionalLight(0xecf3ff, 1.4);
      fillLight.position.set(-16, 14, -12);
      this.scene.add(fillLight);
  
      // Specular Rim Light (glints off metallic rim flange and clasps)
      const rimLight = new THREE.DirectionalLight(0xfff0e4, 1.8);
      rimLight.position.set(2, 16, -18);
      this.scene.add(rimLight);
  
      // Front low bounce light
      const frontBounce = new THREE.DirectionalLight(0xffffff, 0.65);
      frontBounce.position.set(0, 4, 18);
      this.scene.add(frontBounce);
  
      // Under-floor subtle bounce
      const groundBounce = new THREE.DirectionalLight(0xfaf9f6, 0.45);
      groundBounce.position.set(0, -10, 0);
      this.scene.add(groundBounce);
    }
  
    setupMaterials() {
      // Procedural Brushed Metal Noise Texture
      const brushedTex = this.createBrushedNoiseTexture();
  
      // 1. Commercial Heavy-Gauge Aluminized Steel (Base pan exterior, handles, rolled lips)
      this.matAluminizedSteel = new THREE.MeshStandardMaterial({
        color: 0xE8EAED,
        metalness: 0.90,
        roughness: 0.28,
        roughnessMap: brushedTex,
        envMapIntensity: 1.25
      });
  
      // Interior shaded steel
      this.matAluminizedSteelInterior = new THREE.MeshStandardMaterial({
        color: 0xCFD2D6,
        metalness: 0.88,
        roughness: 0.32,
        roughnessMap: brushedTex,
        envMapIntensity: 1.1
      });
  
      // 2. High-Polish AISI 304 Stainless Steel (Wire bail loops, toggle latch levers)
      this.matStainlessWire = new THREE.MeshStandardMaterial({
        color: 0xF5F7FA,
        metalness: 0.98,
        roughness: 0.12,
        envMapIntensity: 1.4
      });
  
      // 3. Signature Culinary Copper Accents & Hinge Brackets (#A96543 brand accent)
      this.matCopper = new THREE.MeshStandardMaterial({
        color: 0xB66A3D,
        metalness: 0.94,
        roughness: 0.22,
        envMapIntensity: 1.3
      });
  
      // 4. Laser Alignment Notches (Shallow recessed marks along rim flange)
      this.matGuideMark = new THREE.MeshStandardMaterial({
        color: 0x585B60,
        metalness: 0.8,
        roughness: 0.5
      });
  
      // 5. Golden Baked Cupcake / Muffin Tops
      this.matCupcakeTop = new THREE.MeshStandardMaterial({
        color: 0xC8863A,
        roughness: 0.82,
        metalness: 0.04
      });
  
      // Cupcake fluted liner
      this.matCupcakeLiner = new THREE.MeshStandardMaterial({
        color: 0xF5EDE0,
        roughness: 0.72,
        metalness: 0.02
      });
  
      // 6. Glowing Conceptual Baking Zone Highlight
      this.matZoneHighlight = new THREE.MeshStandardMaterial({
        color: 0xA96543,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
        roughness: 0.35,
        metalness: 0.1
      });
  
      // 7. Interactive Hover Highlight Material
      this.matPartitionHover = new THREE.MeshStandardMaterial({
        color: 0xF0F2F5,
        metalness: 0.92,
        roughness: 0.22,
        emissive: 0x221810,
        emissiveIntensity: 0.2
      });
    }
  
    createBrushedNoiseTexture() {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#CCCCCC';
      ctx.fillRect(0, 0, size, size);
  
      // Draw horizontal anisotropic streak lines
      for (let i = 0; i < 22000; i++) {
        const y = Math.random() * size;
        const x = Math.random() * size;
        const len = 25 + Math.random() * 85;
        const alpha = 0.03 + Math.random() * 0.07;
        const shade = Math.random() > 0.45 ? 255 : 100;
        ctx.strokeStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
        ctx.lineWidth = 0.6 + Math.random() * 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + len, y);
        ctx.stroke();
      }
  
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      return tex;
    }
  
    setupGround() {
      // Soft studio shadow contact disc
      const groundGeo = new THREE.PlaneGeometry(64, 64);
      const groundMat = new THREE.ShadowMaterial({ opacity: 0.22 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.01;
      ground.receiveShadow = true;
      this.scene.add(ground);
  
      // Ambient radial vignette beneath pan
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const sctx = shadowCanvas.getContext('2d');
      const grad = sctx.createRadialGradient(128, 128, 40, 128, 128, 128);
      grad.addColorStop(0, 'rgba(30, 20, 15, 0.28)');
      grad.addColorStop(0.5, 'rgba(40, 30, 25, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 256, 256);
  
      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(18, 13),
        new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.65 })
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0.005;
      this.scene.add(shadowPlane);
    }
  
    createHoverHUD() {
      this.hudEl = document.createElement('div');
      this.hudEl.className = 'bakeshift-3d-hud';
      this.hudEl.style.cssText = `
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        background: rgba(29, 29, 31, 0.88);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        color: #FFFFFF;
        padding: 7px 18px;
        border-radius: 999px;
        font-family: -apple-system, BlinkMacSystemFont, "Geist", "Inter", sans-serif;
        font-size: 0.82rem;
        font-weight: 500;
        letter-spacing: -0.01em;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 6px 24px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.12);
        z-index: 10;
        display: flex;
        align-items: center;
        gap: 10px;
        white-space: nowrap;
      `;
      this.container.style.position = 'relative';
      this.container.appendChild(this.hudEl);
    }
  
    showHUD(title, spec = '', hint = '') {
      if (!this.hudEl) return;
      this.hudEl.innerHTML = `
        <span style="width: 7px; height: 7px; border-radius: 50%; background: #C98B69; flex-shrink: 0;"></span>
        <strong>${title}</strong>
        ${spec ? `<span style="opacity: 0.7; font-weight: 400;">· ${spec}</span>` : ''}
        ${hint ? `<span style="color: #FFD0CB; font-size: 0.75rem;">(${hint})</span>` : ''}
      `;
      this.hudEl.style.opacity = '1';
      this.hudEl.style.transform = 'translateX(-50%) translateY(0)';
    }
  
    hideHUD() {
      if (!this.hudEl) return;
      this.hudEl.style.opacity = '0';
      this.hudEl.style.transform = 'translateX(-50%) translateY(10px)';
    }
  
    buildModel() {
      this.panGroup = new THREE.Group();
      this.scene.add(this.panGroup);
  
      // ==========================================
      // 1. MAIN BASE PAN (15" × 10" × 2")
      // Rounded exterior corners, rolled perimeter flange,
      // side handles, 1-inch spaced alignment notches
      // ==========================================
      this.basePan = new THREE.Group();
      this.basePan.name = 'BasePan';
      this.basePan.userData = {
        title: 'Base Baking Pan',
        spec: '15" × 10" × 2" (381 × 254 × 50.8 mm)',
        hint: 'Heavy-Gauge Aluminized Steel'
      };
      this.panGroup.add(this.basePan);
  
      const panL = 15.0; // X length
      const panW = 10.0; // Z width
      const panH = 2.0;  // Y height
      const wallThick = 0.18;
      const rimFlangeW = 0.42;
  
      // Floor interior sheet
      const floorGeo = new THREE.BoxGeometry(panL - 1.6, 0.12, panW - 1.6);
      const floorMesh = new THREE.Mesh(floorGeo, this.matAluminizedSteelInterior);
      floorMesh.position.set(0, 0.06, 0);
      floorMesh.receiveShadow = true;
      this.basePan.add(floorMesh);
  
      // Underside bottom plate
      const underGeo = new THREE.BoxGeometry(panL - 0.4, 0.06, panW - 0.4);
      const underMesh = new THREE.Mesh(underGeo, this.matAluminizedSteel);
      underMesh.position.set(0, 0.03, 0);
      underMesh.receiveShadow = true;
      this.basePan.add(underMesh);
  
      // Four Sidewalls
      const frontWallZ = (panW / 2) - (wallThick / 2);
      const backWallZ = -(panW / 2) + (wallThick / 2);
      const rightWallX = (panL / 2) - (wallThick / 2);
      const leftWallX = -(panL / 2) + (wallThick / 2);
  
      // Front & Back long sidewalls
      const longWallGeo = new THREE.BoxGeometry(panL - 1.2, panH, wallThick);
      const frontWall = new THREE.Mesh(longWallGeo, this.matAluminizedSteel);
      frontWall.position.set(0, panH / 2, frontWallZ);
      frontWall.castShadow = true;
      frontWall.receiveShadow = true;
      this.basePan.add(frontWall);
  
      const backWall = new THREE.Mesh(longWallGeo, this.matAluminizedSteel);
      backWall.position.set(0, panH / 2, backWallZ);
      backWall.castShadow = true;
      backWall.receiveShadow = true;
      this.basePan.add(backWall);
  
      // Left & Right short sidewalls
      const shortWallGeo = new THREE.BoxGeometry(wallThick, panH, panW - 1.2);
      const rightWall = new THREE.Mesh(shortWallGeo, this.matAluminizedSteel);
      rightWall.position.set(rightWallX, panH / 2, 0);
      rightWall.castShadow = true;
      rightWall.receiveShadow = true;
      this.basePan.add(rightWall);
  
      const leftWall = new THREE.Mesh(shortWallGeo, this.matAluminizedSteel);
      leftWall.position.set(leftWallX, panH / 2, 0);
      leftWall.castShadow = true;
      leftWall.receiveShadow = true;
      this.basePan.add(leftWall);
  
      // 4 Smooth Rounded Wall Corners (Quadrant Cylinders)
      const cornerR = 0.65;
      const cornerGeo = new THREE.CylinderGeometry(cornerR, cornerR, panH, 16, 1, false, 0, Math.PI / 2);
      const cOffsets = [
        { x: rightWallX - cornerR + wallThick, z: frontWallZ - cornerR + wallThick, rot: 0 },
        { x: leftWallX + cornerR - wallThick, z: frontWallZ - cornerR + wallThick, rot: Math.PI / 2 },
        { x: leftWallX + cornerR - wallThick, z: backWallZ + cornerR - wallThick, rot: Math.PI },
        { x: rightWallX - cornerR + wallThick, z: backWallZ + cornerR - wallThick, rot: -Math.PI / 2 }
      ];
      cOffsets.forEach(c => {
        const cornerMesh = new THREE.Mesh(cornerGeo, this.matAluminizedSteel);
        cornerMesh.position.set(c.x, panH / 2, c.z);
        cornerMesh.rotation.y = c.rot;
        cornerMesh.castShadow = true;
        this.basePan.add(cornerMesh);
      });
  
      // Top Perimeter Rim Flange (Flat horizontal stamping)
      const rimFrontGeo = new THREE.BoxGeometry(panL, 0.08, rimFlangeW);
      const rimFront = new THREE.Mesh(rimFrontGeo, this.matAluminizedSteel);
      rimFront.position.set(0, panH + 0.04, frontWallZ + 0.1);
      this.basePan.add(rimFront);
  
      const rimBack = new THREE.Mesh(rimFrontGeo, this.matAluminizedSteel);
      rimBack.position.set(0, panH + 0.04, backWallZ - 0.1);
      this.basePan.add(rimBack);
  
      const rimSideGeo = new THREE.BoxGeometry(rimFlangeW, 0.08, panW - 0.2);
      const rimRight = new THREE.Mesh(rimSideGeo, this.matAluminizedSteel);
      rimRight.position.set(rightWallX + 0.1, panH + 0.04, 0);
      this.basePan.add(rimRight);
  
      const rimLeft = new THREE.Mesh(rimSideGeo, this.matAluminizedSteel);
      rimLeft.position.set(leftWallX - 0.1, panH + 0.04, 0);
      this.basePan.add(rimLeft);
  
      // Rolled Outer Wire Bead (Smooth round outer edge along rim perimeter)
      const rolledBeadMat = this.matAluminizedSteel;
      const beadRadius = 0.08;
      const beadLongGeo = new THREE.CylinderGeometry(beadRadius, beadRadius, panL + 0.1, 16);
  
      const beadFront = new THREE.Mesh(beadLongGeo, rolledBeadMat);
      beadFront.rotation.z = Math.PI / 2;
      beadFront.position.set(0, panH + 0.04, frontWallZ + rimFlangeW);
      this.basePan.add(beadFront);
  
      const beadBack = new THREE.Mesh(beadLongGeo, rolledBeadMat);
      beadBack.rotation.z = Math.PI / 2;
      beadBack.position.set(0, panH + 0.04, backWallZ - rimFlangeW);
      this.basePan.add(beadBack);
  
      const beadShortGeo = new THREE.CylinderGeometry(beadRadius, beadRadius, panW + 0.1, 16);
      const beadRight = new THREE.Mesh(beadShortGeo, rolledBeadMat);
      beadRight.rotation.x = Math.PI / 2;
      beadRight.position.set(rightWallX + rimFlangeW, panH + 0.04, 0);
      this.basePan.add(beadRight);
  
      const beadLeft = new THREE.Mesh(beadShortGeo, rolledBeadMat);
      beadLeft.rotation.x = Math.PI / 2;
      beadLeft.position.set(leftWallX - rimFlangeW, panH + 0.04, 0);
      this.basePan.add(beadLeft);
  
      // Two Sturdy Ergonomic Side Handles (Short Ends)
      this.createErgonomicHandle(leftWallX - 0.1, true);
      this.createErgonomicHandle(rightWallX + 0.1, false);
  
      // 1-Inch Spaced Rim Alignment Notches (Shallow square depressions, no holes)
      this.createRimAlignmentNotches(frontWallZ + 0.1, backWallZ - 0.1, panH + 0.08);
  
      // ==========================================
      // 2. REMOVABLE CUPCAKE TRAY (6.25" × 8.70")
      // EXACTLY 6 WELLS — 2 COLUMNS × 3 ROWS
      // Sits at the left end of the pan, with 2 clasps clamping on front & back rims
      // ==========================================
      this.cupcakeTray = new THREE.Group();
      this.cupcakeTray.name = 'CupcakeTray';
      this.cupcakeTray.userData = {
        title: 'Removable Cupcake Tray',
        spec: '6 Muffin Wells (2 Columns × 3 Rows)',
        hint: 'Aluminized Steel · 2 Toggle Clasps'
      };
      this.panGroup.add(this.cupcakeTray);
  
      const trayL = 6.2;
      const trayW = 8.8;
  
      // Tray Top Deck Sheet
      const trayDeckGeo = new THREE.BoxGeometry(trayL, 0.08, trayW);
      const trayDeck = new THREE.Mesh(trayDeckGeo, this.matAluminizedSteel);
      trayDeck.position.set(0, 1.88, 0);
      trayDeck.castShadow = true;
      trayDeck.receiveShadow = true;
      this.cupcakeTray.add(trayDeck);
  
      // Downturned Perimeter Drop Lip
      const trayLipFrontGeo = new THREE.BoxGeometry(trayL, 0.35, 0.08);
      const trayLipFront = new THREE.Mesh(trayLipFrontGeo, this.matAluminizedSteelInterior);
      trayLipFront.position.set(0, 1.70, trayW / 2 - 0.04);
      this.cupcakeTray.add(trayLipFront);
  
      const trayLipBack = new THREE.Mesh(trayLipFrontGeo, this.matAluminizedSteelInterior);
      trayLipBack.position.set(0, 1.70, -trayW / 2 + 0.04);
      this.cupcakeTray.add(trayLipBack);
  
      // EXACTLY 6 CUPCAKE WELLS: 2 columns in X × 3 rows in Z
      const colSpacing = 2.65;
      const rowSpacing = 2.65;
      const xOffsets = [-colSpacing / 2, colSpacing / 2]; // 2 columns
      const zOffsets = [-rowSpacing, 0, rowSpacing];       // 3 rows
  
      xOffsets.forEach((ox) => {
        zOffsets.forEach((oz) => {
          // Tapered Well Cone
          const wellGeo = new THREE.CylinderGeometry(1.08, 0.82, 1.62, 32, 1, true);
          const wellMesh = new THREE.Mesh(wellGeo, this.matAluminizedSteelInterior);
          wellMesh.position.set(ox, 1.05, oz);
          wellMesh.castShadow = true;
          wellMesh.receiveShadow = true;
          this.cupcakeTray.add(wellMesh);
  
          // Well Bottom Disc
          const bottomGeo = new THREE.CircleGeometry(0.82, 32);
          const bottomMesh = new THREE.Mesh(bottomGeo, this.matAluminizedSteelInterior);
          bottomMesh.rotation.x = -Math.PI / 2;
          bottomMesh.position.set(ox, 0.24, oz);
          this.cupcakeTray.add(bottomMesh);
  
          // Deck Rolled Beveled Flange
          const ringGeo = new THREE.TorusGeometry(1.10, 0.04, 12, 32);
          const ringMesh = new THREE.Mesh(ringGeo, this.matAluminizedSteel);
          ringMesh.rotation.x = Math.PI / 2;
          ringMesh.position.set(ox, 1.89, oz);
          this.cupcakeTray.add(ringMesh);
  
          // Golden baked cupcake insert (toggled in cupcake config)
          const cupcakeGroup = new THREE.Group();
          cupcakeGroup.position.set(ox, 1.15, oz);
  
          const linerGeo = new THREE.CylinderGeometry(1.05, 0.80, 1.45, 24);
          const linerMesh = new THREE.Mesh(linerGeo, this.matCupcakeLiner);
          cupcakeGroup.add(linerMesh);
  
          const domeGeo = new THREE.SphereGeometry(1.18, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.15);
          const domeMesh = new THREE.Mesh(domeGeo, this.matCupcakeTop);
          domeMesh.position.y = 0.72;
          domeMesh.scale.set(1.0, 0.52, 1.0);
          domeMesh.castShadow = true;
          cupcakeGroup.add(domeMesh);
  
          cupcakeGroup.visible = false;
          this.cupcakeTray.add(cupcakeGroup);
          this.cupcakes.push(cupcakeGroup);
        });
      });
  
      // 2 PROMINENT TOGGLE CLASPS ON CUPCAKE TRAY
      // Clamping over the front and rear pan rims
      const claspTrayFront = this.createWireToggleClasp(0, 1.95, trayW / 2 + 0.32, 0, 'CupcakeTray', 'tray_front');
      this.cupcakeTray.add(claspTrayFront.group);
      this.clasps.push(claspTrayFront);
  
      const claspTrayRear = this.createWireToggleClasp(0, 1.95, -trayW / 2 - 0.32, Math.PI, 'CupcakeTray', 'tray_rear');
      this.cupcakeTray.add(claspTrayRear.group);
      this.clasps.push(claspTrayRear);
  
      this.cupcakeTray.position.set(-3.75, 0.12, 0);
  
      // ==========================================
      // 3. TWO ADJUSTABLE PARTITIONS (8.9" × 1.65")
      // Bare metal dividers with rolled top lips and 2 clasps each
      // ==========================================
      this.partition1 = this.createPartition('Partition1', 'Adjustable Partition 1', 'p1');
      this.partition2 = this.createPartition('Partition2', 'Adjustable Partition 2', 'p2');
  
      this.panGroup.add(this.partition1.group);
      this.panGroup.add(this.partition2.group);
  
      // Default positions (matching the reference render)
      this.partition1.group.position.set(0.2, 0.12, 0);
      this.partition2.group.position.set(4.2, 0.12, 0);
  
      // Store target & current transforms
      this.targetPositions = {
        basePan: { x: 0, y: 0, z: 0 },
        cupcakeTray: { x: -3.75, y: 0.12, z: 0 },
        partition1: { x: 0.2, y: 0.12, z: 0 },
        partition2: { x: 4.2, y: 0.12, z: 0 }
      };
  
      this.currentPositions = {
        basePan: { x: 0, y: 0, z: 0 },
        cupcakeTray: { x: -3.75, y: 0.12, z: 0 },
        partition1: { x: 0.2, y: 0.12, z: 0 },
        partition2: { x: 4.2, y: 0.12, z: 0 }
      };
  
      // Baking zone visual highlight
      this.buildZoneMesh();
  
      // Dimension lines
      this.buildDimensionAnnotations();
  
      // Exploded guides
      this.buildExplodedGuides();
    }
  
    createErgonomicHandle(xPos, isLeft) {
      const handleGroup = new THREE.Group();
      handleGroup.position.set(xPos, 1.35, 0);
      handleGroup.userData = {
        title: isLeft ? 'Left Side Handle' : 'Right Side Handle',
        spec: 'Heavy-Gauge Aluminized Steel',
        hint: 'Sturdy Ergonomic Grip'
      };
  
      // Sturdy rectangular loop handle with rounded corners
      const shape = new THREE.Shape();
      const hw = 1.7; // half width in Z
      const ext = 1.35; // extension in X
      const th = 0.28; // thickness
  
      shape.moveTo(0, -hw);
      shape.lineTo(isLeft ? -ext : ext, -hw + 0.35);
      shape.quadraticCurveTo(isLeft ? -(ext + 0.2) : (ext + 0.2), 0, isLeft ? -ext : ext, hw - 0.35);
      shape.lineTo(0, hw);
      shape.lineTo(0, hw - th);
      shape.lineTo(isLeft ? -(ext - th) : (ext - th), hw - 0.45);
      shape.quadraticCurveTo(isLeft ? -(ext - th + 0.1) : (ext - th + 0.1), 0, isLeft ? -(ext - th) : (ext - th), -hw + 0.45);
      shape.lineTo(0, -hw + th);
      shape.closePath();
  
      const extrudeSettings = {
        steps: 1,
        depth: 0.32,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 4
      };
  
      const handleGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const handleMesh = new THREE.Mesh(handleGeo, this.matAluminizedSteel);
      handleMesh.rotation.x = Math.PI / 2;
      handleMesh.position.y = 0.16;
      handleMesh.castShadow = true;
      handleGroup.add(handleMesh);
  
      this.basePan.add(handleGroup);
    }
  
    createRimAlignmentNotches(frontZ, backZ, rimY) {
      const marksGroup = new THREE.Group();
      marksGroup.name = 'AlignmentNotches';
  
      // 1-inch spacing along X: from -6.5 to +6.5
      for (let x = -6.5; x <= 6.5; x += 1.0) {
        const notchGeo = new THREE.BoxGeometry(0.12, 0.03, 0.12);
        
        const notchFront = new THREE.Mesh(notchGeo, this.matGuideMark);
        notchFront.position.set(x, rimY, frontZ);
        marksGroup.add(notchFront);
  
        const notchBack = new THREE.Mesh(notchGeo, this.matGuideMark);
        notchBack.position.set(x, rimY, backZ);
        marksGroup.add(notchBack);
      }
  
      // Alignment marks along short ends: Z from -4.0 to +4.0
      for (let z = -4.0; z <= 4.0; z += 1.0) {
        const notchSideGeo = new THREE.BoxGeometry(0.12, 0.03, 0.12);
  
        const notchRight = new THREE.Mesh(notchSideGeo, this.matGuideMark);
        notchRight.position.set(7.35, rimY, z);
        marksGroup.add(notchRight);
  
        const notchLeft = new THREE.Mesh(notchSideGeo, this.matGuideMark);
        notchLeft.position.set(-7.35, rimY, z);
        marksGroup.add(notchLeft);
      }
  
      this.basePan.add(marksGroup);
    }
  
    createPartition(name, title, idPrefix) {
      const group = new THREE.Group();
      group.name = name;
      group.userData = {
        title: title,
        spec: '8.9" × 1.65" · Bare Aluminized Steel',
        hint: 'Drag along 1-inch guides · 2 Clasps',
        isPartition: true,
        partitionId: idPrefix
      };
  
      const partL = 8.8; // Z length
      const partH = 1.72; // Y height
      const partThick = 0.08;
  
      // Main Bare Metal Divider Sheet (NO silicone, plain metallurgy)
      const sheetGeo = new THREE.BoxGeometry(partThick, partH, partL);
      const sheetMesh = new THREE.Mesh(sheetGeo, this.matAluminizedSteel);
      sheetMesh.position.set(0, partH / 2, 0);
      sheetMesh.castShadow = true;
      sheetMesh.receiveShadow = true;
      group.add(sheetMesh);
  
      // Hemmed / Beaded Upper Edge
      const hemGeo = new THREE.CylinderGeometry(0.065, 0.065, partL, 16);
      const hemMesh = new THREE.Mesh(hemGeo, this.matAluminizedSteel);
      hemMesh.rotation.x = Math.PI / 2;
      hemMesh.position.set(0, partH, 0);
      hemMesh.castShadow = true;
      group.add(hemMesh);
  
      // Bottom Precision Guide Bevel
      const baseBevelGeo = new THREE.BoxGeometry(0.12, 0.05, partL - 0.2);
      const baseBevel = new THREE.Mesh(baseBevelGeo, this.matAluminizedSteelInterior);
      baseBevel.position.set(0, 0.025, 0);
      group.add(baseBevel);
  
      // EXACTLY 2 STAINLESS TOGGLE CLASPS AT THE ENDS
      // Clamping outward over the front and rear pan rims
      const claspFront = this.createWireToggleClasp(0, 1.95, partL / 2 + 0.32, 0, title, `${idPrefix}_front`);
      group.add(claspFront.group);
      this.clasps.push(claspFront);
  
      const claspRear = this.createWireToggleClasp(0, 1.95, -partL / 2 - 0.32, Math.PI, title, `${idPrefix}_rear`);
      group.add(claspRear.group);
      this.clasps.push(claspRear);
  
      return { group, sheetMesh, claspFront, claspRear };
    }
  
    /**
     * AUTHENTIC INDUSTRIAL WIRE TOGGLE CLASP
     * Precise 3D assembly matching the user reference image:
     * 1. Copper/bronze mounting bracket with pivot lugs and mounting rivet
     * 2. Formed stainless steel wire bail loop arching over pan rim
     * 3. Stamped stainless toggle lever with curved finger pull tab
     */
    createWireToggleClasp(x, y, z, rotationY, parentName, claspId) {
      const claspGroup = new THREE.Group();
      claspGroup.name = `Clasp_${claspId}`;
      claspGroup.userData = {
        title: 'Stainless Steel Toggle Clasp',
        spec: 'AISI 304 Wire Bail & Copper Mount',
        hint: 'Click to open / close',
        isClasp: true,
        claspId: claspId,
        parentName: parentName
      };
      claspGroup.position.set(x, y, z);
      claspGroup.rotation.y = rotationY;
  
      // 1. COPPER MOUNTING BRACKET
      const bracketGroup = new THREE.Group();
      bracketGroup.name = 'ClaspBracket';
      claspGroup.add(bracketGroup);
  
      // Main copper base block
      const basePlateGeo = new THREE.BoxGeometry(0.48, 0.34, 0.16);
      const basePlate = new THREE.Mesh(basePlateGeo, this.matCopper);
      basePlate.position.set(0, 0, -0.06);
      basePlate.castShadow = true;
      bracketGroup.add(basePlate);
  
      // Top mounting copper rivet
      const rivetGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.08, 16);
      const rivet = new THREE.Mesh(rivetGeo, this.matCopper);
      rivet.position.set(0, 0.19, -0.06);
      bracketGroup.add(rivet);
  
      // Side hinge knuckles
      const earGeo = new THREE.BoxGeometry(0.08, 0.26, 0.22);
      const earLeft = new THREE.Mesh(earGeo, this.matCopper);
      earLeft.position.set(-0.21, -0.02, 0.04);
      bracketGroup.add(earLeft);
  
      const earRight = new THREE.Mesh(earGeo, this.matCopper);
      earRight.position.set(0.21, -0.02, 0.04);
      bracketGroup.add(earRight);
  
      // Stainless axle pin
      const pinGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.52, 16);
      const pin = new THREE.Mesh(pinGeo, this.matStainlessWire);
      pin.rotation.z = Math.PI / 2;
      pin.position.set(0, -0.02, 0.04);
      bracketGroup.add(pin);
  
      // 2. ANIMATED HINGE PIVOT GROUP
      const pivot = new THREE.Group();
      pivot.name = 'ClaspPivot';
      pivot.position.set(0, -0.02, 0.04);
      claspGroup.add(pivot);
  
      // 3. STAINLESS STEEL WIRE BAIL LOOP
      // Rectangular/curved wire bail arching up and over the rim
      const wirePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.18, 0, 0),
        new THREE.Vector3(-0.18, 0.28, 0.08),
        new THREE.Vector3(-0.18, 0.42, 0.16),
        new THREE.Vector3(0, 0.44, 0.18),
        new THREE.Vector3(0.18, 0.42, 0.16),
        new THREE.Vector3(0.18, 0.28, 0.08),
        new THREE.Vector3(0.18, 0, 0)
      ]);
      const wireGeo = new THREE.TubeGeometry(wirePath, 24, 0.028, 8, false);
      const wireBail = new THREE.Mesh(wireGeo, this.matStainlessWire);
      wireBail.castShadow = true;
      pivot.add(wireBail);
  
      // 4. STAMPED STAINLESS TOGGLE LATCH LEVER
      // Hangs down the exterior wall with curved finger grip tab
      const leverGroup = new THREE.Group();
      leverGroup.name = 'ClaspLever';
      pivot.add(leverGroup);
  
      // Main curved lever plate
      const leverGeo = new THREE.BoxGeometry(0.38, 0.62, 0.05);
      const lever = new THREE.Mesh(leverGeo, this.matStainlessWire);
      lever.position.set(0, -0.28, 0.18);
      lever.castShadow = true;
      leverGroup.add(lever);
  
      // Center indentation / rib
      const ribGeo = new THREE.BoxGeometry(0.22, 0.48, 0.04);
      const rib = new THREE.Mesh(ribGeo, this.matAluminizedSteel);
      rib.position.set(0, -0.28, 0.20);
      leverGroup.add(rib);
  
      // Outward-curving finger pull tab at the bottom
      const tabShape = new THREE.Shape();
      tabShape.moveTo(-0.18, 0);
      tabShape.lineTo(0.18, 0);
      tabShape.quadraticCurveTo(0.19, -0.16, 0.16, -0.22);
      tabShape.lineTo(-0.16, -0.22);
      tabShape.quadraticCurveTo(-0.19, -0.16, -0.18, 0);
      const tabGeo = new THREE.ExtrudeGeometry(tabShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 });
      const tab = new THREE.Mesh(tabGeo, this.matStainlessWire);
      tab.position.set(0, -0.56, 0.16);
      tab.rotation.x = -0.32;
      tab.castShadow = true;
      leverGroup.add(tab);
  
      return {
        group: claspGroup,
        pivot: pivot,
        locked: true,
        currentAngle: 0,
        targetAngle: 0,
        id: claspId,
        name: parentName
      };
    }
  
    buildZoneMesh() {
      const zoneGeo = new THREE.PlaneGeometry(9.0, 9.0);
      this.zoneMesh = new THREE.Mesh(zoneGeo, this.matZoneHighlight);
      this.zoneMesh.rotation.x = -Math.PI / 2;
      this.zoneMesh.position.set(0, 0.13, 0);
      this.zoneMesh.visible = false;
      this.panGroup.add(this.zoneMesh);
    }
  
    buildDimensionAnnotations() {
      this.dimensionLines = new THREE.Group();
      this.dimensionLines.name = 'DimensionAnnotations';
  
      const lineMat = new THREE.LineDashedMaterial({
        color: 0xA96543,
        dashSize: 0.35,
        gapSize: 0.18,
        linewidth: 2
      });
  
      // 15-inch Length Line
      const lengthLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-7.5, -0.4, 5.8), new THREE.Vector3(7.5, -0.4, 5.8)]),
        lineMat
      );
      lengthLine.computeLineDistances();
      this.dimensionLines.add(lengthLine);
  
      // 10-inch Width Line
      const widthLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(8.5, -0.4, -5.0), new THREE.Vector3(8.5, -0.4, 5.0)]),
        lineMat
      );
      widthLine.computeLineDistances();
      this.dimensionLines.add(widthLine);
  
      // 2-inch Depth Line
      const depthLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(8.5, 0, 5.8), new THREE.Vector3(8.5, 2.0, 5.8)]),
        lineMat
      );
      depthLine.computeLineDistances();
      this.dimensionLines.add(depthLine);
  
      this.dimensionLines.visible = this.showDimensions;
      this.panGroup.add(this.dimensionLines);
    }
  
    buildExplodedGuides() {
      this.explodedLines = new THREE.Group();
      const guideMat = new THREE.LineDashedMaterial({ color: 0x9DA3A6, dashSize: 0.25, gapSize: 0.2, linewidth: 1 });
  
      const gTray = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3.75, 0.12, 0), new THREE.Vector3(-3.75, 5.2, 0)]), guideMat);
      gTray.computeLineDistances();
      this.explodedLines.add(gTray);
  
      const gP1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.2, 0.12, 0), new THREE.Vector3(0.2, 3.8, 0)]), guideMat);
      gP1.computeLineDistances();
      this.explodedLines.add(gP1);
  
      const gP2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(4.2, 0.12, 0), new THREE.Vector3(4.2, 4.6, 0)]), guideMat);
      gP2.computeLineDistances();
      this.explodedLines.add(gP2);
  
      this.explodedLines.visible = false;
      this.panGroup.add(this.explodedLines);
    }
  
    applyConfiguration(configName, animate = true) {
      this.currentConfig = configName;
  
      this.cupcakeTray.visible = true;
      this.partition1.group.visible = true;
      this.partition2.group.visible = true;
      this.cupcakes.forEach(c => c.visible = false);
      this.targetExplodedFactor = 0;
      this.explodedLines.visible = false;
      if (this.zoneMesh) this.zoneMesh.visible = false;
  
      switch (configName) {
        case 'assembled':
          // Exactly matches the reference render
          this.targetPositions = {
            basePan: { x: 0, y: 0, z: 0 },
            cupcakeTray: { x: -3.75, y: 0.12, z: 0 },
            partition1: { x: 0.2, y: 0.12, z: 0 },
            partition2: { x: 4.2, y: 0.12, z: 0 }
          };
          this.setClaspsLocked(true);
          this.setCameraPreset('isometric');
          break;
  
        case 'exploded':
          this.targetPositions = {
            basePan: { x: 0, y: 0, z: 0 },
            cupcakeTray: { x: -3.75, y: 4.5, z: 0 },
            partition1: { x: 0.2, y: 3.0, z: 0 },
            partition2: { x: 4.2, y: 3.8, z: 0 }
          };
          this.targetExplodedFactor = 1.0;
          this.explodedLines.visible = true;
          this.setClaspsLocked(false);
          this.setCameraPreset('isometric');
          break;
  
        case 'cupcakes':
          this.targetPositions = {
            basePan: { x: 0, y: 0, z: 0 },
            cupcakeTray: { x: -3.75, y: 0.12, z: 0 },
            partition1: { x: 0.2, y: 0.12, z: 0 },
            partition2: { x: 4.2, y: 0.12, z: 0 }
          };
          this.cupcakes.forEach(c => c.visible = true);
          this.setClaspsLocked(true);
          this.setCameraTarget({ x: -2, y: 1.5, z: 0 }, { x: 8, y: 13, z: 12 });
          break;
  
        case 'square-cake':
          this.targetPositions = {
            basePan: { x: 0, y: 0, z: 0 },
            cupcakeTray: { x: -16, y: 0.12, z: 0 },
            partition1: { x: 2.2, y: 0.12, z: 0 },
            partition2: { x: 16, y: 0.12, z: 0 }
          };
          this.cupcakeTray.visible = false;
          this.partition2.group.visible = false;
          this.setClaspsLocked(true);
          if (this.zoneMesh) {
            this.zoneMesh.scale.set(1.0, 1.0, 1.0);
            this.zoneMesh.position.set(-2.2, 0.14, 0);
            this.zoneMesh.visible = true;
          }
          this.setCameraPreset('top');
          break;
  
        case 'rectangle-cake':
          this.targetPositions = {
            basePan: { x: 0, y: 0, z: 0 },
            cupcakeTray: { x: -16, y: 0.12, z: 0 },
            partition1: { x: 0.0, y: 0.12, z: 0 },
            partition2: { x: 16, y: 0.12, z: 0 }
          };
          this.cupcakeTray.visible = false;
          this.partition2.group.visible = false;
          this.setClaspsLocked(true);
          if (this.zoneMesh) {
            this.zoneMesh.scale.set(0.75, 1.0, 1.0);
            this.zoneMesh.position.set(-3.3, 0.14, 0);
            this.zoneMesh.visible = true;
          }
          this.setCameraPreset('isometric');
          break;
  
        case 'loaf':
          this.targetPositions = {
            basePan: { x: 0, y: 0, z: 0 },
            cupcakeTray: { x: -16, y: 0.12, z: 0 },
            partition1: { x: -2.5, y: 0.12, z: 0 },
            partition2: { x: 2.5, y: 0.12, z: 0 }
          };
          this.cupcakeTray.visible = false;
          this.setClaspsLocked(true);
          if (this.zoneMesh) {
            this.zoneMesh.scale.set(0.55, 1.0, 1.0);
            this.zoneMesh.position.set(0, 0.14, 0);
            this.zoneMesh.visible = true;
          }
          this.setCameraPreset('isometric');
          break;
  
        case 'empty':
          this.targetPositions = {
            basePan: { x: 0, y: 0, z: 0 },
            cupcakeTray: { x: -18, y: 6.0, z: 0 },
            partition1: { x: 18, y: 4.0, z: 0 },
            partition2: { x: 22, y: 4.0, z: 0 }
          };
          this.cupcakeTray.visible = false;
          this.partition1.group.visible = false;
          this.partition2.group.visible = false;
          this.setCameraPreset('isometric');
          break;
  
        case 'reset':
        default:
          return this.applyConfiguration('assembled', animate);
      }
  
      if (!animate) {
        this.currentPositions = JSON.parse(JSON.stringify(this.targetPositions));
        this.updateComponentTransforms();
      }
  
      if (typeof this.options.onConfigChange === 'function') {
        this.options.onConfigChange(configName);
      }
    }
  
    setCameraPreset(preset) {
      switch (preset) {
        case 'isometric':
          this.setCameraTarget({ x: 0, y: 0.8, z: 0 }, { x: 14.5, y: 12.5, z: 17.5 });
          break;
        case 'top':
          this.setCameraTarget({ x: 0, y: 0, z: 0 }, { x: 0.01, y: 24, z: 0.01 });
          break;
        case 'front':
          this.setCameraTarget({ x: 0, y: 1.2, z: 0 }, { x: 0, y: 2.5, z: 20 });
          break;
        case 'side':
          this.setCameraTarget({ x: 0, y: 1.2, z: 0 }, { x: 20, y: 3.5, z: 0 });
          break;
        case 'macro':
          this.setCameraTarget({ x: 0.2, y: 2.0, z: 4.8 }, { x: 2.8, y: 4.2, z: 8.8 });
          break;
      }
    }
  
    setCameraTarget(lookAt, camPos) {
      this.targetLookAt = lookAt;
      this.targetCamera = camPos;
    }
  
    setClaspsLocked(locked) {
      this.claspsLocked = locked;
      const target = locked ? 0 : 1.25;
      this.clasps.forEach(c => {
        c.locked = locked;
        c.targetAngle = target;
      });
      return this.claspsLocked;
    }
  
    toggleClasps() {
      return this.setClaspsLocked(!this.claspsLocked);
    }
  
    toggleDimensions(show) {
      this.showDimensions = show !== undefined ? show : !this.showDimensions;
      if (this.dimensionLines) this.dimensionLines.visible = this.showDimensions;
      return this.showDimensions;
    }
  
    toggleCupcakeTray(show) {
      if (show === undefined) show = !this.cupcakeTray.visible;
      this.cupcakeTray.visible = show;
      if (!show) {
        this.targetPositions.cupcakeTray = { x: -16, y: 0.12, z: 0 };
      } else {
        this.targetPositions.cupcakeTray = { x: -3.75, y: 0.12, z: 0 };
      }
      return this.cupcakeTray.visible;
    }
  
    setExplodedSlider(factor) {
      factor = Math.max(0, Math.min(1, factor));
      this.explodedFactor = factor;
      this.targetPositions.cupcakeTray.y = 0.12 + factor * 4.38;
      this.targetPositions.partition1.y = 0.12 + factor * 2.88;
      this.targetPositions.partition2.y = 0.12 + factor * 3.68;
      this.explodedLines.visible = factor > 0.05;
      
      // Smoothly unlatch clasps as components lift
      const targetAngle = factor * 1.15;
      this.clasps.forEach(c => {
        c.targetAngle = targetAngle;
      });
    }
  
    setPartitionPosition(partitionNum, xInches) {
      xInches = Math.max(-6, Math.min(6, xInches));
      xInches = Math.round(xInches); // Snap to 1-inch marks
      if (partitionNum === 1) {
        this.partition1.group.visible = true;
        this.targetPositions.partition1.x = xInches;
      } else if (partitionNum === 2) {
        this.partition2.group.visible = true;
        this.targetPositions.partition2.x = xInches;
      }
    }
  
    resetModel() {
      this.applyConfiguration('assembled', true);
      this.setCameraPreset('isometric');
      this.setClaspsLocked(true);
      this.explodedFactor = 0;
      this.targetExplodedFactor = 0;
      if (this.controls) this.controls.autoRotate = false;
    }
  
    updateComponentTransforms() {
      if (this.basePan) this.basePan.position.set(this.currentPositions.basePan.x, this.currentPositions.basePan.y, this.currentPositions.basePan.z);
      if (this.cupcakeTray) this.cupcakeTray.position.set(this.currentPositions.cupcakeTray.x, this.currentPositions.cupcakeTray.y, this.currentPositions.cupcakeTray.z);
      if (this.partition1 && this.partition1.group) this.partition1.group.position.set(this.currentPositions.partition1.x, this.currentPositions.partition1.y, this.currentPositions.partition1.z);
      if (this.partition2 && this.partition2.group) this.partition2.group.position.set(this.currentPositions.partition2.x, this.currentPositions.partition2.y, this.currentPositions.partition2.z);
    }
  
    // ==========================================
    // DIRECT 3D DRAG & POINTER INTERACTIONS
    // ==========================================
    onPointerDown(event) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
  
      const intersects = this.raycaster.intersectObjects(this.panGroup.children, true);
      if (intersects.length === 0) return;
  
      // Find the relevant component
      let hitObj = intersects[0].object;
      let targetComponent = null;
  
      let curr = hitObj;
      while (curr && curr !== this.panGroup && curr !== this.scene) {
        if (curr.userData && (curr.userData.isPartition || curr.userData.isClasp || curr.name === 'CupcakeTray')) {
          targetComponent = curr;
          break;
        }
        curr = curr.parent;
      }
  
      if (!targetComponent) return;
  
      // 1. Clasp Click Interaction
      if (targetComponent.userData && targetComponent.userData.isClasp) {
        const claspRecord = this.clasps.find(c => c.id === targetComponent.userData.claspId);
        if (claspRecord) {
          claspRecord.locked = !claspRecord.locked;
          claspRecord.targetAngle = claspRecord.locked ? 0 : 1.25;
          this.showHUD(
            claspRecord.locked ? 'Clasp Clamped (Locked)' : 'Clasp Released (Open)',
            targetComponent.userData.parentName,
            'Click again to toggle'
          );
          return;
        }
      }
  
      // 2. Direct Partition Dragging
      if (targetComponent.userData && targetComponent.userData.isPartition) {
        this.isDragging = true;
        this.activeDragPart = targetComponent.name; // 'Partition1' or 'Partition2'
        if (this.controls) this.controls.enabled = false;
        this.renderer.domElement.style.cursor = 'grabbing';
  
        // Find intersection on the horizontal drag plane
        if (this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPlaneIntersect)) {
          const currentPartX = this.activeDragPart === 'Partition1' ? this.targetPositions.partition1.x : this.targetPositions.partition2.x;
          this.dragOffset = this.dragPlaneIntersect.x - currentPartX;
        }
  
        this.showHUD(
          targetComponent.userData.title,
          'Dragging along 1-inch marks',
          'Release to snap'
        );
      }
    }
  
    onPointerMove(event) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
  
      // If dragging an active partition
      if (this.isDragging && this.activeDragPart) {
        if (this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPlaneIntersect)) {
          let newX = this.dragPlaneIntersect.x - this.dragOffset;
  
          if (this.activeDragPart === 'Partition1') {
            newX = Math.max(-4.5, Math.min(5.0, newX));
            this.targetPositions.partition1.x = newX;
            // Sync with range slider if present
            const slider1 = document.getElementById('partition1RangeInput');
            if (slider1) slider1.value = Math.round(newX);
          } else if (this.activeDragPart === 'Partition2') {
            newX = Math.max(-2.0, Math.min(6.2, newX));
            this.targetPositions.partition2.x = newX;
            const slider2 = document.getElementById('partition2RangeInput');
            if (slider2) slider2.value = Math.round(newX);
          }
  
          const snapped = Math.round(newX);
          this.showHUD(
            this.activeDragPart === 'Partition1' ? 'Partition 1 Position' : 'Partition 2 Position',
            `${snapped >= 0 ? '+' : ''}${snapped}" Mark`,
            'Magnetic alignment guide'
          );
        }
        return;
      }
  
      // Hover detection
      const intersects = this.raycaster.intersectObjects(this.panGroup.children, true);
      if (intersects.length > 0) {
        let curr = intersects[0].object;
        let info = null;
  
        while (curr && curr !== this.panGroup && curr !== this.scene) {
          if (curr.userData && curr.userData.title) {
            info = curr.userData;
            break;
          }
          curr = curr.parent;
        }
  
        if (info) {
          this.renderer.domElement.style.cursor = info.isPartition ? 'grab' : (info.isClasp ? 'pointer' : 'default');
          this.showHUD(info.title, info.spec || '', info.hint || '');
          return;
        }
      }
  
      this.renderer.domElement.style.cursor = 'default';
      this.hideHUD();
    }
  
    onPointerUp() {
      if (this.isDragging && this.activeDragPart) {
        // Snap to nearest 1-inch mark on release
        if (this.activeDragPart === 'Partition1') {
          this.targetPositions.partition1.x = Math.round(this.targetPositions.partition1.x);
        } else if (this.activeDragPart === 'Partition2') {
          this.targetPositions.partition2.x = Math.round(this.targetPositions.partition2.x);
        }
        this.isDragging = false;
        this.activeDragPart = null;
        if (this.controls) this.controls.enabled = true;
        this.renderer.domElement.style.cursor = 'default';
        this.hideHUD();
      }
    }
  
    onWindowResize() {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  
    animate() {
      if (this.isDestroyed) return;
      this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  
      const dt = Math.min(this.clock.getDelta(), 0.1);
      const lerpSpeed = 7.0 * dt;
  
      // Smooth component position lerping
      ['basePan', 'cupcakeTray', 'partition1', 'partition2'].forEach(key => {
        if (this.targetPositions[key] && this.currentPositions[key]) {
          this.currentPositions[key].x += (this.targetPositions[key].x - this.currentPositions[key].x) * lerpSpeed;
          this.currentPositions[key].y += (this.targetPositions[key].y - this.currentPositions[key].y) * lerpSpeed;
          this.currentPositions[key].z += (this.targetPositions[key].z - this.currentPositions[key].z) * lerpSpeed;
        }
      });
      this.updateComponentTransforms();
  
      // Smooth clasp pivot angles
      this.clasps.forEach(clasp => {
        clasp.currentAngle += (clasp.targetAngle - clasp.currentAngle) * (10.0 * dt);
        if (clasp.pivot) {
          clasp.pivot.rotation.x = -clasp.currentAngle;
        }
      });
  
      // Smooth camera transition
      if (this.targetCamera) {
        this.camera.position.x += (this.targetCamera.x - this.camera.position.x) * (3.5 * dt);
        this.camera.position.y += (this.targetCamera.y - this.camera.position.y) * (3.5 * dt);
        this.camera.position.z += (this.targetCamera.z - this.camera.position.z) * (3.5 * dt);
      }
      if (this.controls && this.targetLookAt) {
        this.controls.target.x += (this.targetLookAt.x - this.controls.target.x) * (3.5 * dt);
        this.controls.target.y += (this.targetLookAt.y - this.controls.target.y) * (3.5 * dt);
        this.controls.target.z += (this.targetLookAt.z - this.controls.target.z) * (3.5 * dt);
        this.controls.update();
      }
  
      this.renderer.render(this.scene, this.camera);
    }

    destroy() {
      this.isDestroyed = true;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
        this.resizeHandler = null;
      }
      if (this.pointerUpHandler) {
        window.removeEventListener('pointerup', this.pointerUpHandler);
        this.pointerUpHandler = null;
      }
      if (this.controls && typeof this.controls.dispose === 'function') {
        try { this.controls.dispose(); } catch (e) {}
      }
      if (this.renderer) {
        try {
          if (this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
          }
          if (typeof this.renderer.dispose === 'function') {
            this.renderer.dispose();
          }
        } catch (e) {}
      }
    }
  }


  // ==========================================
  // 4. SCROLL STORY CONTROLLER
  // ==========================================
  class BakeShiftStoryController {
    constructor(container, viewerInstance) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      this.viewer = viewerInstance;
      if (!this.container) return;

      this.cards = this.container.querySelectorAll('.story-card');
      this.slides = this.container.querySelectorAll('.story-visual-slide');
      this.navIndicators = this.container.querySelectorAll('.stage-indicator-btn');
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

  // ==========================================
  // 5. MAIN APPLICATION CONTROLLER
  // ==========================================
  class BakeShiftApp {
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

      document.addEventListener('click', (e) => {
        const header = e.target.closest('.accordion-header');
        if (header) {
          const item = header.closest('.accordion-item');
          if (item) item.classList.toggle('open');
        }
      });
    }

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

      document.querySelectorAll('.nav-link').forEach(link => {
        const href = this.cleanRoute(link.getAttribute('href'));
        if (href === route || ((route === 'home' || route === 'overview') && href === 'home')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

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
      const mobileToggle = document.getElementById('mobileNavToggle');
      const mobileMenu = document.getElementById('mobileMenuOverlay');

      if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
          mobileMenu.classList.toggle('open');
        });
        mobileMenu.querySelectorAll('a').forEach(a => {
          a.addEventListener('click', () => mobileMenu.classList.remove('open'));
        });
      }

      document.querySelectorAll('.cart-trigger-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          cart.openDrawer();
        });
      });

      const closeDrawerBtn = document.getElementById('closeBagDrawer');
      const backdrop = document.getElementById('bagBackdrop');
      if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => cart.closeDrawer());
      if (backdrop) backdrop.addEventListener('click', () => cart.closeDrawer());
    }

    setupStickyBar() {
      window.addEventListener('scroll', () => {
        const bar = document.getElementById('stickyPurchaseBar');
        if (!bar) return;
        if (this.currentRoute === 'shop' && window.scrollY > 350) {
          bar.classList.add('visible');
        } else {
          bar.classList.remove('visible');
        }
      });
    }

    setupCartListeners() {
      cart.subscribe((state) => {
        this.updateCartBadges(state.totalCount);
        this.renderBagDrawer(state);

        if (this.currentRoute === 'bag') {
          this.renderBagPage(document.getElementById('mainContent'));
        } else if (this.currentRoute === 'checkout-preview') {
          this.renderCheckoutPreview(document.getElementById('mainContent'));
        }

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
        badge.classList.toggle('has-items', count > 0);
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
            <a href="#shop" class="btn btn-copper btn-sm" onclick="window.bakeshiftApp.closeDrawer()">Shop BAKESHIFT — $47.00</a>
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
      const totalFormatted = state.items.length > 0 ? state.totalFormatted : '$52.88';

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
                <button class="btn btn-copper btn-lg" onclick="window.bakeshiftApp.quickBuy()">Buy — $47.00</button>
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
              <span class="spec-pill">$47.00 Complete System</span>
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
          </div>
        </section>

        <!-- MODULAR ENGINEERING STORY (SECTION 4) -->
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
                        <a href="#shop" class="btn btn-copper btn-md">Shop BAKESHIFT — $47.00</a>
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
                      Buy $47.00
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
                  <span style="font-weight: 700; color: var(--color-copper);">$47.00 Fixed</span>
                </div>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.92rem; color: var(--color-charcoal);">
                  <li>✓ 1 modular pan configures to cupcakes, cakes, & loaves</li>
                  <li>✓ Ultra-slim 2.0" profile saves 70% cabinet space</li>
                  <li>✓ Heavy-gauge aluminized steel with zero warping</li>
                  <li>✓ Bare metal metallurgy: 100% PTFE/PFOA/Silicone-free</li>
                  <li>✓ Lifetime heirloom durability for just $47.00</li>
                </ul>
              </div>
            </div>

            <div style="margin-top: 3.5rem;">
              <button class="btn btn-copper btn-lg" onclick="window.bakeshiftApp.quickBuy()">Get BAKESHIFT for $47.00</button>
            </div>
          </div>
        </section>
      `;

      if (THREE) {
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
      const claspText = document.getElementById('claspBtnText');
      if (claspBtn) {
        claspBtn.addEventListener('click', () => {
          const locked = viewer.toggleClasps();
          if (claspText) claspText.textContent = locked ? 'Clasps: Locked' : 'Clasps: Unlocked';
          claspBtn.classList.toggle('active', !locked);
        });
      }

      const dimBtn = document.getElementById('toggleDimensionsBtn');
      if (dimBtn) {
        dimBtn.addEventListener('click', () => {
          const active = viewer.toggleDimensions();
          dimBtn.classList.toggle('active', active);
        });
      }

      const rotBtn = document.getElementById('toggleAutoRotateBtn');
      if (rotBtn && viewer.controls) {
        rotBtn.addEventListener('click', () => {
          viewer.controls.autoRotate = !viewer.controls.autoRotate;
          rotBtn.classList.toggle('active', viewer.controls.autoRotate);
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
                Fixed retail kit price: <strong>$47.00 USD</strong>. Complete 6-item system.
              </p>
              <div style="display: flex; justify-content: center; gap: 1.0rem; flex-wrap: wrap;">
                <button class="btn btn-copper btn-lg" onclick="window.bakeshiftApp.quickBuy()">Buy BAKESHIFT — $47.00</button>
                <a href="#features" class="btn btn-outline btn-lg">View Modular Features</a>
              </div>
            </div>
          </div>
        </section>
      `;

      if (THREE) {
        const designEl = document.getElementById('designCanvasContainer');
        if (designEl) {
          this.exploreViewer = new BakeShift3DViewer(designEl, { interactive: true });
          this.bindViewerControls(this.exploreViewer);
        }
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
                      Buy $47.00
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
                    <span style="font-weight: 700; color: var(--color-copper);">$47.00 Fixed</span>
                  </div>
                  <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.92rem; color: var(--color-charcoal);">
                    <li>✓ 1 modular pan configures to cupcakes, cakes, & loaves</li>
                    <li>✓ Ultra-slim 2.0" profile saves 70% cabinet space</li>
                    <li>✓ All removable parts nest flush inside the base pan</li>
                    <li>✓ Heavy-gauge aluminized steel with zero warping</li>
                    <li>✓ Bare metal metallurgy: 100% PTFE/PFOA/Silicone-free</li>
                    <li>✓ Lifetime heirloom durability for just $47.00</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Bottom CTA -->
            <div class="text-center" style="margin-top: 2.0rem;">
              <button class="btn btn-copper btn-lg" onclick="window.bakeshiftApp.quickBuy()">Get BAKESHIFT for $47.00</button>
            </div>
          </div>
        </section>
      `;
    }

    // ==========================================
    // 2. EXPLORE PAGE (SECTION 5)
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
                <button class="btn btn-copper btn-sm" onclick="window.bakeshiftApp.quickBuy()">Buy Now — $47.00</button>
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
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-charcoal); margin-bottom: 0.35rem;" id="cfgTitle">Full Assembled Baking Kit</h3>
                <p style="font-size: 0.92rem; color: var(--color-muted-text); max-width: 650px;" id="cfgDesc">
                  Main 15×10×2" aluminized steel pan with removable 6-cup muffin tray (2×3 layout) and two independently adjustable partitions. All six wire toggle clasps secure firmly against the outer rim.
                </p>
              </div>
              <button class="btn btn-copper btn-md" onclick="window.bakeshiftApp.quickBuy()">Order BAKESHIFT — $47.00</button>
            </div>
          </div>
        </section>
      `;

      if (THREE) {
        const labEl = document.getElementById('exploreLabCanvas');
        if (labEl) {
          this.exploreViewer = new BakeShift3DViewer(labEl, {
            interactive: true,
            onConfigChange: (cfg) => {
              const lbl = document.getElementById('exploreActiveLabel');
              const cfgTitle = document.getElementById('cfgTitle');
              const cfgDesc = document.getElementById('cfgDesc');
              const slider = document.getElementById('explodedRangeInput');
              const sliderVal = document.getElementById('explodedSliderVal');

              if (lbl) lbl.textContent = cfg.charAt(0).toUpperCase() + cfg.slice(1) + ' Configuration';
              if (cfg === 'exploded' && slider) {
                slider.value = 100;
                if (sliderVal) sliderVal.textContent = '100%';
              } else if (cfg === 'assembled' && slider) {
                slider.value = 0;
                if (sliderVal) sliderVal.textContent = '0%';
              }

              if (cfgTitle && cfgDesc) {
                const found = CONFIGURATIONS.find(c => c.id === cfg);
                if (found) {
                  cfgTitle.textContent = found.name;
                  cfgDesc.textContent = found.details;
                } else if (cfg === 'exploded') {
                  cfgTitle.textContent = 'Exploded Component View';
                  cfgDesc.textContent = 'Base pan, removable six-cup tray, and dual partitions separated along the vertical axis with clasps attached to their respective components.';
                } else if (cfg === 'empty') {
                  cfgTitle.textContent = 'Bare Base Pan (15 × 10 × 2 in)';
                  cfgDesc.textContent = 'Clean aluminized steel canvas with 13.2 × 9.0" interior usable floor and shallow 1-inch laser alignment marks.';
                } else {
                  cfgTitle.textContent = 'Full Assembled Baking Kit';
                  cfgDesc.textContent = 'Main 15×10×2" aluminized steel pan with removable 6-cup muffin tray and two independently adjustable partitions.';
                }
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
                <img src="assets/images/bakeshift-clasp-detail.jpg" alt="Stainless Wire Cam Tensioning" style="width: 100%; height: 260px; object-fit: contain; background: var(--color-cream); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 1rem;">
              </div>

              <!-- Step 4 -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.0rem; align-items: center;">
                <div style="order: 2;">
                  <span class="story-step-number">STEP 04</span>
                  <h3 style="font-size: 1.8rem; margin: 0.5rem 0;">Honest Culinary Advice</h3>
                  <p style="color: var(--color-muted-text); font-size: 0.95rem; line-height: 1.7;">
                    BAKESHIFT's partitions are precision-machined for standard batters: cake batters, brownie doughs, bread loaves, and roasting. For thin, watery liquids (like custards or flans), simply line the partition junction with parchment paper.
                  </p>
                </div>
                <div style="order: 1;">
                  <img src="assets/images/step-4-baking-results.svg" alt="Bakery-Grade Results" style="width: 100%; height: 260px; object-fit: contain; background: var(--color-cream); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 1rem;">
                </div>
              </div>
            </div>

            <div class="text-center" style="margin-top: 5.0rem;">
              <a href="#shop" class="btn btn-copper btn-lg">Order BAKESHIFT for $47.00</a>
            </div>
          </div>
        </section>
      `;
    }

    // ==========================================
    // 4. SPECIFICATIONS & ENGINEERING (SECTION 6)
    // ==========================================
    renderSpecsPage(container) {
      container.innerHTML = `
        <section class="section">
          <div class="container container-narrow">
            <div class="text-center" style="margin-bottom: 3.5rem;">
              <span class="eyebrow">Engineering Specifications</span>
              <h1 class="headline-section">Technical Specifications</h1>
              <p style="color: var(--color-muted-text); margin-top: 0.6rem;">
                Exact engineering geometry, weights, and metallurgy for the BAKESHIFT modular system.
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
              <a href="#shop" class="btn btn-copper btn-lg">Shop BAKESHIFT — $47.00</a>
            </div>
          </div>
        </section>
      `;
    }

    // ==========================================
    // 5. SHOP PRODUCT PAGE (SECTION 7)
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
                    <img src="assets/images/bakeshift-assembled-hero.jpg" alt="BAKESHIFT Assembled Pan" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                  </div>
                  <div id="shopImgExploded" style="display: none; width: 100%; height: 100%; background: var(--color-white); align-items: center; justify-content: center; padding: 1.5rem;">
                    <img src="assets/images/bakeshift-exploded-view.jpg" alt="BAKESHIFT Exploded Assembly" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                  </div>
                  <div id="shopImgClasp" style="display: none; width: 100%; height: 100%; background: var(--color-white); align-items: center; justify-content: center; padding: 1.5rem;">
                    <img src="assets/images/bakeshift-clasp-detail.jpg" alt="BAKESHIFT Clasp Detail" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                  </div>
                  <div id="shopImgConfigs" style="display: none; width: 100%; height: 100%; background: var(--color-white); align-items: center; justify-content: center; padding: 1.5rem;">
                    <img src="assets/images/bakeshift-configurations.jpg" alt="BAKESHIFT 4 Baking Configurations" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                  </div>
                </div>

                <!-- 5 Clickable Gallery Thumbnails -->
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; margin-top: 1.0rem;">
                  <button class="shop-thumb-btn active" id="thumb3D" onclick="window.bakeshiftApp.switchShopView('3d')" style="padding: 4px; border: 2px solid var(--color-copper); border-radius: var(--radius-sm); background: var(--color-cream); cursor: pointer; height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal);">3D Orbit</span>
                    <span style="font-size: 0.62rem; color: var(--color-copper);">Model</span>
                  </button>
                  <button class="shop-thumb-btn" id="thumbHero" onclick="window.bakeshiftApp.switchShopView('hero')" style="padding: 4px; border: 2px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-white); cursor: pointer; height: 60px; overflow: hidden;" title="Assembled Hero Pan">
                    <img src="assets/images/bakeshift-assembled-hero.jpg" style="width: 100%; height: 100%; object-fit: contain;">
                  </button>
                  <button class="shop-thumb-btn" id="thumbExploded" onclick="window.bakeshiftApp.switchShopView('exploded')" style="padding: 4px; border: 2px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-white); cursor: pointer; height: 60px; overflow: hidden;" title="Exploded View">
                    <img src="assets/images/bakeshift-exploded-view.jpg" style="width: 100%; height: 100%; object-fit: contain;">
                  </button>
                  <button class="shop-thumb-btn" id="thumbClasp" onclick="window.bakeshiftApp.switchShopView('clasp')" style="padding: 4px; border: 2px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-white); cursor: pointer; height: 60px; overflow: hidden;" title="Clasp Mechanism">
                    <img src="assets/images/bakeshift-clasp-detail.jpg" style="width: 100%; height: 100%; object-fit: contain;">
                  </button>
                  <button class="shop-thumb-btn" id="thumbConfigs" onclick="window.bakeshiftApp.switchShopView('configs')" style="padding: 4px; border: 2px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-white); cursor: pointer; height: 60px; overflow: hidden;" title="Baking Configurations">
                    <img src="assets/images/bakeshift-configurations.jpg" style="width: 100%; height: 100%; object-fit: contain;">
                  </button>
                </div>

                <!-- 3D Config Controls -->
                <div id="shop3dControls" style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
                  <button class="btn btn-outline btn-sm" onclick="window.bakeshiftApp.shopViewer.applyConfiguration('assembled')">Assembled</button>
                  <button class="btn btn-outline btn-sm" onclick="window.bakeshiftApp.shopViewer.applyConfiguration('exploded')">Exploded</button>
                  <button class="btn btn-outline btn-sm" onclick="window.bakeshiftApp.shopViewer.applyConfiguration('cupcakes')">Cupcakes (2×3)</button>
                  <button class="btn btn-outline btn-sm" onclick="window.bakeshiftApp.shopViewer.applyConfiguration('loaf')">Loaf (5×9)</button>
                </div>
              </div>

              <!-- Product Purchase Details Column -->
              <div class="shop-info-column" id="product-details">
                <span class="eyebrow">Official Store</span>
                <h1 style="font-size: 2.6rem; line-height: 1.1; margin: 0.4rem 0;">${BAKESHIFT_PRODUCT.name}</h1>
                <p style="font-size: 1.1rem; color: var(--color-copper); font-weight: 600;">${BAKESHIFT_PRODUCT.slogan}</p>
                <div class="product-price-tag">$47.00</div>

                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.88rem; color: #2e7d32; font-weight: 500;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Launch Batch 1 — Ready to Reserve
                </div>

                <p style="font-size: 0.95rem; color: var(--color-muted-text); line-height: 1.6; margin-bottom: 2.0rem;">
                  The complete modular baking system. Includes the 15×10×2" aluminized steel base pan, 6-cup muffin insert (2×3 grid), 2 removable bare-metal partitions, and 6 installed stainless toggle clasps with copper accents.
                </p>

                <!-- Quantity Stepper & Subtotal Calculation -->
                <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem;">
                  <div class="quantity-stepper">
                    <button class="qty-btn" id="shopQtyMinus">-</button>
                    <span class="qty-display" id="shopQtyDisplay">1</span>
                    <button class="qty-btn" id="shopQtyPlus">+</button>
                  </div>
                  <div style="font-size: 1.15rem; font-weight: 700; color: var(--color-charcoal);" id="shopTotalCalc">$47.00 Total</div>
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
                      <p>Standard tracked US ground shipping is $2.00 per order (2–4 business days). Applicable state sales tax (8.25%) is calculated and applied at checkout.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;

      if (THREE) {
        const shopEl = document.getElementById('shopViewerContainer');
        if (shopEl) this.shopViewer = new BakeShift3DViewer(shopEl, { interactive: true });
      }

      const minusBtn = document.getElementById('shopQtyMinus');
      const plusBtn = document.getElementById('shopQtyPlus');
      const display = document.getElementById('shopQtyDisplay');
      const totalEl = document.getElementById('shopTotalCalc');

      const updateShopTotal = () => {
        display.textContent = this.selectedShopQty;
        totalEl.textContent = `$${(BAKESHIFT_PRODUCT.price * this.selectedShopQty).toFixed(2)} Total`;
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

    addCurrentToBag() {
      cart.addItem(BAKESHIFT_PRODUCT, 1, true);
    }

    quickBuy() {
      cart.addItem(BAKESHIFT_PRODUCT, 1, false);
      this.navigateTo('checkout-preview');
    }

    // ==========================================
    // 6. SHOPPING BAG PAGE (SECTION 8)
    // ==========================================
    renderBagPage(container) {
      const state = cart.getState();
      container.innerHTML = `
        <section class="section">
          <div class="container container-narrow">
            <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.5rem;">
              <img src="assets/images/bakeshift-logo.png" alt="BakeShift" style="height: 48px; width: auto; object-fit: contain;">
              <h1 class="headline-section" style="margin-bottom: 0;">Review your Bag.</h1>
            </div>
            <p style="color: var(--color-muted-text); margin-bottom: 2.5rem; font-size: 0.95rem;">
              Standard tracked US ground shipping ($2.00) and sales tax (8.25%) are calculated below.
            </p>
            ${state.items.length === 0 ? `
              <div style="text-align: center; padding: 5rem 1rem; background: var(--color-light-gray); border-radius: var(--radius-lg);">
                <h3 style="font-size: 1.5rem; margin-bottom: 0.6rem;">Your Bag is empty.</h3>
                <p style="color: var(--color-muted-text); margin-bottom: 2.0rem;">Add the BAKESHIFT modular system to experience clutter-free baking.</p>
                <div style="display: flex; justify-content: center; gap: 1.0rem; flex-wrap: wrap;">
                  <a href="#shop" class="btn btn-copper btn-lg">Shop BAKESHIFT — $47.00</a>
                  <a href="#shop" class="btn btn-outline btn-lg">Continue Shopping</a>
                </div>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 3.0rem;">
                ${state.items.map(item => `
                  <div style="display: flex; gap: 2.0rem; padding: 2.0rem; background: var(--color-cream-card); border-radius: var(--radius-lg); border: 1px solid var(--color-border); align-items: center; box-shadow: 0 4px 16px var(--color-shadow);">
                    <div class="bag-item-thumb" style="width: 90px; height: 90px; background: var(--color-white); border-radius: var(--radius-md); border: 1px solid var(--color-border); padding: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <img src="assets/images/bakeshift-assembled-hero.jpg" alt="BAKESHIFT Pan" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div style="flex: 1;">
                      <h3 style="font-size: 1.3rem;">${item.name}</h3>
                      <p style="font-size: 0.9rem; color: var(--color-muted-text); margin: 0.3rem 0 1.0rem;">$${item.price.toFixed(2)} each</p>
                      <div style="display: flex; align-items: center; gap: 1.5rem;">
                        <div class="quantity-stepper">
                          <button class="qty-btn" onclick="window.bakeshiftApp.decrementItem('${item.id}')">-</button>
                          <span class="qty-display">${item.quantity}</span>
                          <button class="qty-btn" onclick="window.bakeshiftApp.incrementItem('${item.id}')">+</button>
                        </div>
                        <button style="background: none; border: none; font-size: 0.85rem; color: #d9383a; cursor: pointer;" onclick="window.bakeshiftApp.removeItem('${item.id}')">Remove</button>
                      </div>
                    </div>
                    <div style="font-size: 1.5rem; font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                `).join('')}
              </div>

              <div style="background: var(--color-light-gray); padding: 2.5rem; border-radius: var(--radius-lg); max-width: 500px; margin-left: auto;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 1.05rem;">
                  <span>Subtotal</span>
                  <span style="font-weight: 700;">${state.subtotalFormatted}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.95rem; color: var(--color-muted-text);">
                  <span>Tracked US Shipping</span>
                  <span style="font-weight: 600; color: var(--color-charcoal);">${state.shippingFormatted}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 1.25rem; font-size: 0.95rem; color: var(--color-muted-text);">
                  <span>Estimated Sales Tax (8.25%)</span>
                  <span style="font-weight: 600; color: var(--color-charcoal);">${state.taxFormatted}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 1.25rem; border-top: 1px solid var(--color-border); font-size: 1.35rem; font-weight: 700; margin-bottom: 1.75rem;">
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
    // 7. CHECKOUT PREVIEW (DEMO ONLY — SECTION 9)
    // ==========================================
    renderCheckoutPreview(container) {
      this.checkoutMode = this.checkoutMode || 'preview';
      const state = cart.getState();
      const hasItems = state.items.length > 0;
      const subtotalFormatted = hasItems ? state.subtotalFormatted : '$47.00';
      const shippingFormatted = hasItems ? state.shippingFormatted : '$2.00';
      const taxFormatted = hasItems ? state.taxFormatted : '$3.88';
      const totalFormatted = hasItems ? state.totalFormatted : '$52.88';
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
                <div class="step-indicator active"><span class="step-circle">2</span><span>Shipping ($2.00)</span></div>
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
                        <div style="font-size: 0.8rem; color: var(--color-muted-text);">Qty: ${totalUnits} · $47.00 each</div>
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
                        <div style="font-size: 0.8rem; color: var(--color-muted-text);">Qty: ${totalUnits} · $47.00 each</div>
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
              <a href="#shop" class="btn btn-copper btn-lg">Experience BAKESHIFT — $47.00</a>
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
                <div><strong>Retail System:</strong> $47.00 USD Complete Baking System</div>
              </div>
              <div style="margin-top: 2.0rem;">
                <a href="#shop" class="btn btn-copper btn-md" style="width: 100%;">Explore Product — $47.00</a>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      window.bakeshiftApp = new BakeShiftApp();
    });
  } else {
    window.bakeshiftApp = new BakeShiftApp();
  }
})();
