/**
 * BAKESHIFT Shopping Cart Engine
 * Real functioning client-side cart with LocalStorage persistence
 * Fixed demo price: $55.00 per unit
 */

export const BAKESHIFT_PRODUCT = {
  id: 'bakeshift-complete-system',
  name: 'BAKESHIFT — Complete Baking System',
  slogan: 'BAKE MORE WITH LESS.',
  price: 55.00,
  currency: 'USD',
  material: 'Heavy-Gauge Aluminized Steel',
  dimensions: '15" × 10" × 2" (381 × 254 × 50.8 mm)',
  inStock: true,
  leadTime: 'Launch Batch 1 — Ships in 48h',
  image: 'assets/images/bakeshift-assembled-hero.jpg',
  includes: [
    '1 Heavy-Gauge Aluminized Steel Base Pan (15 × 10 × 2 in)',
    '1 Removable 6-Cup Muffin Tray (2 × 3 Grid)',
    '2 Removable Adjustable Partitions (Bare Metal)',
    '6 Pre-Installed Stainless Wire Toggle Clasps with Copper Accents',
    'Laser-Etched 1-Inch Alignment Guides along Rim',
    'Quick-Start Culinary & Configuration Guide',
    '30-Day Risk-Free Kitchen Trial Guarantee'
  ]
};

const STORAGE_KEY = 'bakeshift_cart_v2';

class CartStore {
  constructor() {
    this.items = [];
    this.listeners = new Set();
    this.drawerOpen = false;
    this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.items = Array.isArray(parsed) ? parsed : [];
        this.items.forEach(item => {
          if (item.id === BAKESHIFT_PRODUCT.id) item.price = BAKESHIFT_PRODUCT.price;
        });
      } else {
        this.items = [];
      }
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
      this.items = [];
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }

  getState() {
    const totalCount = this.items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotalRaw = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const subtotal = Math.round(subtotalRaw * 100) / 100;
    const shipping = totalCount > 0 ? 2.30 : 0.00;
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
    quantity = Math.max(1, parseInt(quantity, 10) || 1);
    const existingIndex = this.items.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    if (openDrawer) {
      this.drawerOpen = true;
    }
    this.save();
    return this.getState();
  }

  updateQuantity(productId, quantity) {
    quantity = parseInt(quantity, 10);
    const index = this.items.findIndex(item => item.id === productId);

    if (index > -1) {
      if (quantity <= 0) {
        this.items.splice(index, 1);
      } else {
        this.items[index].quantity = quantity;
      }
      this.save();
    }
    return this.getState();
  }

  incrementQuantity(productId) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
    return this.getState();
  }

  clearCart() {
    this.items = [];
    this.save();
    return this.getState();
  }

  openDrawer() {
    this.drawerOpen = true;
    this.notify();
  }

  closeDrawer() {
    this.drawerOpen = false;
    this.notify();
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
    this.notify();
  }
}

export const cart = new CartStore();
