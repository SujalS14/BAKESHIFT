/**
 * BAKESHIFT Product Data, Specifications, Stories & FAQs
 * Brand Slogan: BAKE MORE WITH LESS.
 * Base Price: $54.99 USD
 */

export const BRAND = {
  name: 'BAKESHIFT',
  slogan: 'BAKE MORE WITH LESS.',
  subheading: 'One pan. Endless possibilities.',
  description: 'Meet BAKESHIFT — one innovative baking system designed to bring flexibility, convenience, and creativity into your kitchen.',
  price: 54.99,
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

export const BAKESHIFT_PRODUCT = {
  id: 'bakeshift-complete-system',
  name: 'BAKESHIFT Complete Baking System',
  slogan: 'BAKE MORE WITH LESS.',
  subheading: 'One pan. Endless possibilities.',
  description: 'Meet BAKESHIFT — one innovative baking system designed to bring flexibility, convenience, and creativity into your kitchen.',
  price: 54.99,
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

export const CONFIGURATIONS = [
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

export const SCROLL_STORIES = [
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
      { label: 'Complete System', value: '$54.99 Fixed' }
    ]
  }
];

export const TECHNICAL_SPECS = {
  general: [
    { label: 'Product Name', value: 'BAKESHIFT Complete Baking System' },
    { label: 'Retail Price', value: '$54.99 USD (Complete Kit)' },
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

export const FAQS = [
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
    a: 'The final retail price is $54.99 USD for the complete kit. The package includes: (1) aluminized-steel base pan (15×10×2 in), (1) removable six-cup cupcake tray (2×3 grid), (2) adjustable bare-metal partitions, (6) mounted toggle clasps, and a quick-start configuration guide.'
  },
  {
    q: 'Is this website ready to process customer orders?',
    a: 'This website is an interactive product preview for investors, manufacturing partners, and early culinary enthusiasts. Online purchasing is launching soon. No personal information or payments are collected or processed at this time.'
  }
];

export const COMPANY_STORY = {
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
